import cloudinary from "../Config/cloudinary.js";
import videoModel from "../models/video.model.js";
import mongoose from "mongoose";
async function uploadVideo(req, res) {
    try{
       const {title,description,category, tags} = req.body;
       if(!req.files|| !req.files.video || !req.files.thumbnail){
           return res.status(400).json({message:"Video and thumbnail are required"});
       }
       const videoupload=await cloudinary.uploader.upload(req.files.video.tempFilePath,{
              resource_type: "video",
              folder: "youtube_videos"
       })
         const thumbnail=await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath,{
             
              folder: "thumbnail"
       })
         const newVideo = new videoModel({
              _id: new mongoose.Types.ObjectId(),
              title,
              description,
              category,
              tags: tags.split(',').map(tag => tag.trim()), // Tags ko array mein convert kiya
              videoUrl: videoupload.secure_url, // Cloudinary se mila video URL
              thumbnailUrl: thumbnail.secure_url, // Cloudinary se mila thumbnail URL
              videoId: videoupload.public_id, // Cloudinary se mila video ID
              thumbnailId: thumbnail.public_id, // Cloudinary se mila thumbnail ID
              user_id: req.user._id // User ID from auth middleware
         });
            const savedVideo = await newVideo.save();
            res.status(201).json({
                message: 'Video uploaded successfully',
                video: savedVideo // Saved video object bheja
            });
    }
    catch(e){
        res.status(500).json({ error: e.message });

    }
}

async function updateVideo(req, res) {
    try {
        const { title, description, category, tags } = req.body;
        const videoId = req.params.id;

        // Find video by ID
        const video = await videoModel.findById(videoId);
        if (!video) {
            return res.status(404).json({ error: "Video not found" });
        }
        console.log(req.user._id)
        console.log(video.user_id)
        // Check if the logged-in user is the owner
        if (video.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        // If a new thumbnail is uploaded
        if (req.files && req.files.thumbnail) {
            // Remove the old thumbnail from Cloudinary
            await cloudinary.uploader.destroy(video.thumbnailId);

            // Upload new thumbnail
            const thumbnailUpload = await cloudinary.uploader.upload(
                req.files.thumbnail.tempFilePath,
                {
                    folder: "thumbnail"
                }
            );

            video.thumbnailUrl = thumbnailUpload.secure_url;
            video.thumbnailId = thumbnailUpload.public_id;
        }

        // Update video fields
        video.title = title || video.title;
        video.description = description || video.description;
        video.category = category || video.category;
        video.tags = tags || video.tags;

        // Save updated video
        await video.save();

        res.status(200).json({
            message: "Video updated successfully",
            video
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: e.message });
    }
}

const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;

    const video = await videoModel.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    console.log()
    if (video.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Optional: Delete the thumbnail from Cloudinary
    await cloudinary.uploader.destroy(video.thumbnailId);

    // Delete the video from MongoDB
    await videoModel.findByIdAndDelete(videoId);

    return res.status(200).json({ message: "Video deleted successfully" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: e.message });
  }
};
const getVideo = async (req, res) => {
  try {
    const myVideos = await videoModel.find({ user_id: req.user._id });

    if (myVideos.length === 0) {
      return res.status(404).json({ message: "No videos found" });
    }

    res.status(200).json({
      message: "Videos fetched successfully",
      videos: myVideos
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
};

const getAllVideo = async (req, res) => {
  try {
    const videos = await videoModel.find();  // ✅ Remove 'new', add await

    res.status(200).json({                  // ✅ status(200), not status.json
      message: "All videos found",
      videos: videos                        // ✅ "videos", not "video"
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: e.message
    });
  }
};
 async function videobyId(req,res) {

   try {
    const videoId = req.params.id;
    const userId = req.user._id;

    // Use findByIdAndUpdate to add the user ID to the viewedBy array if not already present
    const video = await Video.findByIdAndUpdate(
      videoId,
      {
        $addToSet: { viewedBy: userId },  // Add user ID to viewedBy array, avoiding duplicates
      },
      { new: true }  // Return the updated video document
    );

    if (!video) return res.status(404).json({ error: "Video not found" });

    res.status(200).json(video);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
 }


 async function videobyTag(req,res) {
    try {
    const tag = req.params.tag;
    const videos = await Video.find({ tags: tag }).sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
  
 } 

 async function videobycategory(req,res) {
    try {
    const videos = await Video.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
  
 }


export {updateVideo,uploadVideo,deleteVideo,getVideo,getAllVideo,videobyId,videobyTag,videobycategory}