import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import razorpay from 'razorpay'
import { generateTokenAndSetCookies } from "../middlewares/GenerateToken.js"
import { sendVerificationEamil, senWelcomeEmail, sendAppointmentConfirmationEmail } from "../middlewares/Email.js"





//API to register User
/*
const registerUser = async(req,res)=>{
    try{
        const {name,email,password,phone}=req.body

        if(!name || !email || !password){
            return res.json({success:false,message:"Missing Details"})
        }
        // validating email format
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Please Enter a valid email"})
        }
        //validating lenght of password
        if(password.length<8){
            return res.json({success:false,message:"Password should be at least 8 characters long"})
        }
        //Phone number
        if (!/^\+\d+$/.test(phone)) {
            return res.json({ success: false, message: "Please provide a valid phone number with country code" });
          }
          
          const existingUser = await userModel.findOne({email});
            if (existingUser) {
            res.json({success:false,message: "User Already exists"})
        }


        //hashing user password
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const userData = {
            name,email,password:hashedPassword,phone
        }
        //saving user data to the database
        const newUser = new userModel(userData)
        const user = await newUser.save()
        
        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
       res.json({success:true,token})


    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})  
    }
}
    
*/


const registerUser = async (req, res) => {
    try {
        const {email,password,name}=req.body
        if (!email || !password || !name) {
            return res.status(400).json({success:false,message:"All fields are required"})
        }
        const ExistsUser= await userModel.findOne({email})
        if (ExistsUser) {
            return res.status(400).json({success:false,message:"User Already Exists Please Login"})
            
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)
        const verficationToken= Math.floor(100000 + Math.random() * 900000).toString()
        const user= new userModel({
            email,
            password:hashedPassword,
            name,
            verficationToken,
            verficationTokenExpiresAt:Date.now() + 24 * 60 * 60 * 1000
        })
        await user.save()
       generateTokenAndSetCookies(res,user._id)
       await sendVerificationEamil(user.email,verficationToken)
        return res.status(200).json({success:true,message:"User Register Successfully",user})

    } catch (error) {
        console.log(error)
        return res.status(400).json({success:false,message:"internal server error"})
        
    }
  };
  

  const VerifyEmail = async (req, res) => {
    try {
        const {code}=req.body 
        const user= await userModel.findOne({
            verficationToken:code,
            verficationTokenExpiresAt:{$gt:Date.now()}
        })
        if (!user) {
            return res.status(400).json({success:false,message:"Inavlid or Expired Code"})
                
            }
          
     user.isVerified=true;
     user.verficationToken=undefined;
     user.verficationTokenExpiresAt=undefined;
     await user.save()
     await senWelcomeEmail(user.email,user.name)
     return res.status(200).json({success:true,message:"Email Verifed Successfully"})
           
    } catch (error) {
        console.log(error)
        return res.status(400).json({success:false,message:"internal server error"})
    }
}

//API to login User

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User Not Found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            return res.json({ success: true, token }); // Ensure return here
        }

        // If password does not match
        return res.json({ success: false, message: "Invalid Credentials" });

    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};


//API to get user profile data

const getProfile = async(req,res)=>{
    try{
        const {userId} = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({success:true,userData})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to update user profile data

const updateProfile = async(req,res)=>{
    try{
        const {userId,name,phone,address,dob,gender}=req.body
        const imageFile= req.file

        if(!name ||!dob ||!gender || !phone){
            return res.json({success:false,message:"Missing Details"})
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

        if(imageFile){
            //upload image to cloudinary
            const imageUpload=await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
            const imageURL=imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }
        res.json({success:true,message:'Profile updated successfully'})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to book Appointment

const bookAppointment = async(req,res)=>{
    try{
        const {userId,docId,slotDate,slotTime}=req.body

        const docData = await doctorModel.findById(docId).select('-password')

        if(!docData.available){
            return res.json({success:false,message:"Doctor is not available at this time"})
        }

        let slots_booked = docData.slots_booked

        if (typeof slots_booked !== 'object' || slots_booked === null) {
            slots_booked = {}; // Reset to an empty object if it's not already an object
        }

        //checking for slots availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success:false,message:"Slot is already booked"})
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate]=[]
            slots_booked[slotDate].push(slotTime)
        }
        
        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            slotDate,
            slotTime,
            docData,
            userData,
            amount:docData.fees,
            date: Date.now()
        }
        
        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        //save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        
        // Send confirmation email to the user
        if (userData.email) {
            await sendAppointmentConfirmationEmail(
                userData.email,
                userData.name,
                docData.name,
                slotDate,
                slotTime,
                userId,
            );
        }
        
        res.json({success:true,message:'Appointment Booked Successfully'})
        
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to get user appointment for frontend

const listAppointment = async(req,res)=>{
    try{
        const {userId}=req.body

        const appointments = await appointmentModel.find({userId})


        res.json({success:true,appointments})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

//API to cancel appointment
const cancelAppointment = async(req,res)=>{
    try{
        const {userId,appointmentId}= req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        //Verify appointment user
        if(appointmentData.userId!== userId){
            return res.json({success:false,message:"You are not authorized to cancel this appointment"})
        }
        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})

        //Releasing doctor slot

        const {docId,slotDate,slotTime}=appointmentData
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate]= slots_booked[slotDate].filter(e=>e!==slotTime)

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})
        
        res.json({success:true,message:'Appointment Cancelled Successfully'})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

// API to make payment of appointment using RazorPay

const razorpayInstance = new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET
})

const paymentRazorPay = async(req,res)=>{

    try{
        const {appointmentId}=req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(!appointmentData || appointmentData.cancelled){
            return res.json({success:false,message:"Appointment calncelled or Not Found"})
        }

        //Creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100, // amount in the smallest currency unit (paise)
            currency: process.env.CURRENCY,
            receipt: appointmentId,
            
        }

        // creation of an order
        const order = await razorpayInstance.orders.create(options)
        
        res.json({success:true,order})
    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
    
}

//API to verify payment of RazorPay

const verifyRazorPay = async(req,res)=>{

    try{
        const {razorpay_order_id}=req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        
        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:'Payment Successful'})
        }
  
        else{
            res.json({success:false,message:'Payment Failed'})
        }

       

    }
    catch(error){
        console.log(error)
        res.json({success:false,message:error.message})
    }
    
}

export {registerUser,VerifyEmail,loginUser, getProfile, updateProfile, bookAppointment, listAppointment,cancelAppointment,paymentRazorPay,verifyRazorPay} 