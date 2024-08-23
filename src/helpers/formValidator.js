const { body, validationResult } = require("express-validator");
const helpers = require("../helpers/auth.guard");
const db = require("../models");
const { User, Profile, Referral } = db;
const bcrypt = require("bcrypt");
const userService = require("../services/user.service");
const walletService = require("../services/wallet.service")

// const signupValidation = () => {
//   return [
//     body("firstname")
//       .not()
//       .isEmpty()
//       .withMessage("Firstname field is required"),
//     body("lastname").not().isEmpty().withMessage("Lastname field is required"),
//     body("email")
//       .not()
//       .isEmpty()
//       .withMessage("Email field is required")
//       .custom((value, { req }) => {
//         return User.findOne({
//           where: { username: req.body.email },
//           attributes: ["id", "username"],
//         }).then((user) => {
//           if (user) {
//             return Promise.reject(
//               "Email is already in use. Please try another one!"
//             );
//           }
//         });
//       }),
//     body("phone_no")
//       .not()
//       .isEmpty()
//       .withMessage("Phone Number field is required")
//       .custom((value, { req }) => {
//         return Profile.findOne({
//           where: { phone_number: req.body.phone_no },
//           attributes: ["id", "email"],
//         }).then((user) => {
//           if (user) {
//             return Promise.reject(
//               "Phone Number is already in use. Please try another one!"
//             );
//           }
//         });
//       }),
//     body("referral").custom((value, { req }) => {
//       if (req.body.referral !== "") {
//         return Referral.findOne({
//           where: { user_referral_code: req.body.referral },
//           attributes: ["id", "user_id"],
//         }).then((user) => {
//           if (!user) {
//             return Promise.reject("Invalid Referral code!");
//           } else {
//             return true;
//           }
//         });
//       } else {
//         return true;
//       }
//     }),
//     body("password").not().isEmpty().withMessage("Password field is required"),
//     body("confirm_password").custom((value, { req }) => {
//       if (value !== req.body.password) {
//         throw new Error("Password confirmation does not match Password");
//       }
//       return true;
//     }),
//   ];
// };
// const signupUserValidation = () => {
//   return [
//     body("firstname")
//       .not()
//       .isEmpty()
//       .withMessage("Firstname field is required"),
//     body("lastname").not().isEmpty().withMessage("Lastname field is required"),
//     body("role").not().isEmpty().withMessage("Role field is required"),
//     body("email")
//       .not()
//       .isEmpty()
//       .withMessage("Email field is required")
//       .custom((value, { req }) => {
//         return User.findOne({
//           where: { email: req.body.email },
//           attributes: ["id", "email"],
//         }).then((user) => {
//           if (user) {
//             return Promise.reject(
//               "Email is already in use. Please try another one!"
//             );
//           }
//         });
//       }),
//     body("phone_no")
//       .not()
//       .isEmpty()
//       .withMessage("Phone Number field is required")
//       .custom((value, { req }) => {
//         return Profile.findOne({
//           where: { phone_no: req.body.phone_no },
//           attributes: ["id", "email"],
//         }).then((user) => {
//           if (user) {
//             return Promise.reject(
//               "Phone Number is already in use. Please try another one!"
//             );
//           }
//         });
//       }),
//     body("password").not().isEmpty().withMessage("Password field is required"),
//     body("confirm_password").custom((value, { req }) => {
//       if (value !== req.body.password) {
//         throw new Error("Password confirmation does not match Password");
//       }
//       return true;
//     }),
//   ];
// };
// const createAdminValidation = () => {
//   return [
//     body("name").not().isEmpty().withMessage("Name field is required"),
//     body("role").not().isEmpty().withMessage("Admin Role field is required"),
//     body("email")
//       .not()
//       .isEmpty()
//       .withMessage("Email field is required")
//       .custom((value, { req }) => {
//         return User.findOne({
//           where: { email: req.body.email },
//           attributes: ["id", "email"],
//         }).then((user) => {
//           if (user) {
//             return Promise.reject(
//               "Email is already in use. Please try another one!"
//             );
//           } else {
//             return User.findOne({
//               where: { type: "admin" },
//               attributes: ["id", "email"],
//             }).then((user) => {
//               if (user) {
//                 return Promise.reject(
//                   "This Platform Already Has A Super Admin!"
//                 );
//               }
//             });
//           }
//         });
//       }),
//     body("phone_no")
//       .not()
//       .isEmpty()
//       .withMessage("Phone Number field is required")
//       .custom((value, { req }) => {
//         return Profile.findOne({
//           where: { phone_no: req.body.phone_no },
//           attributes: ["id", "email"],
//         }).then((user) => {
//           if (user) {
//             return Promise.reject(
//               "Phone Number is already in use. Please try another one!"
//             );
//           }
//         });
//       }),
//     body("password").not().isEmpty().withMessage("Password field is required"),
//     body("confirm_password").custom((value, { req }) => {
//       if (value !== req.body.password) {
//         throw new Error("Password confirmation does not match Password");
//       }
//       return true;
//     }),
//   ];
// };
// const createListValidation = () => {
//   return [
//     body("list_name")
//       .not()
//       .isEmpty()
//       .withMessage("List Name field is required"),
//     body("cartegory")
//       .not()
//       .isEmpty()
//       .withMessage("Cartegory field is required"),
//     body("parameter")
//       .not()
//       .isEmpty()
//       .withMessage("Parameter field is required"),
//   ];
// };
// const loginValidation = () => {
//   return [
//     body("username").not().isEmpty().withMessage("Username field is required"),
//     body("password").not().isEmpty().withMessage("Password field is required"),
//   ];
// };

