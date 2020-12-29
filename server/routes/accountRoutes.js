const express = require("express");
const { ObjectID } = require("mongodb");
const { Mongoose } = require("mongoose");
const passport = require('passport')
const jwt = require('jsonwebtoken')

const router = express.Router();
const Accounts = require("../models/Account");
const Habits = require("../models/Habit");
const { User } = require('../models/User')

const { mongoChecker, isMongoError } = require("./helpers/helpers");
const authenticate  = passport.authenticate('jwt', {session: false})

// Pure Account API

//get all Accounts

router.get("/allAccount", mongoChecker , async (req, res) => {

    try {
      let account = await Accounts.find({});
      if(!account){
        throw new Error('no account found');
      }
      console.log("got all Accounts");
      res.send(account);
    } catch (error){
      console.log("get all account error")
    }
  });

//get the account of the user in the session
router.get('/account', mongoChecker, authenticate, async (req, res) => {
  const id = req.user._id


  if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

	try {
		const account = await Accounts.findOne({creator: id});
		if (!account) {
			res.status(404).send('Resource not found')  // could not find this account.
		} else {
			res.send(account)
		}
	} catch(error) {
		console.log(error)
		res.status(500).send('Internal Server Error')  // server error
	}
});

//get an account by id (from admin)
router.get('/getAccount/:id', mongoChecker, authenticate, async (req, res) => {
	const id = req.params.id

	/*
	if (!ObjectID.isValid(id)) {
		  res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		  return;  // so that we don't run the rest of the handler.
	}*/
	  try {
		  const account = await Accounts.findOne({account_id: id});
		  if (!account) {
			  res.status(404).send('Resource not found')  // could not find this account.
		  } else {
			  res.send(account)
		  }
	  } catch(error) {
		  console.log(error)
		  res.status(500).send('Internal Server Error')  // server error
	  }
  });

//see if account is banned
router.get('/accountBanned/:id', mongoChecker, async (req, res) => {
  const id = req.params.id

/*
  if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }*/

	try {
		const account = await Accounts.findOne({account_id: id}).select('banned -_id');
		if (!account) {
			res.status(404).send('Resource not found')  // could not find this account.
		} else {
			res.send(account)
		}
	} catch(error) {
		console.log(error)
		res.status(500).send('Internal Server Error')  // server error
	}
});

//delete account by id
router.delete('/account/:id', mongoChecker , async (req, res) => {
  const id = req.params.id
  /*
  if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }*/
	try {
		const account = await Accounts.findOneAndDelete({account_id: id})
    const creator = account.creator
    const user = await User.findOneAndDelete({_id: creator})
		if (!account) {
			res.status(404).send()
		} else {
			res.send(account)
		}
	} catch(error) {
		console.log(error)
		res.status(500).send() // server error, could not delete.
	}

})

//Habits in Account API

//add a new habit to account
router.patch('/accountHabits', mongoChecker, authenticate, async (req, res) => {
	const id = req.user._id
  const habit_id = req.body.habit_id

  if (!(ObjectID.isValid(id) && ObjectID.isValid(habit_id))) {
    res.status(404).send();
    return;
  }

  const habit = {
    habit_id: habit_id,
  }

	try {

		const account = await Accounts.findOneAndUpdate({creator: id}, { $push: { habits: habit }},{new: true})
		if (!account) {
			res.status(404).send('Resource not found')
		} else {
			res.send(account)
		}
	} catch (error) {
		log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request')
		}
	}
});

//get an account's list of habits
router.get('/accountHabits', mongoChecker, authenticate, async (req, res) => {
  const id = req.user._id

  if (!ObjectID.isValid(id)) {
		res.status(404).send()  // if invalid id, definitely can't find resource, 404.
		return;  // so that we don't run the rest of the handler.
  }

	try {
		const habits = await Accounts.findOne({creator: id}).select('habits -_id');
		if (!habits) {
			res.status(404).send('Resource not found')  // could not find this account.
		} else {
			res.send(habits)
		}
	} catch(error) {
		console.log(error)
		res.status(500).send('Internal Server Error')  // server error
	}
});


