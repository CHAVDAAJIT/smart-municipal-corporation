const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP Email
exports.sendOTPEmail = async (email, otp, name) => {
  await transporter.sendMail({
    from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Email Verification OTP - Smart Municipal Corporation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #0f4c75; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="color: white; margin: 0;">🏛️ Smart Municipal Corporation</h2>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h3>Hello ${name}! 👋</h3>
          <p>Your OTP for email verification is:</p>
          <div style="background: #0f4c75; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 10px; letter-spacing: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #888; font-size: 13px;">This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="color: #888; font-size: 13px;">If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  });
};

// Send Forgot Password OTP
exports.sendForgotPasswordEmail = async (email, otp, name) => {
  await transporter.sendMail({
    from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP - Smart Municipal Corporation",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #e63946; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="color: white; margin: 0;">🔐 Password Reset Request</h2>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h3>Hello ${name}! 👋</h3>
          <p>Your OTP for password reset is:</p>
          <div style="background: #e63946; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 10px; letter-spacing: 8px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #888; font-size: 13px;">This OTP is valid for <strong>10 minutes</strong>.</p>
          <p style="color: #888; font-size: 13px;">If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  });
};