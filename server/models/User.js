'use strict';

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
	account: {
		type: Number,
		required: true
	}
})

UserSchema.pre('save', function(next) {
	const user = this; // binds this to User document instance

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})

UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this

	// First find the user by their email
	return User.findOne({ username: username }).then((user) => {
		if (!user) {
			return Promise.reject()  // a rejected promise
		}
		// if the user exists, make sure their password is correct
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					//password is correct so send token
					const payload = {
						_id: user._id,
						username: user.username
					}
					jwt.sign(payload,"Our secret", {
						expiresIn: 3600
					}, (err, token) => {
						if(token){
							resolve({token: `Bearer ${token}`})
						}
						reject()
					})
				} else {
					reject()
				}
			})
		})
	})
}

// make a model using the User schema
const User = mongoose.model('User', UserSchema)
module.exports = { User }
