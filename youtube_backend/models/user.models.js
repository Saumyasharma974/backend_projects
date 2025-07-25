import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    channelName:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
    },
    logourl:{
        type:String,
        required:true
    },
    logoId:{
        type:String,
        required:true
    },
    subscribers:{
        type:Number,
        default:0
    },
    subscribedChannels:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }]
},{timestamps:true})

const User=mongoose.model('User',userSchema);
export default User;