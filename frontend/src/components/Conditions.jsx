import React from 'react';
import Slider from 'react-slick';
import { Spline as Spine, Dumbbell, Syringe, Brain, Bone, Heart } from 'lucide-react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ConditionCard = ({ icon, title, description, backgroundImage }) => (
  <div 
    className="flex-shrink-0 w-full h-[400px] relative mx-3 rounded-xl overflow-hidden"
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/40 flex items-center">
      <div className="p-8 max-w-lg">
        <div className="text-white mb-6 bg-blue-600/20 p-4 rounded-full inline-block">{icon}</div>
        <h3 className="text-3xl font-bold text-white mb-4">{title}</h3>
        <p className="text-white/90 text-lg leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const conditions = [
  {
    icon: <Spine className="w-16 h-16" />,
    title: 'Back Pain Treatment',
    description: 'Expert treatment for acute and chronic back pain, focusing on posture and strengthening exercises. Our specialized approach helps you regain mobility and live pain-free.',
    backgroundImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80',
  },
  {
    icon: <Dumbbell className="w-16 h-16" />,
    title: 'Sports Injury Recovery',
    description: 'Specialized rehabilitation for athletes and sports enthusiasts. Our proven methods help you recover faster and return to your peak performance safely.',
    backgroundImage: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80',
  },
  {
    icon: <Syringe className="w-16 h-16" />,
    title: 'Post-surgical Care',
    description: 'Comprehensive rehabilitation programs designed to optimize your recovery after surgery. We guide you through each step of your healing journey.',
    backgroundImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80',
  },
  {
    icon: <Brain className="w-16 h-16" />,
    title: 'Neck Pain Solutions',
    description: 'Advanced treatment for neck strain, tech neck, and cervical conditions. Our expertise helps you overcome pain and prevent future issues.',
    backgroundImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80',
  },
  {
    icon: <Bone className="w-16 h-16" />,
    title: 'Joint Pain Relief',
    description: 'Effective treatments for arthritis, joint stiffness, and inflammatory conditions. We focus on improving your mobility and quality of life.',
    backgroundImage: 'https://images.unsplash.com/photo-1571019613531-fbeaeb5d5637?auto=format&fit=crop&q=80',
  },
  {
    icon: <Heart className="w-16 h-16" />,
    title: 'Chronic Condition Care',
    description: 'Personalized management strategies for ongoing conditions. Our holistic approach helps you maintain optimal health and well-being.',
    backgroundImage: 'https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&q=80',
  },
];

export const Conditions = () => {
  // Custom prev/next arrows
  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <button 
        onClick={onClick} 
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <path d="m15 18-6-6 6-6"/>
        </svg>
      </button>
    );
  };
  
  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <button 
        onClick={onClick} 
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <path d="m9 18 6-6-6-6"/>
        </svg>
      </button>
    );
  };

  // Settings for react-slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    // Use a completely custom dots class to avoid conflicts
    dotsClass: "slick-dots custom-dots-container",
    appendDots: dots => (
      <div className="custom-dots-wrapper">
        <ul className="flex justify-center items-center gap-2 mt-4"> 
          {dots} 
        </ul>
      </div>
    ),
    customPaging: i => (
      <button
        className="w-3 h-3 bg-slate-300 rounded-full transition-all duration-300 hover:bg-blue-400 focus:outline-none"
        aria-label={`Go to slide ${i + 1}`}
      />
    )
  };

  return (
    <div className="mb-16">
      <h2 className="text-4xl font-bold text-gray-900 text-center mb-8">
        Conditions We Treat
      </h2>
      <div className="relative max-w-6xl mx-auto">
        <Slider {...settings}>
          {conditions.map((condition, index) => (
            <div key={index} className="px-3">
              <ConditionCard
                icon={condition.icon}
                title={condition.title}
                description={condition.description}
                backgroundImage={condition.backgroundImage}
              />
            </div>
          ))}
        </Slider>
      </div>
      
      {/* Add custom styling for active dots and hide any default dots */}
      <style jsx global>{`
        /* Style for active dots */
        .custom-dots-container li.slick-active button {
          background-color: #2563eb !important; /* blue-600 */
          width: 24px !important;
          border-radius: 9999px !important;
        }
        
        /* Hide any default dots that might be showing */
        .slick-dots:not(.custom-dots-container) {
          display: none !important;
        }
        
        /* Ensure our custom dots container is properly positioned */
        .custom-dots-container {
          position: relative !important;
          bottom: 0 !important;
          margin-top: 16px !important;
        }
      `}</style>
    </div>
  );
};