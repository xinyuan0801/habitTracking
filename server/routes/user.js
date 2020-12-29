const log = console.log

const express = require('express');
const router = express.Router();

const { User } = require('../models/User')
const Accounts = require("../models/Account");
const Count = require("../models/Count")

const { mongoChecker, isMongoError } = require("./helpers/helpers");

// Set up a POST route to create a user
/*
Request body expects:
{
  username: string｜ username for the created account
  password: string | password for created account
}
*/
router.post('/users', mongoChecker, async (req, res) => {
	try {
		const user = await User.findOne({username: req.body.username})
		if(user){
			res.send("Username is already taken.")
		}
		else{
			const count = await Count.findOne({id: "count"})

			const user = new User({
				username: req.body.username,
				password: req.body.password,
				account: count.count
			})

			const account = new Accounts({
		    account_id: count.count,
		    name: "New User",
		    habits: [],
			banned: false,
				creator: null
			})
			const savedUser = await user.save()
			account.creator = savedUser._id
			const savedAccount = await account.save()
			await Count.updateOne({id: "count"}, { $inc: {count: 1}})
			res.send(savedUser,savedAccount,{created: true})
		}
	} catch (error) {
		if (isMongoError(error)) {
			res.status(500).send('Internal server error')
		} else {
			log(error)
			res.status(400).send('Bad Request')
		}
	}
})

// A route to login and create a session
/*
Request body expects:
{
  username: string｜ username for login
  password: string | password for login
}
*/
router.post('/users/login', mongoChecker, async (req, res) => {
	const username = req.body.username
  const password = req.body.password

  try {
	    const token = await User.findByUsernamePassword(username, password);
			if (!token) {
				res.status(404).send('Resource not found')
			} else {
				res.send(token)
			}
    } catch (error) {
    	if (isMongoError(error)) {
        //res.status(500).redirect('/login'); //MUST CHANGE
        res.status(500).send('Internal server error')
      } else {
  			log(error)
  			//res.status(400).redirect('/login'); //MUST CHANGE
        res.status(400).send('Bad Request')
		    }
    }
})

//A route to login admin
/*
Request body expects:
{
  username: string｜ username for admin
  password: string | password for admin
}
*/
router.post('/admins/login', mongoChecker, async (req, res) => {
	const username = req.body.username
  const password = req.body.password

  try {
		if(username === "admin" &&  password === "admin"){
			const token = await User.findByUsernamePassword(username, password);
			res.send({admin: true, token})
		}
		else{
			res.send({admin: false})
		}
    } catch (error) {
    	if (isMongoError(error)) {
        res.status(500).send('Internal server error')
      } else {
				log(error)
        res.status(400).send('Bad Request')
		    }
    }
})

module.exports = router
