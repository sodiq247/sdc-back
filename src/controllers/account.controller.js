/** @format */

const responses = require("../helpers/responses");
const jsonwebtoken = require("jsonwebtoken");
const userService = require("../services/user.service");

module.exports = {
	signup: async (req, res) => {
		try {
			return res.status(200).json({ message: "Here we Go!!!" });
			// let check = await userService.findByUsername(req.body.email);
			// console.log(check);
			// let result = responses.success("Account created successfully");
			// if (check == null) {
			// 	let user = await userService.create(req.body);
			// } else {
			// 	result = responses.badRequest("User already exist");
			// }
			// res.status(result.code).send(result);
		} catch (e) {
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
