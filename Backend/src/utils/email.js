import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: "Your OTP for Registration",
    html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
  };
  console.log("Email:", process.env.SMTP_EMAIL);
  console.log("Password:", process.env.SMTP_PASSWORD ? "Loaded ✅" : "Missing ❌");
  await transporter.sendMail(mailOptions);
};
