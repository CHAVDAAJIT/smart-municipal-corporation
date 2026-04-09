const nodemailer = require("nodemailer");

// ✅ Har baar naya transporter banao — App Password ke saath reliable hai
const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // ← Gmail App Password (16 digit)
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// ✅ 1. OTP Email — Verification
exports.sendOTPEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();
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
            <p style="color: #888; font-size: 13px;">Valid for <strong>10 minutes</strong>. Do not share this OTP with anyone.</p>
          </div>
        </div>
      `,
    });
    console.log("✅ OTP email sent to:", email);
    return true;
  } catch (err) {
    console.error("❌ OTP email error:", err.message);
    return false;
  }
};

// ✅ 2. Forgot Password OTP Email
exports.sendForgotPasswordEmail = async (email, otp, name) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset OTP - Smart Municipal Corporation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: #e63946; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h2 style="color: white; margin: 0;">🔐 Password Reset</h2>
          </div>
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h3>Hello ${name}!</h3>
            <p>Your OTP for password reset:</p>
            <div style="background: #e63946; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 10px; letter-spacing: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #888; font-size: 13px;">Valid for <strong>10 minutes</strong>. Ignore if you did not request this.</p>
          </div>
        </div>
      `,
    });
    console.log("✅ Forgot password email sent to:", email);
    return true;
  } catch (err) {
    console.error("❌ Forgot password email error:", err.message);
    return false;
  }
};

// ✅ 3. Complaint Status Update Email
exports.sendStatusUpdateEmail = async (email, name, complaintData) => {
  try {
    const { type, area, status, complaintId } = complaintData;

    const statusColors = {
      Pending: "#f57c00",
      Assigned: "#1b6ca8",
      Resolved: "#059669",
      Cancelled: "#e63946",
    };
    const statusEmoji = {
      Pending: "⏳",
      Assigned: "🏢",
      Resolved: "✅",
      Cancelled: "❌",
    };

    const color = statusColors[status] || "#0f4c75";
    const emoji = statusEmoji[status] || "📋";

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${emoji} Complaint Update — ${status} | SMC`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: #0f4c75; padding: 24px 28px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 20px;">🏛️ Smart Municipal Corporation</h2>
            <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Complaint Status Update</p>
          </div>
          <div style="background: #ffffff; padding: 28px;">
            <p style="font-size: 15px; color: #333;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 14px; color: #555; margin-bottom: 20px;">Your complaint has been updated. Here are the details:</p>
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="background: ${color}; color: white; padding: 10px 24px; border-radius: 24px; font-size: 16px; font-weight: 700; display: inline-block;">
                ${emoji} ${status}
              </span>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-size: 13px; color: #888; width: 40%; border-bottom: 1px solid #eee;">Complaint ID</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">#${complaintId}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Type</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${type}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Area</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${area}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-size: 13px; color: #888;">Status</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 700; color: ${color};">${emoji} ${status}</td>
              </tr>
            </table>
            ${status === "Resolved" ? `
            <div style="background: #d1fae5; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
              <p style="margin: 0; color: #059669; font-size: 14px; font-weight: 600;">🎉 Your complaint has been resolved! Thank you for reporting.</p>
              <p style="margin: 6px 0 0; color: #059669; font-size: 13px;">Please rate our service in the portal to help us improve.</p>
            </div>
            ` : ""}
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.CLIENT_URL}/user/complaints"
                style="background: #0f4c75; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
                View in Portal →
              </a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #aaa;">Smart Municipal Corporation • Ahmedabad, Gujarat</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #aaa;">📞 +91 79 2234 5678 • 📧 admin@smartmunicipal.gov.in</p>
          </div>
        </div>
      `,
    });
    console.log("✅ Status update email sent to:", email);
    return true;
  } catch (err) {
    console.error("❌ Status email error:", err.message);
    return false;
  }
};

