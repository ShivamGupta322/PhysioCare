import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'framer-motion';  // Import motion from framer-motion

const Doctors = () => {
  const {speciality}=useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate=useNavigate()
  
  // New state for filters
  const [priceFilter, setPriceFilter] = useState('all') // all, low, medium, high
  const [reviewFilter, setReviewFilter] = useState(0) // minimum number of reviews
  const [ratingFilter, setRatingFilter] = useState(0) // minimum rating
  
  const {doctors, currencySymbol}=useContext(AppContext)

  const applyFilter=()=>{
    let filtered = [...doctors]
    
    // Apply speciality filter
    if(speciality){
      filtered = filtered.filter(doc => doc.speciality===speciality)
    }
    
    // Apply price filter
    if(priceFilter === 'low') {
      filtered = filtered.filter(doc => doc.fees <= 50)
    } else if(priceFilter === 'medium') {
      filtered = filtered.filter(doc => doc.fees > 50 && doc.fees <= 100)
    } else if(priceFilter === 'high') {
      filtered = filtered.filter(doc => doc.fees > 100)
    }
    
    // Apply reviews filter
    if(reviewFilter > 0) {
      filtered = filtered.filter(doc => (doc.reviews?.length || 0) >= reviewFilter)
    }
    
    // Apply rating filter
    if(ratingFilter > 0) {
      filtered = filtered.filter(doc => doc.avgRating >= ratingFilter)
    }
    
    setFilterDoc(filtered)
  }

  useEffect(()=>{
    applyFilter()
  },[doctors, speciality, priceFilter, reviewFilter, ratingFilter])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
    <div>
      <p className='text-gray-600'>Browse through the Therapist's Speciality.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={()=>{setShowFilter(prev=>!prev)}}>Filters</button>
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={()=>speciality==='Posture Correction Exercises' ? navigate('/doctors') : navigate('/doctors/Posture Correction Exercises')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Posture Correction Exercises" ? "bg-indigo-100 text-black" : ""}`}>Posture Correction Exercises</p>
          <p onClick={()=>speciality==='Mobility Exercises' ? navigate('/doctors') : navigate('/doctors/Mobility Exercises')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Mobility Exercises" ? "bg-indigo-100 text-black" : ""}`}>Mobility Exercises</p>
          <p onClick={()=>speciality==='Balance and Coordination Exercises' ? navigate('/doctors') : navigate('/doctors/Balance and Coordination Exercises')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Balance and Coordination Exercises" ? "bg-indigo-100 text-black" : ""}`}>Balance and Coordination Exercises</p>
          <p onClick={()=>speciality==='Strengthening Exercise' ? navigate('/doctors') : navigate('/doctors/Strengthening Exercise')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Strengthening Exercise" ? "bg-indigo-100 text-black" : ""}`}>Strengthening Exercise</p>
          <p onClick={()=>speciality==='Stretching Exercises' ? navigate('/doctors') : navigate('/doctors/Stretching Exercises')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Stretching Exercises" ? "bg-indigo-100 text-black" : ""}`}>Stretching Exercises</p>
          <p onClick={()=>speciality==='Core Stability Exercises' ? navigate('/doctors') : navigate('/doctors/Core Stability Exercises')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === "Core Stability Exercises" ? "bg-indigo-100 text-black" : ""}`}>Core Stability Exercises</p>
          
          {/* Price Filter */}
          <div className="mt-4 border border-gray-300 rounded p-3 w-[94vw] sm:w-auto">
            <p className="font-medium mb-2">Price Range</p>
            <div className="flex gap-2">
              <button 
                onClick={() => setPriceFilter('all')}
                className={`px-3 py-1 rounded ${priceFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              >
                All
              </button>
              <button 
                onClick={() => setPriceFilter('low')}
                className={`px-3 py-1 rounded ${priceFilter === 'low' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              >
                {currencySymbol}0-50
              </button>
              <button 
                onClick={() => setPriceFilter('medium')}
                className={`px-3 py-1 rounded ${priceFilter === 'medium' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              >
                {currencySymbol}51-100
              </button>
              <button 
                onClick={() => setPriceFilter('high')}
                className={`px-3 py-1 rounded ${priceFilter === 'high' ? 'bg-primary text-white' : 'bg-gray-100'}`}
              >
                {currencySymbol}100+
              </button>
            </div>
          </div>
          
          {/* Reviews Filter */}
          <div className="border border-gray-300 rounded p-3 w-[94vw] sm:w-auto">
            <p className="font-medium mb-2">Minimum Reviews</p>
            <div className="flex gap-2">
              {[0, 5, 10, 15, 20].map(num => (
                <button 
                  key={num} 
                  onClick={() => setReviewFilter(num)}
                  className={`px-2 py-1 rounded ${reviewFilter === num ? 'bg-primary text-white' : 'bg-gray-100'}`}
                >
                  {num}+
                </button>
              ))}
            </div>
          </div>
          
          {/* Rating Filter */}
          <div className="border border-gray-300 rounded p-3 w-[94vw] sm:w-auto">
            <p className="font-medium mb-2">Minimum Rating</p>
            <div className="flex gap-2">
              {[0, 3, 3.5, 4, 4.5].map(num => (
                <button 
                  key={num} 
                  onClick={() => setRatingFilter(num)}
                  className={`px-2 py-1 rounded flex items-center ${ratingFilter === num ? 'bg-primary text-white' : 'bg-gray-100'}`}
                >
                  {num}+ <span className="ml-1 text-yellow-400">★</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      
        <div className='w-full'>
          {filterDoc.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 gap-y-6'>
              {
                filterDoc.map((item,index)=>(
                  <div onClick={()=>navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index}>
                    <img className='bg-blue-50 w-full h-48 object-cover' src={item.image} alt="" />
                    <div className='p-4'>
                      <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-500' : 'text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                        <p>{item.available ? 'Available' : 'Not Available'}</p>
                      </div>
                      <p className='text-gray-900 text-lg font-medium'>{item.name}</p>
                      <p className='text-gray-600 text-sm'>{item.speciality}</p>
                      <div className="flex justify-between items-center mt-2">
                        <p className='text-primary font-medium'>{currencySymbol}{item.fees}</p>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">★</span>
                            <span className="text-gray-700 text-sm">{item.avgRating || 0}</span>
                          </div>
                          <p className='text-gray-500 text-xs'>{item.reviews?.length || 0} reviews</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          ) : (
            <div className="bg-blue-50 p-8 rounded-lg text-center mt-4">
              <h3 className="text-xl font-medium text-gray-800 mb-2">No therapists found</h3>
              <p className="text-gray-600">
                No therapists match your current filter criteria. Please try adjusting your filters to see more options.
              </p>
              <button 
                onClick={() => {
                  setPriceFilter('all');
                  setReviewFilter(0);
                  setRatingFilter(0);
                  if(speciality) navigate('/doctors');
                }} 
                className="mt-4 bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </motion.div>
  )
}

export default Doctors