//general patch call... you can update anything in account.
router.patch('/account/:id', mongoChecker , authenticate, async (req, res) => {

  /*
	if (!ObjectID.isValid(id)) {
		res.status(404).send()
		return;  // so that we don't run the rest of the handler.
	}*/

	const fieldsToUpdate = {}
	req.body.map((change) => {
		const propertyToChange = change.path.substr(1) // getting rid of the '/' character
		fieldsToUpdate[propertyToChange] = change.value
	})

	// Update the student by their id.
	try {
		const account = await Accounts.findOneAndUpdate({creator: req.user._id}, {$set: fieldsToUpdate}, {new: true})
		if (!account) {
			res.status(404).send('Resource not found')
		} else {
			res.send(account)
		}
	} catch (error) {
		console.log(error)
		if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

//general patch call... for admin
router.patch('/accountAdmin/:id', mongoChecker, async (req, res) => {

	/*
	  if (!ObjectID.isValid(id)) {
		  res.status(404).send()
		  return;  // so that we don't run the rest of the handler.
	  }*/

	  const fieldsToUpdate = {}
	  req.body.map((change) => {
		  const propertyToChange = change.path.substr(1) // getting rid of the '/' character
		  fieldsToUpdate[propertyToChange] = change.value
	  })

	  try {
		  const account = await Accounts.findOneAndUpdate({account_id: req.params.id}, {$set: fieldsToUpdate}, {new: true})
		  if (!account) {
			  res.status(404).send('Resource not found')
		  } else {
			  res.send(account)
		  }
	  } catch (error) {
		  console.log(error)
		  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			  res.status(500).send('Internal server error')
		  } else {
			  res.status(400).send('Bad Request') // bad request for changing the student.
		  }
	  }
  })

//general patch call... For userprofile things..
router.patch('/accountUP', mongoChecker , authenticate, async (req, res) => {

	/*
	  if (!ObjectID.isValid(id)) {
		  res.status(404).send()
		  return;  // so that we don't run the rest of the handler.
	  }*/

	  const fieldsToUpdate = {}
	  req.body.map((change) => {
		  const propertyToChange = change.path.substr(1) // getting rid of the '/' character
		  fieldsToUpdate[propertyToChange] = change.value
	  })

	  // Update the student by their id.
	  try {
		  const account = await Accounts.findOneAndUpdate({creator: req.user._id}, {$set: fieldsToUpdate}, {new: true})
		  if (!account) {
			  res.status(404).send('Resource not found')
		  } else {
			  res.send(account)
		  }
	  } catch (error) {
		  console.log(error)
		  if (isMongoError(error)) { // check for if mongo server suddenly dissconnected before this request.
			  res.status(500).send('Internal server error')
		  } else {
			  res.status(400).send('Bad Request') // bad request for changing the student.
		  }
	  }
  })

// patch for specific habit in a account
/*
Request body expects:
{
	"account_id": int | <id of the account>
	"competing": boolean
	"recorded_today": boolean
	"days": int | <number of days>
}
*/
router.patch('/account/habit/:habitID', mongoChecker , authenticate, async (req, res) => {
	const id = req.user._id
	const habitID = req.params.habitID
	const account_id = req.body.account_id

	const habit = {habit_id: habitID, competing: req.body.competing, recorded_today: req.body.recorded_today, days: req.body.days}

	try {
		const account = await Accounts.findOneAndUpdate({account_id: account_id, "habits.habit_id": habitID}, {$set: {"habits.$": habit}}, {new: true})
		if (!account) {
			res.status(404).send('Resource not found')
		} else {
			res.send({habit , account})
		}
	} catch (error) {
		console.log(error)
		if (isMongoError(error)) {
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request')
		}
	}
})

/* <--- Update subdocumetns of Account---> */

/// Route for add the post id to account's postlked field.
/* 
Request body expects:
{
"id": String| id of Post
}
*/
// PATCH /accountLikePost
// note : dont forget the req.body!
router.patch('/accountLikePost', mongoChecker, authenticate, async (req, res) => {
	const userid = req.user._id;
	const postId = req.body.id;
	try {
		let userInfo = await Accounts.findOne({creator : userid})
		userInfo.postliked.push(postId)
		let result = {
			id: postId,
			userinfo: userInfo
		}
		res.send(result)
		userInfo.save()

	}
	catch (error) {
		console.log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

/* <--- Update subdocumetns of Account---> */

/// Route for remove the post id to account's postlked field.
/* 
Request body expects:
{
"id": String| id of Post
}
*/
// PATCH /accountUnlikePost
// note : dont forget the req.body!
router.patch('/accountUnlikePost', mongoChecker, authenticate, async (req, res) => {
	const userId = req.user._id;
	const postId = req.body.id
	try {
		let userInfo = await Accounts.findOne({creator : userId})

		userInfo.postliked = userInfo.postliked.filter(function(postid) {
			return postid != postId
		})
		userInfo.save()
		let result = {
			id: postId,
			userinfo: userInfo
		}
		res.send(result)
	}
	catch (error) {
		console.log(error) // log server error to the console, not to the client.
		if (isMongoError(error)) { // check for if mongo server suddenly disconnected before this request.
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad Request') // bad request for changing the student.
		}
	}
})

// delete habit from account
router.delete('/account/habit/:habitID', mongoChecker , authenticate, async (req, res) => {
	const id = req.user._id
	const habit_id = req.params.habitID

	try {
		const account = await Accounts.findOne({creator: id, "habits.habit_id": habit_id});
		if (!account) {
			res.status(404).send('Resource not found')  // could not find this account.
		} else {
			const account_id = account.account_id
			// Update the Habit so user is no longer competing in habit
		  	const habit = await Accounts.findOneAndUpdate({ account_id: account_id }, {$pull: { habits: { habit_id: habit_id }} } );
		    if (!habit) {
		      res.status(404).send("Resource not found"); //could not find this habit
		    } else {
		      res.send({ account, habit });
		    }
			}
	} catch(error) {
		console.log(error)
		if (isMongoError(error)) {
			// check for if mongo server suddenly dissconnected before this request.
			res.status(500).send("Internal server error");
		} else {
			res.status(400).send("Bad Request"); // bad request for changing the competitor
		}
	}
})

module.exports = router;
