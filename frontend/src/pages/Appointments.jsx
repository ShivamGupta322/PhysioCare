import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import Review from '../components/Review'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointments = () => {
  const {docId}=useParams()
  const {doctors, currencySymbol, backendUrl, token, getDoctorsData, userData} = useContext(AppContext)
  const daysofWeek =['SUN','MON','TUE','WED','THU','FRI','SAT']

  const navigate= useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndes, setSlotIndes] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [showReviewForm, setShowReviewForm] = useState(false)

  const fetchDocInfo = async() => {
      const docInfo = doctors.find(doc => doc._id === docId)
      
      // Fetch reviews for this doctor
      try {
        // Fix the URL by adding the missing /api/ prefix
        const { data } = await axios.get(`${backendUrl}/api/reviews/doctor/${docId}`)
        console.log("Reviews data:", data); // Add this to debug
        if (data.success) {
          // Add reviews to doctor info with proper user names
          const reviewsWithUserNames = data.reviews.map(review => {
            // If the review already has a userName, use it
            // Otherwise, try to use the user's name from the review's userId if it matches the current user
            if (!review.userName && review.userId === userData?._id) {
              return {
                ...review,
                userName: userData.name || "Anonymous User"
              };
            }
            return review;
          });
          
          console.log("Reviews with user names:", reviewsWithUserNames); // Add this to debug
          
          setDocInfo({
            ...docInfo,
            reviews: reviewsWithUserNames
          });
        } else {
          setDocInfo({
            ...docInfo,
            reviews: []
          });
        }
      } catch (error) {
        console.error("Error fetching doctor reviews:", error);
        setDocInfo({
          ...docInfo,
          reviews: []
        });
      }
    }
  

  const getAvailableSlots = async()=>{
    setDocSlots([])


    //getting current date
    let today = new Date()

    for(let i=0;i<7;i++){
      //getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      // setting end times of the date with index
      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21,0,0,0) 

      //setting hours
      if(today.getDate()===currentDate.getDate()){
        currentDate.setHours(currentDate.getHours()> 10 ? currentDate.getHours()+1 :10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 :0)
      }
      else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots=[]

      while(currentDate < endTime){
        let formattedTime=currentDate.toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})

        let day= currentDate.getDate()
        let month= currentDate.getMonth()+1
        let year= currentDate.getFullYear()

        const slotDate= day + "_" + month + "_" + year
        const slotTime=formattedTime
        //check if slot is available
        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if(isSlotAvailable ){
          //add slot to array
        timeSlots.push({
          datetime:new Date(currentDate),
        time: formattedTime
        })
        }

        

        //increment current date by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30)
        
      }
      
      setDocSlots(prev=>([...prev,timeSlots]))
    }
  }


  const bookAppointment = async()=>{
    if(!token){
      toast.warn('Login to book Appointment')
      return navigate('/login')
    }

    try{

      const date = docSlots[slotIndes][0].datetime

      let day = date.getDate()
      let month = date.getMonth()+1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year
      
      const {data} = await axios.post(backendUrl + '/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})

      if(data.success){
        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')
      }
      else{
        toast.error(data.message)
      }

      
    }
    catch(error){
      toast.error(error.message) 
      console.error(error)
    }
  }


  useEffect(()=>{
    fetchDocInfo()
  },[doctors,docId])

  useEffect(()=>{
getAvailableSlots()
  },[docInfo])

  useEffect(()=>{
    console.log(docSlots)
  },[docSlots])


  return docInfo && (
    <div>
      {/*---------------Doctor Details------------- */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[80px] sm:mt-0'>
          {/*---------------Doc inf,name,degree, experience-----*/}
          <p className='flex items-center gap-2 text-2xl font-mwdium text-gray-900'>
            {docInfo.name}
             <img className='w-5' src={assets.verified_icon} alt="" />
             </p>
             <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
             </div>

             {/*-----Doctor about -----*/}
             <div>
              <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" /></p>
              <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
             </div>
              <p className='text-gray-500 font-medium mt-4'>Appointment Fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>
      {/*--------Booking Slot-------- */}

      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
          <p>Booking Slot</p>
          <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
            {
              docSlots.length && docSlots.map((item,index)=>(
                <div onClick={()=>setSlotIndes(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndes === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                  <p>{item[0] && daysofWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>

          <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
            {docSlots.length && docSlots[slotIndes].map((item,index)=>(
              <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                {item.time.toLowerCase()}
              </p>
            ))}
          </div>
          <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>
      </div>

      {/* Doctor Reviews Section */}
      <div className="mt-8 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800">
            Patient Reviews 
            {docInfo.reviews && (
              <span className="ml-2 text-sm bg-gray-100 text-gray-700 py-1 px-2 rounded-full">
                {docInfo.reviews.length} {docInfo.reviews.length === 1 ? 'review' : 'reviews'}
              </span>
            )}
          </h2>
        </div>
        
        <div className="mb-6 bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
          <p>
            <strong>Note:</strong> To maintain authenticity, you can only write a review after completing an appointment with this doctor. 
            Please visit the "My Appointments" page to leave your feedback for completed appointments.
          </p>
        </div>
        
        <div className="reviews-container">
          {docInfo.reviews && docInfo.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docInfo.reviews.map((review, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                        {review.userName ? review.userName.charAt(0) : "U"}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-800">{review.userName || "Anonymous User"}</p>
                        <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  {review.reviewText && (
                    <p className="text-gray-600 text-sm mt-2">{review.reviewText}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-500">No reviews yet. This doctor hasn't received any reviews from patients.</p>
            </div>
          )}
        </div>
      </div>

      {/*----listing related doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
    </div>
  )
}

export default Appointments