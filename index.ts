import {connectDB, db} from "./src/db/db";
import express from "express";
import jwt from "jsonwebtoken";
import { ObjectId } from "bson";
import bcyrpt from "bcrypt";
const secretkey = "secret";
let app = express();

app.use(express.json());
connectDB();

function hasspass(password:string){
    return bcyrpt.hashSync(password,10)
}


app.post("/signup", async(req, res) => {
    
    let {name,email} = req.body;
    let password = hasspass(req.body.password);
    await db.collection('users').insertOne({name,email,password})
    res.send("created");
})

app.post("/login", async(req, res) => {
    
    let {email,password} = req.body;
    
    let  finduser = await db.collection('users').findOne({email});
    if(finduser){
        if(await bcyrpt.compareSync(password,finduser.password) ){
    const tokenweb = jwt.sign(finduser,secretkey,{expiresIn:"1h"})
        console.log("token",tokenweb)
        res.send({tokenweb})
    }
       
    else{
        res.send("not login")
    }
}
}
);






app.post("/create",verifytoken, async(req, res) => {
    jwt.verify(req.token,secretkey,(err,tokenweb)=>{
            if(err){
            console.log({err})
        }else{
            console.log({tokenweb})
        }
    })
 

    var created = JSON.parse(Buffer.from(req.headers.authorization.split('.')[1], 'base64').toString());
    
    
    var createdBy=created._id;

let date = new Date();
let {title,description,status} = req.body;
 db.collection('todo').insertOne({title,description,status,date,createdBy})
res.send("created");

})

  
function verifytoken  (req,res,next){
 try {
    const bearerheader = req.headers["authorization"]
if(typeof bearerheader !== undefined){
    const bear = bearerheader.split('')
    const beartoken = bear[1]
    req.token = beartoken
//     var dd = jwt.verify(req.token,secretkey,(err,decode)=>{
//        if(err){
//         res.send({err:"token not verify"})
//        }else{
//            res.send({tokenweb:decode.tokenweb})
        
//        }
//        res.send({err: 'Unautorized -- access'})
//    })
//    console.log(dd)
    next()
    // next()
}else{
    res.send({err: 'Unautorized ==access'})
}
} catch (error) {
    res.send({err: error})
}
}




app.put("/edit/:id", async(req, res) => {
    let date = new Date();
    // const id = req.body.id;
    const id = new ObjectId(req.params.id);
    const {title,description,status} = req.body;
    await db.collection('todo').updateOne({"_id":id},{$set:{title,description,status}},)
    res.send("updated");
})



app.delete('/delete/:id', async(req, res) => {
// let date = new Date()

const id = new ObjectId(req.params.id);
// const {title,description,status} = req.body;

const deleteREs= await db.collection('users').deleteOne({})

deleteREs.deletedCount ? console.log("deleted") : console.log("not deleted")
if(deleteREs.deletedCount){
    res.send("deleted");
}else{
    res.send("not deleted");
}
})

app.get("/get", async(req, res) => {
   
    
    // const id = new ObjectId(req.params.id);
    // const finduser = await db.collection('todo').find({},{projection:{_id:0,description:1}}).limit(1).toArray();

    // const finduser = await db.collection('todo').find({}).toArray();


    const finduser = await db.collection('todo').aggregate([
        {
            $lookup:
                {
                from:"todo",
                localField:"todoId",
                foreignField:"_Id",
                as:"user"}
        },
     //   {
          //  $unwind:"$user"
     //   },
    //    {
     //       $project:{

  //          _id:0,
     //           title:1,
  //              description:1,
//                status:1,
   //             date:1,
   //             createdBy:1,
   //             user:{
    //                _id:1,
            //name:1,
     //               email:1
    //            }
     //       },
        }
    ]).toArray();

    if(finduser){
        res.send(finduser)
    }
    else{
        res.send("not find")
    }

// jwt.find()
    // res.send(finduser)
})

app.listen(5001, () =>  console.log("server started on 5001"))
