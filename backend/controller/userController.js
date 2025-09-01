import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        else{
            const passwordValid = bcrypt.compareSync(password, user.password);
            if(passwordValid){
                const token = jwt.sign({
                    email : user.email,
                    firstname : user.firstname,
                    lastname : user.lastname,
                    role : user.role,
                    isBlocked : user.isBlocked,
                    isEmailVerified : user.isEmailVerified,
                    image : user.image

                },
                "secret"
            )
                res.json({
                    message: "Login successful",
                    token: token
                })
            }else{
                res.status(401).json({
                    message: "Invalid password"
                });
            }
        }
    }).catch((err) => {
        return res.status(500).json({ message: "Error logging in", error: err.message });
    });
}


  
