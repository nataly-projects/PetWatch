require('dotenv').config();
const nodemailer = require('nodemailer');
const {EMAIL_SUBJECTS } = require('../utils/config');

const appEmail = process.env.EMAIL; 
const emailKey = process.env.EMAIL_KEY;

  // create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: appEmail, 
      pass: emailKey, 
    },
  });

  async function sendContactEmail(fullName, userEmail, message) {
    
    // email options
    const mailOptions = {
      from: userEmail,
      to: appEmail, 
      subject: EMAIL_SUBJECTS.CONTACT_US,
      html: `
        <p>New message from: ${fullName}</p>
        <p>Email: ${userEmail}</p>
        <p>The message: ${message}</p>
      `,
    };
  
    // send the email
    await transporter.sendMail(mailOptions);
  }

  async function sendResetCodeEmail(email, verificationCode, userName) {
    const mailOptions = {
      from: appEmail,
      to: email,
      subject: EMAIL_SUBJECTS.PASSWORD_RESET,
      // text: `Your verification code is: ${verificationCode}`,
      html: ` 
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #f5f5f5; padding: 20px;">
        <div style="background-color: #fff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #007bff;">Password Reset Code</h2>
          <p>Hello ${userName},</p>
          <p>You recently requested to reset your password for PetWatch App. Please use the following code to reset your password:</p>
          <div style="width: fit-content; background-color: #007bff; color: #fff; padding: 10px; border-radius: 5px; font-size: 18px; text-align: center;">
              <strong>${verificationCode}</strong>
          </div>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Thank you.</p>
        </div>
      </div>
      `
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }

  module.exports = { 
    sendContactEmail,
    sendResetCodeEmail,
};
