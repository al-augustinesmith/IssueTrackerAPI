import nodemailer from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
const sendEmail = async (sender, email, key, url) => {
 
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "mail.nccharles.site",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "join@nccharles.site",
      pass: "Iwbitbo8",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Issue Tracker 👻" <join@nccharles.site>', // sender address
    to: email, // list of receivers
    subject: `${sender.first_name} is waiting for you to join the Project ✔`, // Subject line
    html: `<b>Your team is waiting for you to join the Project</b><br/> ${sender.first_name} has invited you to collaborate on ${url} .<br/>
    Kindly <a href="${url}/invite/${key}">Click here</a> to join the project.`,
  });
};

export { sendEmail };
