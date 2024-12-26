import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "cb7f73e0792bf4",
    pass: "f5d4f1960c87be",
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
