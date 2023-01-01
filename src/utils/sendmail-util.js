import nodemailer from 'nodemailer';
import config from '../config/index.js';

const sendMail = async (to, subject, text, html) => {
  try {
    let mailTransporter;
    /* Using Gmail for production */
    if (config.NODE_ENV === 'production') {
      mailTransporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: GMAIL_EMAIL,
          pass: GMAIL_PASSWORD,
        },
      });
    } else {
      /* Using Mailtrap for development */
      mailTransporter = await nodemailer.createTransport({
        host: config.MAILTRAP.HOST,
        port: config.MAILTRAP.PORT,
        auth: {
          user: config.MAILTRAP.USER,
          pass: config.MAILTRAP.PASSWORD,
        },
      });
    }

    const mailDetails = {
      from: config.GMAIL_EMAIL,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    return await mailTransporter.sendMail(mailDetails);
  } catch (error) {
    console.log(error);
  }
};

export default sendMail;
