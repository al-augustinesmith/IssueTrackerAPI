import nodemailer from "nodemailer";
import "dotenv/config";
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PSWD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  },
});
const sendEmail = (sender, email, key, url) => {
  
  const mailOptions ={
    from: `"Issue Tracker 👻" <${process.env.SENDER_EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: `${sender.first_name} is waiting for you to join the Project ✔`, // Subject line
    html: `<b>Your team is waiting for you to join the Project</b><br/> ${sender.first_name} has invited you to collaborate on <a href="${url}/register/${key}">Issue Tracker</a> .<br/>
    Kindly <a href="${url}/register/${key}">Click here</a> to join the project.`,
  }
  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error.message);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const sendPasscode = (receiver) => {
  const mailOptions ={
    from: `"PASSCODE | Issue Tracker 👻" <${process.env.SENDER_EMAIL}>`, // sender address
    to: receiver.email, // list of receivers
    subject: `${receiver.first_name} here is your PASSCODE`, // Subject line
    html: `<b>To login</b><br/>Type this <b>${receiver.passcode}</b> in the form`,
  }
  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export { sendEmail,sendPasscode };
