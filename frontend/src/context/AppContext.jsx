import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import {toast} from 'react-toastify';

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const currencySymbol = '₹'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)
    const [reviews, setReviews] = useState([])
   
    const getDoctorsData = async ()=>{
        try {
            const {data}= await axios.get(backendUrl + '/api/doctor/list')
            if(data.success){
                // Fetch reviews for each doctor and add them to the doctor object
                const doctorsWithReviews = await Promise.all(
                    data.doctors.map(async (doctor) => {
                        try {
                            const reviewsData = await axios.get(`${backendUrl}/api/reviews/doctor/${doctor._id}`)
                            if (reviewsData.data.success) {
                                const reviews = reviewsData.data.reviews;
                                // Calculate average rating
                                const avgRating = reviews.length > 0 
                                    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
                                    : 0;
                                
                                return {
                                    ...doctor,
                                    reviews: reviews,
                                    avgRating: parseFloat(avgRating.toFixed(1)) // Round to 1 decimal place
                                }
                            }
                            return {
                                ...doctor,
                                reviews: [],
                                avgRating: 0
                            }
                        } catch (error) {
                            console.error(`Error fetching reviews for doctor ${doctor._id}:`, error)
                            return {
                                ...doctor,
                                reviews: [],
                                avgRating: 0
                            }
                        }
                    })
                )
                setDoctors(doctorsWithReviews)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.message)
        }
    }

    const loadUserProfileData = async()=>{
        try {
            const {data}= await axios.get(backendUrl + '/api/user/get-profile',{headers:{token}})
            if(data.success){
                setUserData(data.userData)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            console.log(error)
            toast.error(error.message)
        }
    }

    // New function to fetch doctor reviews
    const getDoctorReviews = async (doctorId) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/reviews/doctor/${doctorId}`)
            if (data.success) {
                return data.reviews;
            } else {
                toast.error(data.message)
                return [];
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return [];
        }
    }

    // New function to fetch user's reviews
    const getUserReviews = async () => {
        if (!token) return [];
        
        try {
            const { data } = await axios.get(`${backendUrl}/api/reviews/user`, {
                headers: { token }
            })
            if (data.success) {
                setReviews(data.reviews)
                return data.reviews;
            } else {
                toast.error(data.message)
                return [];
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            return [];
        }
    }

    const value = {
        doctors, getDoctorsData,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData,
        getDoctorReviews,
        getUserReviews,
        reviews
    }

    useEffect(()=>{
        getDoctorsData();
    },[])

    useEffect(()=>{
        if(token){
            
            loadUserProfileData()
        }
        else{
            setUserData(false)
        }
    },[token])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;