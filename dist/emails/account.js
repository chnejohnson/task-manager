"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mail_1 = __importDefault(require("@sendgrid/mail"));
const sendgridApiKey = process.env.SENDGRID_API_KEY;
mail_1.default.setApiKey(sendgridApiKey);
exports.sendWelcomeEmail = (email, name) => {
    mail_1.default.send({
        to: email,
        from: "chnejohnson@gmail.com",
        subject: `hello ${name}`,
        text: "Welcome to the new world."
    });
    console.log("email has sent.");
};
exports.sendCancelationEmail = (email, name) => {
    mail_1.default.send({
        to: email,
        from: "chnejohnson@gmail.com",
        subject: `Goodbye ${name}`,
        text: "Please tell me why you canceled?"
    });
    console.log("email has sent.");
};
