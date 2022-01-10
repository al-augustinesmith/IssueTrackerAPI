import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (email, key) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.nccharles.site",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "me@nccharles.site",
      pass: "Iwbitbo8",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Issue Tracker 👻" <me@nccharles.site>', // sender address
    to: email, // list of receivers
    subject: "You're invited to join the Project ✔", // Subject line
    html: `<b>Your team is waiting for you to join the Project</b><br/> Here is the link to <a href="https://issuertracker.com/invite/${key}">Join the project</a>`, // html body
  });

};

export { sendEmail };
