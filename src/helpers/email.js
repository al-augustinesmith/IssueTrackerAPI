import nodemailer from "nodemailer";
import "dotenv/config";
// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (sender, email, key, url) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.PSWD,
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Issue Tracker 👻" <${process.env.SENDER_EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: `${sender.first_name} is waiting for you to join the Project ✔`, // Subject line
    html: `<b>Your team is waiting for you to join the Project</b><br/> ${sender.first_name} has invited you to collaborate on <a href="${url}/register/${key}">Issue Tracker</a> .<br/>
    Kindly <a href="${url}/register/${key}">Click here</a> to join the project.`,
  });
};

export { sendEmail };
