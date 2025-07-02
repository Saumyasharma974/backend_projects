import mongoose from 'mongoose';

import Router from 'express';
import authMiddleware from '../middleware/Auth.js';
import {deleteVideo, getAllVideo, getVideo, uploadVideo, videobycategory, videobyId, videobyTag} from '../controller/video.controller.js';
import {updateVideo} from '../controller/video.controller.js'
import videoModel from '../models/video.model.js';


const router = Router();

router.post('/upload',authMiddleware,uploadVideo);
router.put('/update/:id',authMiddleware,updateVideo);
router.delete('/delete/:id',authMiddleware,deleteVideo)
router.get('/myvideo',authMiddleware,getVideo)
router.get('/allvideos',authMiddleware,getAllVideo)
router.get('/tags/:tag',videobyTag)
router.get('/:id',authMiddleware,videobyId)
router.get('/category/:category',videobycategory)
router.post("/like" , authMiddleware , async (req , res)=>{
  try {
    const {videoId} = req.body;
    
  const video =   await videoModel.findByIdAndUpdate(videoId , {
      $addToSet:{likedBy:req.user._id},
      $pull:{disLikedBy:req.user._id}
    })

    
    res.status(200).json({message:"Liked the video" , video})    
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
})


router.post("/dislike" , authMiddleware , async(req ,res)=>{
  try {
    const { videoId } = req.body;

    await videoModel.findByIdAndUpdate(videoId, {
      $addToSet: { disLikedBy: req.user._id},
      $pull: { likedBy: req.user._id }, // Remove from likes if previously liked
    });

    
    res.status(200).json({ message: "Disliked the video" });
  } catch (error) {
    console.error("Dislike Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
})
export default router;