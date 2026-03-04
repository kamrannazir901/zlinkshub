import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FORGOT PASSWORD
export const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // 1. Generate Reset Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // 2. Hash and set to user model
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 Hour

    await user.save();

    // 3. Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // 4. Send Email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true, // true for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      // Add this to help with local self-signed certificate issues if they occur
      tls: {
        rejectUnauthorized: false,
      },
    });

    transporter.verify((error, success) => {
      if (error) {
        console.log("SMTP Connection Error:", error);
      } else {
        console.log("Server is ready to take our messages");
      }
    });

    const mailOptions = {
      from: `"ZLinks Hub" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your ZLinks Hub password",
      html: `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 500px;">
      <h2 style="color: #333;">Password Reset</h2>
      <p>Click the button below to reset your password. This link expires in 1 hour.</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #d81159; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Reset Password
      </a>
      <p style="margin-top: 20px; font-size: 12px; color: #777;">
        If you didn't request this, ignore this email.
      </p>
    </div>
  `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    // Set new password (the pre-save hook in User.js will hash this automatically)
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CONTACT FORM SUBMIT (Direct Email, No DB)
export const contactForm = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // 1. Validation
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and message." });
    }

    // 2. Create Transporter (Same as your Forgot Password config)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // 3. Setup Mail Options
    const mailOptions = {
      from: `"ZLinksHub Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Sending TO the admin email
      replyTo: email, // Allows admin to click "Reply" and email the user directly
      subject: `New Contact Form: ${subject || "No Subject"}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px; color: #333;">
          <h2 style="color: #d81159; border-bottom: 2px solid #d81159; padding-bottom: 10px;">New Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p><strong>Message:</strong></p>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; line-height: 1.6;">
            ${message}
          </p>
          <p style="font-size: 11px; color: #999; margin-top: 30px;">
            Sent from ZLinksHub Contact Form
          </p>
        </div>
      `,
    };

    // 4. Send the Email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Your message has been sent to the admin successfully!",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    res
      .status(500)
      .json({ message: "Failed to send message. Please try again later." });
  }
};
