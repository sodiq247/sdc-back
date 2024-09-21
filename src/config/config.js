/** @format */

require("dotenv").config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT, DB_DIALECT } =
	process.env;

console.log("Here we go:", {
	DB_HOST,
	DB_USER,
	DB_PASSWORD,
	DB_NAME,
	DB_PORT,
	DB_DIALECT,
});

module.exports = {
	development: {
		databases: {
			rest: {
				database: DB_NAME,
				username: DB_USER,
				password: DB_PASSWORD,
				host: DB_HOST,
				port: DB_PORT,
				dialect: DB_DIALECT,
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
				database: DB_NAME,
				username: DB_USER,
				password: DB_PASSWORD,
				host: DB_HOST,
				port: DB_PORT,
				dialect: DB_DIALECT,
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
