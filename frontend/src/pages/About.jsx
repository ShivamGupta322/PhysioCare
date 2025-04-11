// import React from 'react';
// import { assets } from '../assets/assets';

// const About = () => {
//   return (
//     <div>
//       {/* About Us Section */}
//       <div className="text-center text-3xl pt-0 text-gray-500">
//         <p>
//           ABOUT <span className="text-gray-700 font-medium">US</span>
//         </p>
//       </div>

//       <div className="my-10 flex flex-col md:flex-row gap-12">
//         <img
//           className="w-full md:max-w-[360px]"
//           src="https://static.wixstatic.com/media/077502_1e4de9bf9f684a5789da251c8d9bb272~mv2.png/v1/fill/w_324,h_326,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/our-services-1.png"
//           alt="Physiotherapy"
//         />
//         <div className="leading-6 text-justify flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
//           <p>
//             In a world that often prioritizes quick fixes and temporary relief, physiotherapy stands as a beacon of hope
//             for individuals seeking lasting health and well-being. Rapid access to musculoskeletal physiotherapy can
//             significantly reduce the downtime due to injuries and prevent acute issues from evolving into chronic,
//             long-lasting problems. Whether it's an injury, illness, or disability, physiotherapy aims to restore an
//             individual's movement and function. Embracing the power of physiotherapy can be the first step toward a
//             healthier, happier future.
//           </p>
//           <b className="text-gray-800">OUR SERVICES</b>
//           <p>
//             Our experienced physical therapists offer a comprehensive wide range of physical therapy services to help
//             and improve restore the function of our patients after injury, surgery, and illness.
//           </p>
//           <b className="text-gray-800">Our Vision</b>
//           <p>
//             Our vision at Prescripto is to create a seamless healthcare experience for every user. We aim to bridge the
//             gap between patients and healthcare providers, making it easier for you to access the care you need, when
//             you need it.
//           </p>
//         </div>
//       </div>

//       {/* Why Choose Us Section */}
//       <div className="text-4xl my-4 text-center">
//         <p>
//           Why <span className="text-gray-700 font-semibold">Choose Us</span>
//         </p>
//       </div>
//       <div>
//         <img
//           src="https://static.wixstatic.com/media/077502_295ebf60ac6e4cf2bbe370290bcc71d9~mv2.jpg/v1/fill/w_1899,h_545,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/077502_295ebf60ac6e4cf2bbe370290bcc71d9~mv2.jpg"
//           alt="Why Choose Us"
//         />
//       </div>
//       <div className="flex flex-col md:flex-row mb-20">
//         {[
//           {
//             title: 'Efficiency:',
//             description: 'Streamlined appointment scheduling that fits into your busy lifestyle.',
//           },
//           {
//             title: 'Convenience:',
//             description: 'Access to a network of trusted healthcare professionals in your area.',
//           },
//           {
//             title: 'Personalization:',
//             description: 'Tailored recommendations and reminders to help you stay on top of your health.',
//           },
//         ].map((item, index) => (
//           <div
//             key={index}
//             className="border px-10 md:px-16 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer"
//           >
//             <b>{item.title}</b>
//             <p>{item.description}</p>
//           </div>
//         ))}
//       </div>

//       {/* Developer Section */}
//       <div className="my-20">
//         <h2 className="text-center text-3xl font-semibold text-gray-800 mb-10">Meet the Developers</h2>
//         <div className="flex flex-wrap justify-center gap-10">
//           {[
//             {
//               name: 'Shivam Gupta',
//               role: 'Full Stack Developer',
//               image: assets.profile_pic,
//               link: 'https://www.linkedin.com/in/shivam-gupta-sg322/',
//             },
//             {
//               name: 'Robin Singh Yadav',
//               role: 'Python Developer',
//               image: assets.profile_pic,

//               link: 'https://www.linkedin.com/in/robinsinghyadav18/',
//             },
//             {
//               name: 'Anshu Gangwar',
//               role: 'Frontend Developer',
//               image: assets.profile_pic,

//               link: 'https://www.linkedin.com/in/anshu-gangwar-6a9872308/',
//             },
//             {
//               name: 'Sujal Gupta',
//               role: 'UI/UX Designer',
//               image: assets.profile_pic,

