/** @format */

const responses = require("../helpers/responses");
const jsonwebtoken = require("jsonwebtoken");
const userService = require("../services/user.service");
const db = require("../models");
const { User } = db;
module.exports = {
	signup: async (req, res) => {
		try {
			const check = await User.findOne({ where: { email: req.body.email } });
			let result = responses.success("Account created successfully");

			if (check === null) {
				let newUser = await userService.create(req.body);
				res.send({msg:"new user",newUser,check})
			} else {
				result = responses.badRequest("User already exist");
			}
			res.status(result.code).send(result);
		} catch (e) {
			console.log(req.body);
			throw e;
		}
	},
	login: async (req, res) => {
		let data = {
			username: req.body.username,
			password: req.body.password,
		};
		// let result = responses.success("Account login successfully");
		let user = await userService.login(data);
		result = responses.success(user);
		if (result.body.loggedIn === true) {
			res.send(result);
		} else {
			res.status(result.code).send(result);
		}
	},

	verifyAccount: async (req, res) => {
		console.log(res.locals.user);
		let users = await userService.findByUsername(res.locals.user.username);
		console.log(users);
		res.send(users);
	},
	// getCurrentUser: async(req, res, next) => {

	//   let user = await userService.findAll()
	//   // res.local.user = user;
	//   // next();
	//   // console.log(user);/
	//   // return user
	//   res.send(user)
	// },
};