// ✅ 4. Certificate Status Email
exports.sendCertificateStatusEmail = async (email, name, certData) => {
  try {
    const { type, status, certId } = certData;

    const statusEmoji = { Approved: "✅", Rejected: "❌", Pending: "⏳" };
    const statusColor = { Approved: "#059669", Rejected: "#e63946", Pending: "#f57c00" };

    const emoji = statusEmoji[status] || "📄";
    const color = statusColor[status] || "#0f4c75";

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${emoji} Certificate ${status} | SMC`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: #0f4c75; padding: 24px 28px; text-align: center;">
            <h2 style="color: white; margin: 0;">🏛️ Smart Municipal Corporation</h2>
            <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Certificate Request Update</p>
          </div>
          <div style="background: white; padding: 28px;">
            <p style="font-size: 15px; color: #333;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 14px; color: #555;">Your certificate request has been updated:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="background: ${color}; color: white; padding: 10px 24px; border-radius: 24px; font-size: 16px; font-weight: 700; display: inline-block;">
                ${emoji} ${status}
              </span>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Certificate ID</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">#${certId}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Type</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${type} Certificate</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-size: 13px; color: #888;">Status</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 700; color: ${color};">${emoji} ${status}</td>
              </tr>
            </table>
            ${status === "Approved" ? `
            <div style="background: #d1fae5; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
              <p style="margin: 0; color: #059669; font-size: 14px; font-weight: 600;">🎉 Your certificate has been approved!</p>
              <p style="margin: 6px 0 0; color: #059669; font-size: 13px;">You can collect it from the municipal office within 3 working days.</p>
            </div>
            ` : status === "Rejected" ? `
            <div style="background: #ffe4e4; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
              <p style="margin: 0; color: #e63946; font-size: 14px; font-weight: 600;">Your certificate request was rejected.</p>
              <p style="margin: 6px 0 0; color: #e63946; font-size: 13px;">Please visit the office or reapply with correct documents.</p>
            </div>
            ` : ""}
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/user/my-certificates"
                style="background: #0f4c75; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
                View in Portal →
              </a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #aaa;">Smart Municipal Corporation • Ahmedabad, Gujarat</p>
          </div>
        </div>
      `,
    });
    console.log("✅ Certificate email sent to:", email);
    return true;
  } catch (err) {
    console.error("❌ Certificate email error:", err.message);
    return false;
  }
};

// ✅ 5. City Update Email
exports.sendCityUpdateEmail = async (email, name, updateData) => {
  try {
    const { title, description } = updateData;

    const categoryEmoji = {
      General: "🏙️", Road: "🛣️", Water: "💧",
      Park: "🌳", Event: "📅", Infrastructure: "🏗️",
    };
    const emoji =
      Object.entries(categoryEmoji).find(([key]) =>
        title?.toLowerCase().includes(key.toLowerCase())
      )?.[1] || "🏙️";

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${emoji} City Update: ${title} | SMC`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: #0f4c75; padding: 24px 28px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 20px;">🏛️ Smart Municipal Corporation</h2>
            <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">City Update Notification</p>
          </div>
          <div style="background: #ffffff; padding: 28px;">
            <p style="font-size: 15px; color: #333;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 14px; color: #555; margin-bottom: 20px;">A new city update has been published for your area:</p>
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="background: #0f4c75; color: white; padding: 10px 24px; border-radius: 24px; font-size: 16px; font-weight: 700; display: inline-block;">
                ${emoji} New Update
              </span>
            </div>
            <div style="background: #f0f6ff; border-left: 4px solid #0f4c75; border-radius: 8px; padding: 18px 20px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px; font-size: 16px; color: #0f4c75;">${title}</h3>
              <p style="margin: 0; font-size: 14px; color: #444; line-height: 1.6;">${description}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-size: 13px; color: #888; width: 40%; border-bottom: 1px solid #eee;">Published By</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">Smart Municipal Corporation</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Date</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-size: 13px; color: #888;">City</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333;">Ahmedabad, Gujarat</td>
              </tr>
            </table>
            <div style="background: #e0f2fe; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
              <p style="margin: 0; color: #0369a1; font-size: 14px; font-weight: 600;">📢 Stay informed about your city!</p>
              <p style="margin: 6px 0 0; color: #0369a1; font-size: 13px;">Visit the portal to view all updates and stay up to date with municipal activities.</p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.CLIENT_URL}/user/city-updates"
                style="background: #0f4c75; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
                View Update in Portal →
              </a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #aaa;">Smart Municipal Corporation • Ahmedabad, Gujarat</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #aaa;">📞 +91 79 2234 5678 • 📧 admin@smartmunicipal.gov.in</p>
          </div>
        </div>
      `,
    });
    console.log("✅ City update email sent to:", email);
    return true;
  } catch (err) {
    console.error("❌ City update email error:", err.message);
    return false;
  }
};

