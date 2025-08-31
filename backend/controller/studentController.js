import Student from "../models/student.js";
export function getStudents(req,res){
   
    Student.find().then((students)=>{
        res.json(students);
    }).catch((error)=>{
        console.error("Error fetching students:", error);
        res.json("Internal server error");
    });
}

export function createStudents(req,res){
    console.log(req.body)
    const student = new Student(
        {
            name: req.body.name,
            age: req.body.age,
            email: req.body.email
        }
    );
    student.save().then(()=>{
        res.json("Student added successfully");
    }).catch((error)=>{
        console.error("Error adding student:", error);
        res.json("Internal server error");
    });
}
