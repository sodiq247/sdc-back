/** @format */

require("dotenv").config();

// const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_DIALECT } =
// 	process.env;

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_DIALECT:", process.env.DB_DIALECT);

module.exports = {
	development: {
		databases: {
			rest: {
				database: process.env.DB_NAME,
				username: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				host: process.env.DB_HOST,
				port: process.env.DB_PORT,
				dialect: process.env.DB_DIALECT,
				logging: false,
				dialectOptions: {
					ssl: {
						require: true,
						rejectUnauthorized: false,
					},
				},
				pool: {
					max: 151,
					min: 0,
					acquire: 60000,
					idle: 10000,
				},
			},
		},
	},
	production: {
		databases: {
			rest: {
				database: process.env.DB_NAME,
				username: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				host: process.env.DB_HOST,
				port: process.env.DB_PORT,
				dialect: process.env.DB_DIALECT,
				logging: false,
				pool: {
					max: 151,
					min: 0,
					acquire: 60000,
					idle: 10000,
				},
			},
		},
	},
};
