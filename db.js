import mongoose from "mongoose";

const conn = ()=>{
    mongoose.connect(process.env.DB_URI, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("Connected to DB");
    }).catch((error)=>{
        console.log(`DB connection error : ${error}`);
    });
};

export default conn;