// const validate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) {
//     return next();
//   }
//   const extractedErrors = [];
//   errors.array().map((err) => extractedErrors.push({ msg: err.msg }));

//   res.json({
//     statusCode: 402,
//     error: true,
//     data: extractedErrors,
//   });
// };

// const settingsValidation = () => {
//   return [
//     body("newpassword")
//       .not()
//       .isEmpty()
//       .withMessage("New Password field is required"),
//     body("confirmpassword").custom((value, { req }) => {
//       if (value !== req.body.newpassword) {
//         throw new Error("Password confirmation does not match Password");
//       }
//       return true;
//     }),
//     body("currentpassword")
//       .not()
//       .isEmpty()
//       .withMessage("Current Password field is required")
//       .custom(async (value, { req }) => {
//         let user = await User.findOne({
//           where: { id: req.body.id },
//         });
//         if (user) {
//           if (await bcrypt.compare(req.body.currentpassword, user.password)) {
//           } else {
//             throw new Error("Incorrect Password");
//             return "Incorrect Password";
//           }
//         }
//         return true;
//       }),
//   ];
// };
const transferValidation = () => {
  return [
    body("amount")
      .not()
      .isEmpty()
      .withMessage("Amount field is required")
      .custom(async (value, { req }) => {
        if (req.body.amount < 500) {
          throw new Error("cannot fund less than 500 naira");
        } else {
          return true;
        }
      }),
    body("pin")
      .not()
      .isEmpty()
      .withMessage("Pin field is required")
      .custom(async (value, { req }) => {
        let user = await User.findOne({
          where: { id: req.body.id },
        });
        if (user) {
          if (await bcrypt.compare(req.body.pin, user.pin)) {
            return true;
          } else {
            throw new Error(
              "Incorrect Pin. If you forgot your PIN or need assistance, contact support via email or live chat for help."
            );
          }
        } else {
          console.error(user);
        }
      }),
  ];
};

// const signUpvalidate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) {
//     return next();
//   }
//   const extractedErrors = [];
//   errors.array().map((err) => extractedErrors.push({ msg: err.msg }));

//   //Send Values Back to form
//   let formData = {
//     firstname: req.body.firstname,
//     lastname: req.body.lastname,
//     phone_no: req.body.phone_no,
//     email: req.body.email,
//     // referral_code: req.body.referral
//   };

//   res.render("site/register", {
//     formData,
//     extractedErrors,
//     title: "User's Registration",
//     // unid: req.body.unid
//   });
// };
const fundWalletvalidate = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ msg: err.msg }));

  const hasPermission = await helpers.hasPermission("fund-wallet", req);
  //Send Values Back to form
  let formData = {
    amount: req.body.amount,
  };
  let user = await req.user;
  let user_role = user.UserRole.Role.role_name;
  let userid = user.id;
  const Permitted = await helpers.Permitted(user);
  let userProfile = await userService.userProfile(userid);
  // const adminPermitted = await helpers.adminPermitted(user);
  res.render("user/FundWallet", {
    title: "Fund Wallet",
    layout: "dashboard",
    Permitted,
    // adminPermitted,
    user_name: user.name,
    user_role,
    userid,
    hasPermission,
    extractedErrors,
    user,
    formData,
    userProfile,
  });
};
// const loginvalidate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) {
//     return next();
//   }
//   const extractedErrors = [];
//   errors.array().map((err) => extractedErrors.push({ msg: err.msg }));

