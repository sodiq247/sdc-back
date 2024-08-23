require("dotenv").config();
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_SERVER,
  service: process.env.MAIL_SERVIER,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.resolve("public/mail"),
    defaultLayout: false,
  },
  viewPath: path.resolve("public/mail"),
  extName: ".hbs",
};
//var source = fs.readFileSync("../../public/mailverify-account.hbs", "utf8");
transporter.use("compile", hbs(handlebarOptions));

module.exports = {
  sendAccountVerificationEmail: async (email, token, name) => {
    try {
      var email = {
        from: "NoReply@NCCCCMS.com",
        to: email,
        subject: "NCC CCMS | Account Activation",
        template: "verify-account",
        context: {
          name: name,
          url: `${process.env.NCC_BASUURL}account-confirm/${token}`,
        },
      };
      let resp = await transporter.sendMail(email);
      console.log(resp);
    } catch (error) {
      console.log(error, "email not sent");
    }
  },
  passwordResetRequest: async (email, name, token) => {
    try {
      var email = {
        from: "NoReply@gmail.com",
        to: email,
        subject: "NCC CCMS | Password Reset",
        template: "password-resett-request",
        context: {
          name: name,
          url: `${process.env.NCC_BASUURL}reset-password/${token}`,
        },
      };
      let resp = await transporter.sendMail(email);
      // console.log(resp);
    } catch (error) {
      console.log(error, "email not sent");
    }
  },
  Otp: async (email, otp, name) => {
    try {
      var email = {
        from: "NoReply@gmail.com",
        to: email,
        subject: "NCC CCMS | One Time Password (OTP)",
        template: "otp",
        context: {
          otp: otp,
          name: name,
        },
      };
      let resp = await transporter.sendMail(email);
      // console.log(resp);
    } catch (error) {
      console.log(error, "email not sent");
    }
  },
  escalation: async (
    email,
    number,
    ticket_id,
    name,
    expected_resolution_date
  ) => {
    try {
      var email = {
        from: "NoReply@gmail.com",
        to: email,
        subject: "NCC CCMS | Ticket Escalation",
        template: "escalation",
        context: {
          number: number,
          name: name,
          expected_resolution_date: expected_resolution_date,
          url: `${process.env.NCC_BASUURL}dashboard/complaint/${ticket_id}`,
        },
      };
      let resp = await transporter.sendMail(email);
    } catch (error) {
      console.log(error, "email not sent");
    }
  },
  nccescalation: async (
    email,
    ticket_number,
    name,
    service_provider,
    expexted_resolution_date
  ) => {
    try {
      var email = {
        from: "NoReply@gmail.com",
        to: email,
        subject: "NCC CCMS | Ticket Violation",
        template: "ncc-sla-violation",
        context: {
          ticket_number: ticket_number,
          name: name,
          service_provider: service_provider,
          expexted_resolution_date: expexted_resolution_date,
        },
      };
      let resp = await transporter.sendMail(email);
    } catch (error) {
      console.log(error, "email not sent");
    }
  },
  badDataEmail: async (file, email, log) => {
    try {
      var email = {
        from: "NoReply@gmail.com",
        to: email,
        subject: "NCC CCMS | Failed Uplaod",
        template: "upload.complete",
        context: {
          total_sussess: log.total_success,
          total_failed: log.total_failed,
          total_record: log.total_record,
        },
        attachments: [
          {
            filename: file,
            path: path.join(__dirname, "../../public/uploads/" + file),
            cid: "uniq-mailtrap.png",
          },
        ],
      };
      let resp = await transporter.sendMail(email);
      console.log(resp);
    } catch (e) {
      console.log(e);
    }
  },
  slaViolation: async (
    email,
    ticket_number,
    name,
    service_provider,
    expected_resolution_date
  ) => {
    try {
      var email = {
        from: "NoReply@gmail.com",
        to: email,
        subject: "NCC CCMS | Ticket Violation",
        template: "sla-violation",
        context: {
          ticket_number: ticket_number,
          name: name,
          expected_resolution_date: expected_resolution_date,
          service_provider: service_provider,
        },
      };
      let resp = await transporter.sendMail(email);
      console.log(resp);
    } catch (error) {
      console.log(error, "email not sent");
    }
  },
  ticketStatusChange: async (
    email,
    stakeholder_name,
    actor_name,
    ticket_number,
    status,
    description
  ) => {
    try {
      var email = {
        from: "NoReply@NCCCCMS.com",
        to: email,
        subject: "NCC CCMS | Ticket Status",
        template: "ticket-update",
        context: {
          stakeholder_name: stakeholder_name,
          ticket_number: ticket_number,
          status: status,
          description: description,
          actor_name: actor_name,
        },
      };
      let resp = await transporter.sendMail(email);
      console.log(resp);
    } catch (e) {
      console.lpg(e);
    }
  },
};
