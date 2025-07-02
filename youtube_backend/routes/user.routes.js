import Router from 'express';
import {signup,login } from '../controller/user.controller.js';
import authMiddleware from '../middleware/Auth.js';

const router = Router();
router.post('/register', signup);
router.post('/login', login);

router.put("/update-profile" , authMiddleware , async(req , res)=>{
  try {
    const {channelName , phone} = req.body;
    let updatedData = {channelName , phone}

if(req.files && req.files.logoUrl){
  const uploadedImage = await cloudinary.uploader.upload(req.files.logoUrl.tempFilePath);
  updatedData.logoUrl = uploadedImage.secure_url;
  updatedData.logoId = uploadedImage.public_id
}

const updatedUser = await User.findByIdAndUpdate(req.user._id , updatedData , {new:true})

res.status(200).json({message:"Profile Updated Successfully" , updatedUser})
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "something went wrong", message: error.message });
  }
})

router.post("/subscribe" , authMiddleware , async (req , res)=>{
  try {
    const {channelId} = req.body // *userId = currentUser , channelId = user to subscribe ( channel)
    
    if(req.user._id === channelId){
      return res.status(400).json({error:"You cannot subscribe to yourself"})
    }

  const currentUser =   await User.findByIdAndUpdate(req.user._id , {
      $addToSet:{subscribedChannels:channelId}
    })

  const subscribedUser =   await User.findByIdAndUpdate(channelId , {
      $inc:{subscribers:1}
    })

    res.status(200).json(
      {
        message:"Subscribed Successfully✅",
        data:{currentUser,
        subscribedUser
        }}
    )

  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "something went wrong", message: error.message });
  }
})



export default router;