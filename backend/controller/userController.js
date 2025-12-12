import User from "../models/user.js";
import OTP from "../models/otp.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { OAuth2Client } from 'google-auth-library';
import nodemailer from 'nodemailer';
dotenv.config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);




const transporter = nodemailer.createTransport({
  service: 'Gmail',
  port : 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

export function createUser(req, res) {
  const passwordHash = bcrypt.hashSync(req.body.password, 10);
  const userData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    password: passwordHash,
    role: req.body.role, // <-- add this
    isBlocked: req.body.isBlocked, // <-- add this
    isEmailVerified: req.body.isEmailVerified, // <-- add this
    image: req.body.image // <-- add this
  };
  const user = new User(userData);

  user
    .save()
    .then(() => {
      res.json({
        message: "User created successfully",
        user,
      });
    })
    .catch((err) => {
      res.json({
        message: "Error creating user",
        error: err.message,
      });
    });
}

export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (user == null) {
        return res.status(404).json({ message: "User not found" });
      } else {
        const passwordValid = bcrypt.compareSync(password, user.password);
        if (passwordValid) {
          const token = jwt.sign(
            {
              email: user.email,
              firstname: user.firstname,
              lastname: user.lastname,
              role: user.role,
              isBlocked: user.isBlocked,
              isEmailVerified: user.isEmailVerified,
              image: user.image,
            },
            process.env.JWT_SECRET,
          );
          res.json({
            message: "Login successful",
            role: user.role,
            token: token,
          });
        } else {
          res.status(401).json({
            message: "Invalid password",
          });
        }
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ message: "Error logging in", error: err.message });
    });
}
export async function googleLogin(req, res) {
  try {
    const { credential } = req.body;
    
    console.log('GOOGLE_CLIENT_ID from env:', process.env.GOOGLE_CLIENT_ID);
    
    // Verify the Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const email = payload.email;
    const firstname = payload.given_name || '';
    const lastname = payload.family_name || '';
    const image = payload.picture || '';
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        firstname,
        lastname,
        email,
        password: bcrypt.hashSync(Math.random().toString(36), 10), // Random password
        image,
        isEmailVerified: true, // Google emails are verified
        role: 'customer'
      });
      await user.save();
    }
    
    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        isBlocked: user.isBlocked,
        isEmailVerified: user.isEmailVerified,
        image: user.image,
      },
      process.env.JWT_SECRET,
    );
    
    res.json({
      message: "Google login successful",
      role: user.role,
      token: token,
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(401).json({
      message: "Google authentication failed",
      error: error.message
    });
  }
}

export async function getuser(req, res) {
  if (!req.user) {
    return res.status(401).json({
      message: "Please log in to view user information",
      error: "User not authenticated",
    });
  }

  try {
    // Fetch full user data from database instead of using token data
    const user = await User.findOne({ email: req.user.email }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User information retrieved successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
}

export async function updateUser(req, res) {
  if (!req.user) {
    return res.status(401).json({
      message: "Please log in to update user information",
      error: "User not authenticated",
    });
  }

  try {
    console.log("Updating user:", req.user.email);
    console.log("Update data:", req.body);
    
    const { firstname, lastname, phone, address } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { email: req.user.email },
      { firstname, lastname, phone, address },
      { new: true }
    );

    console.log("Updated user:", updatedUser);

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
}
export async function sendResetPasswordOTP(req, res) {
  const email = req.body.email;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email address" });
    }

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: email });

    // Create new OTP entry
    const otpEntry = new OTP({
      email: email,
      otp: otp,
      expireAt: new Date(Date.now() + 10 * 60 * 1000) // OTP valid for 10 minutes
    });
    await otpEntry.save();

    // Send email with OTP
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset OTP - E-Commerce',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password. Use the OTP below to reset your password:</p>
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #1F2937; margin: 0; font-size: 36px; letter-spacing: 8px;">${otp}</h1>
          </div>
          <p><strong>This OTP will expire in 10 minutes.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 30px 0;" />
          <p style="color: #6B7280; font-size: 12px;">This is an automated email, please do not reply.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'OTP sent successfully to your email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
}

export async function verifyOTP(req, res) {
  const { email, otp } = req.body;

  try {
    // Find OTP entry
    const otpEntry = await OTP.findOne({ email });

    if (!otpEntry) {
      return res.status(404).json({ message: "OTP not found or expired" });
    }

    // Check if OTP matches
    if (otpEntry.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP has expired
    if (new Date() > otpEntry.expireAt) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: "OTP has expired" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
}

export async function resetPassword(req, res) {
  const { email, otp, newPassword } = req.body;

  try {
    // Verify OTP one more time
    const otpEntry = await OTP.findOne({ email });

    if (!otpEntry) {
      return res.status(404).json({ message: "OTP not found or expired" });
    }

    if (otpEntry.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > otpEntry.expireAt) {
      await OTP.deleteOne({ email });
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Hash new password
    const passwordHash = bcrypt.hashSync(newPassword, 10);

    // Update user password
    const user = await User.findOneAndUpdate(
      { email },
      { password: passwordHash },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete OTP entry after successful password reset
    await OTP.deleteOne({ email });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
}

export function isAdmin(req, res) {
  if (req.user == null) {
    return false;
  }
  if (req.user.role !== "admin") {
    return false;
  }
  else{
    return true;
  }
}
