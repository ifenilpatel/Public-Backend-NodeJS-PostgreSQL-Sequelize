const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GmailAuthEmail,
    pass: process.env.GmailAuthPassword,
  },
});

const send_Email = async (to, subject, text = "", html = "") => {
  try {
    const mailOptions = {
      from: `Support ticket <${process.env.GmailAuthEmail}>`,
      to: to,
      subject: subject,
      text: text,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    return null;
  }
};

module.exports = {
  send_Email,
};
