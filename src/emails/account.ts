import sgMail from "@sendgrid/mail";

const sendgridApiKey: any = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(sendgridApiKey);

export const sendWelcomeEmail = (email: string, name: string) => {
  sgMail.send({
    to: email,
    from: "chnejohnson@gmail.com",
    subject: `hello ${name}`,
    text: "Welcome to the new world."
  });
  console.log("email has sent.");
};

export const sendCancelationEmail = (email: string, name: string) => {
  sgMail.send({
    to: email,
    from: "chnejohnson@gmail.com",
    subject: `Goodbye ${name}`,
    text: "Please tell me why you canceled?"
  });
  console.log("email has sent.");
};
