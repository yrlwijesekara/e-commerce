import User from "../models/user.js";
import bcrypt from "bcrypt";
export function createUser(req, res) {

     const passwordHash = bcrypt.hashSync(req.body.password, 10);
     const userData ={
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        email : req.body.email,
        phone : req.body.phone,
        password : passwordHash
        
     }
    const user = new User(userData);

    
    user.save().then(
        ()=>{
            res.json({
                message: "User created successfully",
                user
            });
        }
    ).catch(
        (err) => {
            res.json({
                message: "Error creating user",
                error: err.message
            });
        }
           
    )
        
}


export function loginUser(req, res) {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email }).then((user) => {
        if (user == null) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.json({ message: "Login successful", user });
    }).catch((err) => {
        res.status(500).json({ message: "Error logging in", error: err.message });
    });
}


  
