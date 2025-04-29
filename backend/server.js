import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudnary.js';
import adminRouter from './routes/adminRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
import userRouter from './routes/userRoute.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cookieParser from "cookie-parser"



//app config

const app = express();
const port = process.env.PORT || 4000;

connectDB();

connectCloudinary();



//middlewares

app.use(express.json());
app.use(cookieParser())
app.use(cors({credentials:true}));


//api end points

app.use('/api/admin',adminRouter)
//localhost:4000/api/admin/add-doctor
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
  res.send('API Working');
});

app.listen(port,()=>console.log('Server Started', port));
