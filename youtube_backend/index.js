import express from 'express';
import dotenv from 'dotenv';
import connectDB from './Config/db.js';
import userRoutes from './routes/user.routes.js'
import videoRoutes from './routes/video.routes.js';
import fileUpload from 'express-fileupload';
dotenv.config();
const app = express();
 
connectDB();


app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use('/api/user', userRoutes);
app.use('/api/video', videoRoutes);
app.get('/',(req,res)=>{
    console.log('Request received');
    res.send('Hello from YouTube Backend');
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});