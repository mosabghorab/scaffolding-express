const nodemailer = require('nodemailer');


const sendEmail = async (email,subject,text) => {
  let transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: text,
};
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log('error');
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
}

module.exports = {sendEmail};


