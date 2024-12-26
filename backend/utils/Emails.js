import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "3392ffee2b4038",
    pass: "382b2aa481e801",
  },
});

const sendMail = async (receiverEmail, subject, body) => {
  await transport.sendMail({
    from: process.env.EMAIL,
    to: receiverEmail,
    subject: subject,
    html: body,
  });
};

export default sendMail;
