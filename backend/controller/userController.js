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


  
