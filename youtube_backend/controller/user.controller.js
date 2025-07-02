// Password encrypt karne ke liye bcrypt import kiya
import bcrypt from 'bcryptjs';

// Cloudinary ke config file import kiya (image upload ke liye)
import cloudinary from '../Config/cloudinary.js';

// Mongoose import kiya (MongoDB ke saath kaam karne ke liye)
import mongoose from 'mongoose';

// User model import kiya jisme schema defined hai
import User from '../models/user.models.js';

import jwt from 'jsonwebtoken';


// Signup function define kiya
async function signup(req, res) {
    try {
        // User ke form se bheje gaye data ko console pe print kiya (debugging purpose ke liye)
        console.log(req.body);
        console.log(req.files);

        // Password ko securely encrypt kiya (10 salt rounds ke saath)
        const hashcode = await bcrypt.hash(req.body.password, 10);

        // Image ko cloudinary par upload kiya
        const uploadImage = await cloudinary.uploader.upload(
            req.files.logourl.tempFilePath  // temp location se image path liya
        );

        // Upload hone ke baad cloudinary ka response dekhne ke liye console log
        console.log(uploadImage);

        // New User object create kiya
        const newUser = new User({
            _id: new mongoose.Types.ObjectId(), // MongoDB ke liye unique ID banaya
            channelName: req.body.channelName,  // Form se mila channel name
            email: req.body.email,              // Form se mila email
            password: hashcode,                 // Encrypted password
            phone: req.body.phone,              // Form se mila phone number
            logourl: uploadImage.secure_url,    // Cloudinary se mila image URL
            logoId: uploadImage.public_id,      // Cloudinary se mila image ID
        });

        // User ko database mein save kiya
        const user = await newUser.save();

        // Success response bheja client ko
        res.status(201).json({
            message: 'User created successfully',
            user,  // User object bhi bheja
        });
    } catch (e) {
        // Agar koi error aata hai toh 500 (server error) ke saath error bheja
        res.status(500).json({ error: e.message });
    }
}


// Login function placeholder (baad mein actual logic add karna hai)
async function login(req, res) {
   try{

    const existingUser=await User.findOne({email:req.body.email});
    if(!existingUser){
        return res.status(404).json({message:"User not found"});
    }
    const isPasswordValid=await bcrypt.compare(req.body.password,existingUser.password);
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid credentials"});
    }   
     const token =jwt.sign({
        _id: existingUser._id,
        channelName: existingUser.channelName,
        email: existingUser.email,
        phone: existingUser.phone,
        logoId: existingUser.logoId,
        
     }, process.env.JWT_SECRET, // JWT secret key se sign kiya
     {expiresIn:"1d"}); // Token ki expiry 1 din ke liye
     
     
     res.status(200).json({ 
        message: "Login successful",
        token, // Token client ko bheja
        user: {
            _id: existingUser._id,
            channelName: existingUser.channelName,
            email: existingUser.email,
            phone: existingUser.phone,
            logoId: existingUser.logoId,
            logourl: existingUser.logourl,
            subscribers: existingUser.subscribers,
            subscribedChannels: existingUser.subscribedChannels,
            token: token // Token bhi user object mein include kiya
        }
      });

   }
   catch(e){
       res.status(500).json({ error: e.message });
   }
}


// Signup aur Login function ko export kiya
export { signup, login };
