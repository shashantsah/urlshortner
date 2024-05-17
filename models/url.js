const mongoose=require("mongoose");

const urlSchema = new mongoose.Schema({
    shortID: {
        type: String,
        required: true,
      
    },
    redirectURL: {
        type: String,
        required: true,
        unique:false,
         
    },
    visitHistory: [{
        timestamp:
        {
            type:Number
        },
        ipAddress: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        }
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
    }
}, { timestamps: true });


const URL = mongoose.model('url', urlSchema);

module.exports = URL;