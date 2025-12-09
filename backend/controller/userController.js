import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

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
