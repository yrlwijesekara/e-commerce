import User from "../models/user.js";
export function createUser(req, res) {
    const user = new User(req.body);

    
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


  