// ✅ 6. Announcement Email
exports.sendAnnouncementEmail = async (email, name, announcementData) => {
  try {
    const { title, message } = announcementData;

    const priorityConfig = {
      High:   { color: "#e63946", bg: "#ffe4e4", emoji: "🚨", label: "High Priority" },
      Medium: { color: "#f57c00", bg: "#fff3e0", emoji: "📢", label: "Medium Priority" },
      Low:    { color: "#059669", bg: "#d1fae5", emoji: "📋", label: "Low Priority" },
    };
    const { color, bg, emoji, label } =
      priorityConfig[announcementData?.priority] || priorityConfig.Medium;

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${emoji} Announcement: ${title} | SMC`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: #1b6ca8; padding: 24px 28px; text-align: center;">
            <h2 style="color: white; margin: 0; font-size: 20px;">🏛️ Smart Municipal Corporation</h2>
            <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Public Announcement</p>
          </div>
          <div style="background: #ffffff; padding: 28px;">
            <p style="font-size: 15px; color: #333;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 14px; color: #555; margin-bottom: 20px;">A new announcement has been released by the Municipal Corporation:</p>
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="background: ${color}; color: white; padding: 10px 24px; border-radius: 24px; font-size: 16px; font-weight: 700; display: inline-block;">
                ${emoji} ${label}
              </span>
            </div>
            <div style="background: #f0f6ff; border-left: 4px solid #1b6ca8; border-radius: 8px; padding: 18px 20px; margin-bottom: 20px;">
              <h3 style="margin: 0 0 10px; font-size: 16px; color: #1b6ca8;">${title}</h3>
              <p style="margin: 0; font-size: 14px; color: #444; line-height: 1.6;">${message}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-size: 13px; color: #888; width: 40%; border-bottom: 1px solid #eee;">Announced By</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">Smart Municipal Corporation</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Priority</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 700; color: ${color}; border-bottom: 1px solid #eee;">${emoji} ${label}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Date</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-size: 13px; color: #888;">City</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333;">Ahmedabad, Gujarat</td>
              </tr>
            </table>
            <div style="background: ${bg}; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
              <p style="margin: 0; color: ${color}; font-size: 14px; font-weight: 600;">${emoji} This is a ${label} announcement.</p>
              <p style="margin: 6px 0 0; color: ${color}; font-size: 13px;">Please read carefully and take any necessary action as instructed.</p>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <a href="${process.env.CLIENT_URL}/user/announcements"
                style="background: #1b6ca8; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
                View Announcement →
              </a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #aaa;">Smart Municipal Corporation • Ahmedabad, Gujarat</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #aaa;">📞 +91 79 2234 5678 • 📧 admin@smartmunicipal.gov.in</p>
          </div>
        </div>
      `,
    });
    console.log("✅ Announcement email sent to:", email);
    return true;
  } catch (err) {
    console.error("❌ Announcement email error:", err.message);
    return false;
  }
};

// ✅ 7. Water Request Status Email
exports.sendWaterStatusEmail = async (email, name, waterData) => {
  try {
    const { type, area, status, requestId } = waterData;

    const emoji = status === "Approved" ? "✅" : status === "Rejected" ? "❌" : status === "Resolved" ? "🔧" : "⏳";
    const color = status === "Approved" || status === "Resolved" ? "#059669" : status === "Rejected" ? "#e63946" : "#f57c00";

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${emoji} Water Request Update | SMC`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: #1b6ca8; padding: 24px 28px; text-align: center;">
            <h2 style="color: white; margin: 0;">💧 Water Management Update</h2>
            <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Smart Municipal Corporation</p>
          </div>
          <div style="background: white; padding: 28px;">
            <p style="font-size: 15px; color: #333;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 14px; color: #555;">Your water ${type} request has been updated:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="background: ${color}; color: white; padding: 10px 24px; border-radius: 24px; font-size: 16px; font-weight: 700; display: inline-block;">
                ${emoji} ${status}
              </span>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Request ID</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">#${requestId}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Type</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${type}</td>
              </tr>
              <tr style="background: #f8fafc;">
                <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Area</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${area}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-size: 13px; color: #888;">Status</td>
                <td style="padding: 10px 14px; font-size: 13px; font-weight: 700; color: ${color};">${emoji} ${status}</td>
              </tr>
            </table>
            <div style="text-align: center;">
              <a href="${process.env.CLIENT_URL}/user/water"
                style="background: #1b6ca8; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
                View in Portal →
              </a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #aaa;">Smart Municipal Corporation • Ahmedabad, Gujarat</p>
          </div>
        </div>
      `,
    });
    console.log("✅ Water email sent to:", email);
    return true;
  } catch (err) {
    console.error("❌ Water email error:", err.message);
    return false;
  }
};

