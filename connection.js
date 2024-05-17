const mongoose=require("mongoose");

async function connectMongoDb(url){
    try{
         await mongoose.connect(url);
         console.log("db connected");
    }catch(err){
        console.log("db connection failed",err);
    }
}
module.exports={
    connectMongoDb,
}