//               link: 'https://www.linkedin.com/in/sujal-gupta-6b7749223/',
//             },
//           ].map((dev, index) => (
//             <div
//             key={index}
//             className="group hover:scale-105 flex flex-col items-center text-center border p-6 rounded-lg shadow hover:shadow-lg hover:bg-primary hover:text-white transition-all duration-300"
//           >
//             <img
//               src={dev.image}
//               alt={dev.name}
//               className="w-24 h-24 rounded-full mb-4 border border-gray-200"
//             />
//             <h3 className="font-semibold">{dev.name}</h3>
//             <p className="text-sm mb-2">{dev.role}</p>
//             <a
//               href={dev.link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-blue-500 group-hover:text-black hover:underline"
//             >
//               View Profile
//             </a>
//           </div>
          
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default About;

import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div>
      {/* About Us Section */}
      <motion.div
        className="text-center text-3xl pt-0 text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </motion.div>

      <motion.div
        className="my-10 flex flex-col md:flex-row gap-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          className="w-full md:max-w-[360px]"
          src="https://static.wixstatic.com/media/077502_1e4de9bf9f684a5789da251c8d9bb272~mv2.png/v1/fill/w_324,h_326,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/our-services-1.png"
          alt="Physiotherapy"
        />
        <div className="leading-6 text-justify flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            In a world that often prioritizes quick fixes and temporary relief, physiotherapy stands as a beacon of hope
            for individuals seeking lasting health and well-being. Rapid access to musculoskeletal physiotherapy can
            significantly reduce the downtime due to injuries and prevent acute issues from evolving into chronic,
            long-lasting problems. Whether it's an injury, illness, or disability, physiotherapy aims to restore an
            individual's movement and function. Embracing the power of physiotherapy can be the first step toward a
            healthier, happier future.
          </p>
          <b className="text-gray-800">OUR SERVICES</b>
          <p>
            Our experienced physical therapists offer a comprehensive wide range of physical therapy services to help
            and improve restore the function of our patients after injury, surgery, and illness.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            Our vision at PhysioCare is to create a seamless healthcare experience for every user. We aim to bridge the
            gap between patients and healthcare providers, making it easier for you to access the care you need, when
            you need it.
          </p>
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        className="text-4xl my-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <p>
          Why <span className="text-gray-700 font-semibold">Choose Us</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <img
          src="https://static.wixstatic.com/media/077502_295ebf60ac6e4cf2bbe370290bcc71d9~mv2.jpg/v1/fill/w_1899,h_545,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/077502_295ebf60ac6e4cf2bbe370290bcc71d9~mv2.jpg"
          alt="Why Choose Us"
        />
      </motion.div>

      <motion.div
        className="flex flex-col md:flex-row mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {[{
            title: 'Efficiency:',
            description: 'Streamlined appointment scheduling that fits into your busy lifestyle.',
          },
          {
            title: 'Convenience:',
            description: 'Access to a network of trusted healthcare professionals in your area.',
          },
          {
            title: 'Personalization:',
            description: 'Tailored recommendations and reminders to help you stay on top of your health.',
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="border px-10 md:px-16 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: index * 0.5 }}
          >
            <b>{item.title}</b>
            <p>{item.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Developer Section */}
      <motion.div
        className="my-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-10">Meet the Developers</h2>
        <div className="flex flex-wrap justify-center gap-10">
          {[{
              name: 'Shivam Gupta',
              role: 'Full Stack Developer',
              image: assets.profile_pic,
              link: 'https://www.linkedin.com/in/shivam-gupta-sg322/',
            },
            {
              name: 'Robin Singh Yadav',
              role: 'Python Developer',
              image: assets.profile_pic,
              link: 'https://www.linkedin.com/in/robinsinghyadav18/',
            },
            {
              name: 'Anshu Gangwar',
              role: 'Frontend Developer',
              image: assets.profile_pic,
              link: 'https://www.linkedin.com/in/anshu-gangwar-6a9872308/',
            },
            {
              name: 'Sujal Gupta',
              role: 'UI/UX Designer',
              image: assets.profile_pic,
              link: 'https://www.linkedin.com/in/sujal-gupta-6b7749223/',
            },
          ].map((dev, index) => (
            <motion.div
              key={index}
              className="group hover:scale-105 flex flex-col items-center text-center border p-6 rounded-lg shadow hover:shadow-lg hover:bg-primary hover:text-white transition-all duration-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, delay: index * 0.5 }}
            >
              <img
                src={dev.image}
                alt={dev.name}
                className="w-24 h-24 rounded-full mb-4 border border-gray-200"
              />
              <h3 className="font-semibold">{dev.name}</h3>
              <p className="text-sm mb-2">{dev.role}</p>
              <a
                href={dev.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 group-hover:text-black hover:underline"
              >
                View Profile
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default About;