// ✅ 8. Points Award Email
exports.sendPointsEmail = async (email, name, pointsData) => {
  try {
    const { points, reason, totalPoints } = pointsData;

    const transporter = createTransporter();
    await transporter.sendMail({
      from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `⭐ You earned ${points} points! | SMC`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <div style="background: #f57c00; padding: 24px 28px; text-align: center;">
            <h2 style="color: white; margin: 0;">⭐ Points Awarded!</h2>
            <p style="color: rgba(255,255,255,0.9); margin: 6px 0 0; font-size: 13px;">Smart Municipal Corporation</p>
          </div>
          <div style="background: white; padding: 28px; text-align: center;">
            <p style="font-size: 15px; color: #333;">Hello <strong>${name}</strong>,</p>
            <p style="font-size: 14px; color: #555;">The admin has awarded you points!</p>
            <div style="background: #fff8e1; border-radius: 16px; padding: 24px; margin: 20px 0;">
              <p style="font-size: 48px; margin: 0;">⭐</p>
              <p style="font-size: 36px; font-weight: 700; color: #f57c00; margin: 8px 0;">+${points} Points</p>
              <p style="font-size: 13px; color: #888; margin: 0;">Reason: ${reason}</p>
            </div>
            <div style="background: #f8fafc; border-radius: 10px; padding: 14px; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 14px; color: #555;">
                💰 Total Points: <strong style="color: #f57c00;">${totalPoints} pts</strong>
                = ₹${Math.floor(totalPoints / 100)} discount on property tax!
              </p>
            </div>
            <a href="${process.env.CLIENT_URL}/user/points"
              style="background: #f57c00; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
              View My Points →
            </a>
          </div>
          <div style="background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
            <p style="margin: 0; font-size: 12px; color: #aaa;">Smart Municipal Corporation • Ahmedabad, Gujarat</p>
          </div>
        </div>
      `,
    });
    console.log("✅ Points email sent to:", email);
    return true;
  } catch (err) {
    console.error("❌ Points email error:", err.message);
    return false;
  }
};





// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   // ✅ Production ke liye
//   // tls: {
//   //   rejectUnauthorized: false
//   // }
// });
// // const nodemailer = require("nodemailer");

// // const transporter = nodemailer.createTransport({
// //   service: "gmail",
// //   auth: {
// //     user: process.env.EMAIL_USER,
// //     pass: process.env.EMAIL_PASS,
// //   },
// // });

// // ✅ Complaint Status Update Email
// exports.sendStatusUpdateEmail = async (email, name, complaintData) => {
//   const { type, area, status, complaintId } = complaintData;

//   const statusColors = {
//     Pending: "#f57c00",
//     Assigned: "#1b6ca8",
//     Resolved: "#059669",
//     Cancelled: "#e63946"
//   };

//   const statusEmoji = {
//     Pending: "⏳",
//     Assigned: "🏢",
//     Resolved: "✅",
//     Cancelled: "❌"
//   };

//   const color = statusColors[status] || "#0f4c75";
//   const emoji = statusEmoji[status] || "📋";

//   await transporter.sendMail({
//     from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: `${emoji} Complaint Update — ${status} | SMC`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

//         <!-- Header -->
//         <div style="background: #0f4c75; padding: 24px 28px; text-align: center;">
//           <h2 style="color: white; margin: 0; font-size: 20px;">🏛️ Smart Municipal Corporation</h2>
//           <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Complaint Status Update</p>
//         </div>

//         <!-- Body -->
//         <div style="background: #ffffff; padding: 28px;">
//           <p style="font-size: 15px; color: #333;">Hello <strong>${name}</strong>,</p>
//           <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
//             Your complaint has been updated. Here are the details:
//           </p>

//           <!-- Status Badge -->
//           <div style="text-align: center; margin-bottom: 24px;">
//             <span style="background: ${color}; color: white; padding: 10px 24px; border-radius: 24px; font-size: 16px; font-weight: 700; display: inline-block;">
//               ${emoji} ${status}
//             </span>
//           </div>

//           <!-- Details -->
//           <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//             <tr style="background: #f8fafc;">
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; width: 40%; border-bottom: 1px solid #eee;">Complaint ID</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">#${complaintId}</td>
//             </tr>
//             <tr>
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Type</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${type}</td>
//             </tr>
//             <tr style="background: #f8fafc;">
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Area</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${area}</td>
//             </tr>
//             <tr>
//               <td style="padding: 10px 14px; font-size: 13px; color: #888;">Status</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 700; color: ${color};">${emoji} ${status}</td>
//             </tr>
//           </table>

//           ${status === "Resolved" ? `
//           <div style="background: #d1fae5; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
//             <p style="margin: 0; color: #059669; font-size: 14px; font-weight: 600;">
//               🎉 Your complaint has been resolved! Thank you for reporting.
//             </p>
//             <p style="margin: 6px 0 0; color: #059669; font-size: 13px;">
//               Please rate our service in the portal to help us improve.
//             </p>
//           </div>
//           ` : ""}

//           <div style="text-align: center; margin-top: 20px;">
//             <a href="${process.env.CLIENT_URL}/user/complaints"
//               style="background: #0f4c75; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
//               View in Portal →
//             </a>
//           </div>
//         </div>

//         <!-- Footer -->
//         <div style="background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
//           <p style="margin: 0; font-size: 12px; color: #aaa;">
//             Smart Municipal Corporation • Ahmedabad, Gujarat
//           </p>
//           <p style="margin: 4px 0 0; font-size: 12px; color: #aaa;">
//             📞 +91 79 2234 5678 • 📧 admin@smartmunicipal.gov.in
//           </p>
//         </div>
//       </div>
//     `
//   });
// };

// // ✅ Certificate Status Email
// exports.sendCertificateStatusEmail = async (email, name, certData) => {
//   const { type, status, certId } = certData;

//   const statusEmoji = {
//     Approved: "✅",
//     Rejected: "❌",
//     Pending: "⏳"
//   };

//   const statusColor = {
//     Approved: "#059669",
//     Rejected: "#e63946",
//     Pending: "#f57c00"
//   };

//   const emoji = statusEmoji[status] || "📄";
//   const color = statusColor[status] || "#0f4c75";

//   await transporter.sendMail({
//     from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: `${emoji} Certificate ${status} | SMC`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
//         <div style="background: #0f4c75; padding: 24px 28px; text-align: center;">
//           <h2 style="color: white; margin: 0;">🏛️ Smart Municipal Corporation</h2>
//           <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Certificate Request Update</p>
//         </div>
//         <div style="background: white; padding: 28px;">
//           <p style="font-size: 15px; color: #333;">Hello <strong>${name}</strong>,</p>
//           <p style="font-size: 14px; color: #555;">Your certificate request has been updated:</p>

//           <div style="text-align: center; margin: 20px 0;">
//             <span style="background: ${color}; color: white; padding: 10px 24px; border-radius: 24px; font-size: 16px; font-weight: 700; display: inline-block;">
//               ${emoji} ${status}
//             </span>
//           </div>

//           <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//             <tr style="background: #f8fafc;">
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Certificate ID</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">#${certId}</td>
//             </tr>
//             <tr>
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Type</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${type} Certificate</td>
//             </tr>
//             <tr style="background: #f8fafc;">
//               <td style="padding: 10px 14px; font-size: 13px; color: #888;">Status</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 700; color: ${color};">${emoji} ${status}</td>
//             </tr>
//           </table>

//           ${status === "Approved" ? `
//           <div style="background: #d1fae5; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
//             <p style="margin: 0; color: #059669; font-size: 14px; font-weight: 600;">
//               🎉 Your certificate has been approved!
//             </p>
//             <p style="margin: 6px 0 0; color: #059669; font-size: 13px;">
//               You can collect it from the municipal office within 3 working days.
//             </p>
//           </div>
//           ` : status === "Rejected" ? `
//           <div style="background: #ffe4e4; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
//             <p style="margin: 0; color: #e63946; font-size: 14px; font-weight: 600;">
//               Your certificate request was rejected.
//             </p>
//             <p style="margin: 6px 0 0; color: #e63946; font-size: 13px;">
//               Please visit the office for more information or reapply with correct documents.
//             </p>
//           </div>
//           ` : ""}

//           <div style="text-align: center;">
//             <a href="${process.env.CLIENT_URL}/user/my-certificates"
//               style="background: #0f4c75; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
//               View in Portal →
//             </a>
//           </div>
//         </div>
//         <div style="background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
//           <p style="margin: 0; font-size: 12px; color: #aaa;">Smart Municipal Corporation • Ahmedabad, Gujarat</p>
//         </div>
//       </div>
//     `
//   });
// };

// // ✅ City Update Email — Rich Format (updated)
// exports.sendCityUpdateEmail = async (email, name, updateData) => {
//   const { title, description } = updateData;

//   const categoryEmoji = {
//     General: "🏙️",
//     Road: "🛣️",
//     Water: "💧",
//     Park: "🌳",
//     Event: "📅",
//     Infrastructure: "🏗️",
//   };

//   // pick emoji from title keywords or default
//   const emoji =
//     Object.entries(categoryEmoji).find(([key]) =>
//       title?.toLowerCase().includes(key.toLowerCase())
//     )?.[1] || "🏙️";

//   await transporter.sendMail({
//     from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: `${emoji} City Update: ${title} | SMC`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

//         <!-- Header -->
//         <div style="background: #0f4c75; padding: 24px 28px; text-align: center;">
//           <h2 style="color: white; margin: 0; font-size: 20px;">🏛️ Smart Municipal Corporation</h2>
//           <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">City Update Notification</p>
//         </div>

//         <!-- Body -->
//         <div style="background: #ffffff; padding: 28px;">
//           <p style="font-size: 15px; color: #333;">Hello <strong>${name}</strong>,</p>
//           <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
//             A new city update has been published for your area. Here are the details:
//           </p>

//           <!-- Update Badge -->
//           <div style="text-align: center; margin-bottom: 24px;">
//             <span style="background: #0f4c75; color: white; padding: 10px 24px; border-radius: 24px; font-size: 16px; font-weight: 700; display: inline-block;">
//               ${emoji} New Update
//             </span>
//           </div>

//           <!-- Details Card -->
//           <div style="background: #f0f6ff; border-left: 4px solid #0f4c75; border-radius: 8px; padding: 18px 20px; margin-bottom: 20px;">
//             <h3 style="margin: 0 0 10px; font-size: 16px; color: #0f4c75;">${title}</h3>
//             <p style="margin: 0; font-size: 14px; color: #444; line-height: 1.6;">${description}</p>
//           </div>

//           <!-- Details Table -->
//           <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//             <tr style="background: #f8fafc;">
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; width: 40%; border-bottom: 1px solid #eee;">Published By</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">Smart Municipal Corporation</td>
//             </tr>
//             <tr>
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Date</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</td>
//             </tr>
//             <tr style="background: #f8fafc;">
//               <td style="padding: 10px 14px; font-size: 13px; color: #888;">City</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333;">Ahmedabad, Gujarat</td>
//             </tr>
//           </table>

//           <!-- Info Box -->
//           <div style="background: #e0f2fe; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
//             <p style="margin: 0; color: #0369a1; font-size: 14px; font-weight: 600;">
//               📢 Stay informed about your city!
//             </p>
//             <p style="margin: 6px 0 0; color: #0369a1; font-size: 13px;">
//               Visit the portal to view all updates and stay up to date with municipal activities.
//             </p>
//           </div>

//           <!-- CTA Button -->
//           <div style="text-align: center; margin-top: 20px;">
//             <a href="${process.env.CLIENT_URL}/user/city-updates"
//               style="background: #0f4c75; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
//               View Update in Portal →
//             </a>
//           </div>
//         </div>

//         <!-- Footer -->
//         <div style="background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
//           <p style="margin: 0; font-size: 12px; color: #aaa;">
//             Smart Municipal Corporation • Ahmedabad, Gujarat
//           </p>
//           <p style="margin: 4px 0 0; font-size: 12px; color: #aaa;">
//             📞 +91 79 2234 5678 • 📧 admin@smartmunicipal.gov.in
//           </p>
//         </div>
//       </div>
//     `,
//   });
// };


// // ✅ Announcement Email — Rich Format (updated)
// exports.sendAnnouncementEmail = async (email, name, announcementData) => {
//   const { title, message } = announcementData;

//   const priorityConfig = {
//     High: { color: "#e63946", bg: "#ffe4e4", emoji: "🚨", label: "High Priority" },
//     Medium: { color: "#f57c00", bg: "#fff3e0", emoji: "📢", label: "Medium Priority" },
//     Low: { color: "#059669", bg: "#d1fae5", emoji: "📋", label: "Low Priority" },
//   };

//   const { color, bg, emoji, label } = priorityConfig[announcementData?.priority] || priorityConfig.Medium;

//   await transporter.sendMail({
//     from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: `${emoji} Announcement: ${title} | SMC`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">

//         <!-- Header -->
//         <div style="background: #1b6ca8; padding: 24px 28px; text-align: center;">
//           <h2 style="color: white; margin: 0; font-size: 20px;">🏛️ Smart Municipal Corporation</h2>
//           <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Public Announcement</p>
//         </div>

//         <!-- Body -->
//         <div style="background: #ffffff; padding: 28px;">
//           <p style="font-size: 15px; color: #333;">Hello <strong>${name}</strong>,</p>
//           <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
//             A new announcement has been released by the Municipal Corporation:
//           </p>

//           <!-- Priority Badge -->
//           <div style="text-align: center; margin-bottom: 24px;">
//             <span style="background: ${color}; color: white; padding: 10px 24px; border-radius: 24px; font-size: 16px; font-weight: 700; display: inline-block;">
//               ${emoji} ${label}
//             </span>
//           </div>

//           <!-- Announcement Card -->
//           <div style="background: #f0f6ff; border-left: 4px solid #1b6ca8; border-radius: 8px; padding: 18px 20px; margin-bottom: 20px;">
//             <h3 style="margin: 0 0 10px; font-size: 16px; color: #1b6ca8;">${title}</h3>
//             <p style="margin: 0; font-size: 14px; color: #444; line-height: 1.6;">${message}</p>
//           </div>

//           <!-- Details Table -->
//           <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//             <tr style="background: #f8fafc;">
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; width: 40%; border-bottom: 1px solid #eee;">Announced By</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">Smart Municipal Corporation</td>
//             </tr>
//             <tr>
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Priority</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 700; color: ${color}; border-bottom: 1px solid #eee;">${emoji} ${label}</td>
//             </tr>
//             <tr style="background: #f8fafc;">
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Date</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</td>
//             </tr>
//             <tr>
//               <td style="padding: 10px 14px; font-size: 13px; color: #888;">City</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333;">Ahmedabad, Gujarat</td>
//             </tr>
//           </table>

//           <!-- Priority Info Box -->
//           <div style="background: ${bg}; border-radius: 10px; padding: 14px 18px; margin-bottom: 20px;">
//             <p style="margin: 0; color: ${color}; font-size: 14px; font-weight: 600;">
//               ${emoji} This is a ${label} announcement.
//             </p>
//             <p style="margin: 6px 0 0; color: ${color}; font-size: 13px;">
//               Please read carefully and take any necessary action as instructed.
//             </p>
//           </div>

//           <!-- CTA Button -->
//           <div style="text-align: center; margin-top: 20px;">
//             <a href="${process.env.CLIENT_URL}/user/announcements"
//               style="background: #1b6ca8; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
//               View Announcement →
//             </a>
//           </div>
//         </div>

//         <!-- Footer -->
//         <div style="background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
//           <p style="margin: 0; font-size: 12px; color: #aaa;">
//             Smart Municipal Corporation • Ahmedabad, Gujarat
//           </p>
//           <p style="margin: 4px 0 0; font-size: 12px; color: #aaa;">
//             📞 +91 79 2234 5678 • 📧 admin@smartmunicipal.gov.in
//           </p>
//         </div>
//       </div>
//     `,
//   });
// };

// // ✅ Water Request Email
// exports.sendWaterStatusEmail = async (email, name, waterData) => {
//   const { type, area, status, requestId } = waterData;

//   const emoji = status === "Approved" ? "✅" : status === "Rejected" ? "❌" : status === "Resolved" ? "🔧" : "⏳";
//   const color = status === "Approved" || status === "Resolved" ? "#059669" : status === "Rejected" ? "#e63946" : "#f57c00";

//   await transporter.sendMail({
//     from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: `${emoji} Water Request Update | SMC`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
//         <div style="background: #1b6ca8; padding: 24px 28px; text-align: center;">
//           <h2 style="color: white; margin: 0;">💧 Water Management Update</h2>
//           <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 13px;">Smart Municipal Corporation</p>
//         </div>
//         <div style="background: white; padding: 28px;">
//           <p style="font-size: 15px; color: #333;">Hello <strong>${name}</strong>,</p>
//           <p style="font-size: 14px; color: #555;">Your water ${type} request has been updated:</p>

//           <div style="text-align: center; margin: 20px 0;">
//             <span style="background: ${color}; color: white; padding: 10px 24px; border-radius: 24px; font-size: 16px; font-weight: 700; display: inline-block;">
//               ${emoji} ${status}
//             </span>
//           </div>

//           <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
//             <tr style="background: #f8fafc;">
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Request ID</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">#${requestId}</td>
//             </tr>
//             <tr>
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Type</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${type}</td>
//             </tr>
//             <tr style="background: #f8fafc;">
//               <td style="padding: 10px 14px; font-size: 13px; color: #888; border-bottom: 1px solid #eee;">Area</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 600; color: #333; border-bottom: 1px solid #eee;">${area}</td>
//             </tr>
//             <tr>
//               <td style="padding: 10px 14px; font-size: 13px; color: #888;">Status</td>
//               <td style="padding: 10px 14px; font-size: 13px; font-weight: 700; color: ${color};">${emoji} ${status}</td>
//             </tr>
//           </table>

//           <div style="text-align: center;">
//             <a href="${process.env.CLIENT_URL}/user/water"
//               style="background: #1b6ca8; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
//               View in Portal →
//             </a>
//           </div>
//         </div>
//         <div style="background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
//           <p style="margin: 0; font-size: 12px; color: #aaa;">Smart Municipal Corporation • Ahmedabad, Gujarat</p>
//         </div>
//       </div>
//     `
//   });
// };

// // ✅ Points Award Email
// exports.sendPointsEmail = async (email, name, pointsData) => {
//   const { points, reason, totalPoints } = pointsData;

//   await transporter.sendMail({
//     from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: `⭐ You earned ${points} points! | SMC`,
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
//         <div style="background: linear-gradient(135deg, #f57c00, #ff9800); padding: 24px 28px; text-align: center;">
//           <h2 style="color: white; margin: 0;">⭐ Points Awarded!</h2>
//           <p style="color: rgba(255,255,255,0.9); margin: 6px 0 0; font-size: 13px;">Smart Municipal Corporation</p>
//         </div>
//         <div style="background: white; padding: 28px; text-align: center;">
//           <p style="font-size: 15px; color: #333;">Hello <strong>${name}</strong>,</p>
//           <p style="font-size: 14px; color: #555;">The admin has awarded you points!</p>

//           <div style="background: linear-gradient(135deg, #fff8e1, #fff3cd); border-radius: 16px; padding: 24px; margin: 20px 0; display: inline-block; width: 100%; box-sizing: border-box;">
//             <p style="font-size: 48px; margin: 0;">⭐</p>
//             <p style="font-size: 36px; font-weight: 700; color: #f57c00; margin: 8px 0;">+${points} Points</p>
//             <p style="font-size: 13px; color: #888; margin: 0;">Reason: ${reason}</p>
//           </div>

//           <div style="background: #f8fafc; border-radius: 10px; padding: 14px; margin-bottom: 20px;">
//             <p style="margin: 0; font-size: 14px; color: #555;">
//               💰 Total Points: <strong style="color: #f57c00;">${totalPoints} pts</strong>
//               = ₹${Math.floor(totalPoints / 100)} discount on property tax!
//             </p>
//           </div>

//           <a href="${process.env.CLIENT_URL}/user/points"
//             style="background: #f57c00; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; display: inline-block;">
//             View My Points →
//           </a>
//         </div>
//         <div style="background: #f8fafc; padding: 16px 28px; text-align: center; border-top: 1px solid #eee;">
//           <p style="margin: 0; font-size: 12px; color: #aaa;">Smart Municipal Corporation • Ahmedabad, Gujarat</p>
//         </div>
//       </div>
//     `
//   });
// };

// // OTP emails (existing)
// exports.sendOTPEmail = async (email, otp, name) => {
//   await transporter.sendMail({
//     from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Email Verification OTP - Smart Municipal Corporation",
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
//         <div style="background: #0f4c75; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="color: white; margin: 0;">🏛️ Smart Municipal Corporation</h2>
//         </div>
//         <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
//           <h3>Hello ${name}! 👋</h3>
//           <p>Your OTP for email verification is:</p>
//           <div style="background: #0f4c75; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 10px; letter-spacing: 8px; margin: 20px 0;">
//             ${otp}
//           </div>
//           <p style="color: #888; font-size: 13px;">Valid for <strong>10 minutes</strong>.</p>
//         </div>
//       </div>
//     `,
//   });
// };

// exports.sendForgotPasswordEmail = async (email, otp, name) => {
//   await transporter.sendMail({
//     from: `"Smart Municipal Corporation" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: "Password Reset OTP - Smart Municipal Corporation",
//     html: `
//       <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
//         <div style="background: #e63946; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
//           <h2 style="color: white; margin: 0;">🔐 Password Reset</h2>
//         </div>
//         <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
//           <h3>Hello ${name}!</h3>
//           <p>Your OTP for password reset:</p>
//           <div style="background: #e63946; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 10px; letter-spacing: 8px; margin: 20px 0;">
//             ${otp}
//           </div>
//           <p style="color: #888; font-size: 13px;">Valid for <strong>10 minutes</strong>.</p>
//         </div>
//       </div>
//     `,
//   });
// };