//   //Send Values Back to form
//   let formData = {
//     username: req.body.username,
//     password: req.body.password,
//   };

//   res.render("site/login", {
//     formData,
//     extractedErrors,
//     title: "User's Login Page",
//   });
// };
// const forgotPasswordValidation = () => {
//   return [
//     body("username")
//       .not()
//       .isEmpty()
//       .withMessage("Email field is required")
//       .custom((value, { req }) => {
//         return User.findOne({
//           where: { username: req.body.username },
//           attributes: ["id", "username"],
//         }).then((user) => {
//           if (!user) {
//             return Promise.reject(
//               "User not found, Please be sure to use the email you registered with"
//             );
//           }
//         });
//       }),
//   ];
// };

// const forgotPasswordValidate = (req, res, next) => {
//   const errors = validationResult(req);
//   if (errors.isEmpty()) {
//     return next();
//   }
//   const extractedErrors = [];
//   errors.array().map((err) => extractedErrors.push({ msg: err.msg }));

//   //Send Values Back to form
//   let formData = {
//     username: req.body.username,
//   };

//   res.render("site/forgot_password", {
//     formData,
//     extractedErrors,
//     title: "Forgot-Password",
//   });
// };

// const purchaseValidation = () => {
//   return [
//     body("amount")
//       .not()
//       .isEmpty()
//       .withMessage("Amount field is required")
//       .custom(async (value, { req }) => {
//         console.log("entryyy", req.body)
//         console.log("user", req.user)
//         if (req.body.amount < 500) {
//           throw new Error("cannot fund less than 500 naira");
//         } else {
//           return true;
//         }
//       }),
//     body("pin")
//       .not()
//       .isEmpty()
//       .withMessage("Pin field is required")
//       .custom(async (value, { req }) => {
//         let user_ = await req.user
//         let user = await User.findOne({
//           where: { id: user_.id },
//         });
//         if (user) {
//           if (await bcrypt.compare(req.body.pin, user.pin)) {
//             return true;
//           } else {
//             throw new Error(
//               "Incorrect Pin. If you forgot your PIN or need assistance, contact support via email or live chat for help."
//             );
//           }
//         } else {
//           console.error(user);
//         }
//       }),
//   ];
// };

// const directPurchaseValidate = async (req, res, next) => {
//   const errors = validationResult(req);
//   console.log("entry0", errors)
//   if (errors.isEmpty()) {
//     return next();
//   }
//   const extractedErrors = [];
//   errors.array().map((err) => extractedErrors.push({ msg: err.msg }));

//   // const hasPermission = await helpers.hasPermission("fund-wallet", req);
//   //Send Values Back to form
//   // let formData = {
//   //   amount: req.body.amount,
//   // };
//   let user = await req.user;
//   let user_role = user.UserRole.Role.role_name;
//   let userid = user.id;
//   // const Permitted = await helpers.Permitted(user);
//   let userProfile = await userService.userProfile(userid);
//   let wallet = await walletService.userWallet(userid)
//   let availableBal = await walletService.availableBalance(userid)
//   console.log("entry1")
//   console.log("extractedErrors", extractedErrors)
//   res.render("user/airtime", {
//     title: "Airtime",
//     layout: "dashboard",
//     user,
//     userProfile,
//     wallet,
//     availableBal,
//     extractedErrors,
//   });
//   // res.render("user/fund_wallet", {
//   //   title: "Fund Wallet",
//   //   layout: "dashboard",
//   //   Permitted,
//   //   // adminPermitted,
//   //   user_name: user.name,
//   //   user_role,
//   //   userid,
//   //   hasPermission,
//   //   extractedErrors,
//   //   user,
//   //   formData,
//   //   userProfile,
//   // });
// };

module.exports = {
  //validate,
  // signupValidation,
  // signUpvalidate,
  // signupUserValidation,
  // createAdminValidation,
  // createListValidation,
  // loginvalidate,
  // loginValidation,
  // settingsValidation,
  transferValidation,
  fundWalletvalidate,
  // forgotPasswordValidation,
  // forgotPasswordValidate,
  // purchaseValidation,
  // directPurchaseValidate
};
