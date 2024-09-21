/** @format */

const db = require("../models");
const bcrypt = require("bcryptjs");
const uniqid = require("uniqid");
const jwt = require("jsonwebtoken");
const mailService = require("./mail.service");
const sequelize = require("sequelize");
const { User, Profile, Wallet, State, UserRole, Role, Otp } = db;
module.exports = {
	create: async (data) => {
		console.log(data);
		let transaction = await db.sequelize.transaction();
		let passwordhash = await bcrypt.hash(
			data.password ? data.password : "Password@1",
			10
		);

		let pinHash = await bcrypt.hash(data.pin, 10);
		//  console.log(transaction);
		try {
			let user = await User.create(
				{
					username: data.email,
					password: passwordhash,
					activation_token: uniqid("NCC", "CCMS"),
					pin: pinHash,
					status: true,
				},
				{ transaction: transaction }
			);
			// data.user_id = user.id;
			let role = await Role.findOne({
				where: { name: data.role },
			});

			let profile = await Profile.create(
				{
					user_id: user.id,
					firstname: data.firstname,
					lastname: data.lastname,
					email: data.email,
					phone_number: data.phone,
					referral_code: uniqid(),
				},
				{ transaction: transaction }
			);
			await Wallet.create(
				{
					user_id: user.id,
					amount: "0",
				},
				{ transaction: transaction }
			);
			await UserRole.create(
				{
					role_id: role.id,
					user_id: user.id,
				},
				{ transaction: transaction }
			);

			transaction.commit();
			return { status: true, message: "Registration was successful" };
		} catch (e) {
			transaction.rollback();
			return e;
		}
	},
	update: async (user, data) => {
		let transaction = await db.rest.transaction();
		//  console.log(transaction);
		try {
			let profile = await Profile.update(
				{
					firstname: data.firstname,
					lastname: data.lastname,
					phone_number: data.phone_number,
					state_code: data.state.code,
					city: data.city,
					stakeholder_code: data.stakeholder.code,
					branch_id: data.stakeholder.branch
						? data.stakeholder.branch.id
						: null,
				},
				{
					where: { user_id: user.id },
				},
				{ transaction: transaction }
			);
			let role = await Role.findOne({
				where: { name: data.role },
			});
			await UserRole.update(
				{
					role_id: role.id,
				},
				{
					where: { user_id: user.id },
				},
				{ transaction: transaction }
			);
			transaction.commit();
			mailService.sendAccountVerificationEmail(
				user.username,
				user.activation_token
			);
			return { user, role, profile };
		} catch (e) {
			transaction.rollback();
			console.log(e.message);
			return e;
		}
	},
	login: async (payload) => {
		try {
			console.log(payload);
			const user = await User.findOne({
				attributes: {
					exclude: ["password_reset_token", "activation_toke"],
				},
				include: [
					{
						model: UserRole,
						include: [{ model: Role }],
					},
					// {
					//   // model: Otp,
					//   attributes: ["created_at", "used"],
					//   order: [["created_at", "DESC"]],
					//   limit: 1,
					// },
				],

				where: {
					username: sequelize.where(
						sequelize.fn("LOWER", sequelize.col("username")),
						"=",
						payload.username.toLowerCase()
					),
				},
			});
			console.log(user);
			if (user != null) {
				if ((await bcrypt.compare(payload.password, user.password)) == true) {
					if (user.status != false) {
						let payload = {
							sub: user.id,
							role: user.UserRole.Role.name,
							username: user.username,
						};
						let token = jwt.sign(
							payload,
							process.env.SECRET_KEY ? process.env.SECRET_KEY : "secret123",
							{ expiresIn: "60m" }
						);

						return {
							loggedIn: true,
							access_token: token,
							type: "Bearer",
							expiresIn: "60m",
							sub: user.username,
						};
					} else {
						return {
							error: "inActive Account",
							message: "Account is not activated",
						};
					}
				} else {
					return {
						error: "invalid credential",
						message:
							"You have entered Invalid credentials. Please try again!!!",
					};
				}
			} else {
				return {
					error: "invalid credential",
					message: `no user found with the username ${payload.username}`,
				};
			}
		} catch (e) {
			// console.log(e.message())
			console.log(e);
			return { error: true, message: e };
		}
	},
	findByActivationToken: async (token) => {
		return await User.findOne({
			attributes: [
				"id",
				"username",
				"activation_token",
				"password_reset_token",
			],
			where: { activation_token: token },
		});
	},
	findById: async (id) => {
		return await User.findOne({
			attributes: ["id", "username", "activation_token"],
			where: { id: id },
		});
	},
	findByPasswordResetToken: async (token) => {
		return await User.findOne({
			attributes: [
				"id",
				"username",
				"activation_token",
				"password_reset_token",
			],
			where: { password_reset_token: token },
		});
	},
	updateUser: async (data, id) => {
		return await User.update(data, {
			where: { id: id },
		});
	},
	// findByUsername: async (username) => {
	// 	try {
	// 		return await User.findOne({
	// 			include: [
	// 				{
	// 					model: Wallet,
	// 				},
	// 				{
	// 					model: Profile,
	// 				},
	// 			],
	// 			where: { username: username },
	// 		});
	// 	} catch (e) {
	// 		console.log(e);
	// 		throw e;
	// 	}
	// },
	findByEmail: async (email) => {
		try {
			if (!validateEmail(email)) {
				throw new Error("Invalid email format");
			}
			const user = await User.findOne({ where: { email } });
			if (!user) {
				throw new Error("User not found");
			}
			return user;
		} catch (e) {
			console.error("Error finding user by email:", e);
			throw new Error(e.message);
		}
	},

	// Simple email validation function
	validateEmail: (email) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(String(email).toLowerCase());
	},
	createUserOnly: async (username) => {
		let transaction = await db.rest.transaction();
		let passwordhash = await bcrypt.hash("Password@1", 10);
		try {
			let user = await User.create(
				{
					username: username,
					password: passwordhash,
					status: true,
				},
				{ transaction: transaction }
			);
			transaction.commit();
			return JSON.parse(JSON.stringify(user));
		} catch (e) {
			return e;
		}
	},
	confirmPassword: async (password1, password2) => {
		return await bcrypt.compare(password2, password1);
	},
	hashPassword: async (password) => {
		return await bcrypt.hash(password, 10);
	},
};
