import { transporter } from "./Email.confiq.js";
import { Verification_Email_Template, Welcome_Email_Template, Appointment_Confirmation_Template } from "./EmailTemplate.js";


export const sendVerificationEamil=async(email,verificationCode)=>{
    try {
     const response=   await transporter.sendMail({
            from: '"PhysioCare" <guptashivamsg02@gmail.com>',

            to: email, // list of receivers
            subject: "Verify your Email", // Subject line
            text: "Verify your Email", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}",verificationCode)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}
export const senWelcomeEmail=async(email,name)=>{
    try {
     const response=   await transporter.sendMail({
            from: '"PhysioCare" <guptashivamsg02@gmail.com>',

            to: email, // list of receivers
            subject: "Welcome Email", // Subject line
            text: "Welcome Email", // plain text body
            html: Welcome_Email_Template.replace("{name}",name)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}


// New function to send appointment confirmation email

// export const sendAppointmentConfirmationEmail = async(email, name, doctorName, date, time, patientId) => {
//     try {
//         // Fix for invalid date - ensure date is properly formatted
//         let formattedDate;
//         try {
//             // Try to parse the date string
//             formattedDate = new Date(date).toLocaleDateString('en-US', {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric'
//             });
            
//             // If the result is "Invalid Date", use a fallback format
//             if (formattedDate === "Invalid Date") {
//                 // Try to parse date in format YYYY-MM-DD
//                 const parts = date.split('-');
//                 if (parts.length === 3) {
//                     const parsedDate = new Date(parts[0], parts[1] - 1, parts[2]);
//                     formattedDate = parsedDate.toLocaleDateString('en-US', {
//                         weekday: 'long',
//                         year: 'numeric',
//                         month: 'long',
//                         day: 'numeric'
//                     });
//                 } else {
//                     formattedDate = date; // Use original string as fallback
//                 }
//             }
//         } catch (err) {
//             console.log('Date formatting error:', err);
//             formattedDate = date; // Use original string as fallback
//         }
        
//         // Create unique video call link based on doctor and patient
//         const videoCallLink = "https://meet.jit.si/Consultation__John%20Doe";
        
//         const htmlContent = `
//             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
//                 <div style="text-align: center; margin-bottom: 20px;">
//                     <h1 style="color: #4a90e2;">PhysioCare</h1>
//                     <p style="font-size: 18px; color: #333;">Appointment Confirmation</p>
//                 </div>
//                 <div style="margin-bottom: 20px;">
//                     <p>Hello ${name},</p>
//                     <p>Your appointment has been successfully booked with <strong>${doctorName}</strong>.</p>
//                     <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
//                         <p><strong>Date:</strong> ${formattedDate}</p>
//                         <p><strong>Time:</strong> ${time}</p>
//                     </div>
                    
//                     <div style="text-align: center; margin: 25px 0;">
//                         <p style="margin-bottom: 15px;"><strong>Join your video consultation at the scheduled time:</strong></p>
//                         <a href="${videoCallLink}" style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Join Video Call</a>
//                         <p style="margin-top: 10px; font-size: 12px; color: #666;">Or copy this link: <a href="${videoCallLink}" style="color: #4a90e2; word-break: break-all;">${videoCallLink}</a></p>
//                     </div>
                    
//                     <p>Please join the video call 5 minutes before your scheduled appointment time.</p>
//                     <p>If you need to reschedule or cancel your appointment, please do so at least 24 hours in advance.</p>
//                 </div>
                
//                 <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
//                     <h3 style="color: #333; margin-top: 0;">Preparing for Your Video Consultation:</h3>
//                     <ul style="padding-left: 20px; color: #555;">
//                         <li>Ensure you have a stable internet connection</li>
//                         <li>Find a quiet, well-lit private space</li>
//                         <li>Test your camera and microphone before the call</li>
//                         <li>Have a list of your symptoms or questions ready</li>
//                         <li>Keep any relevant medical records handy</li>
//                     </ul>
//                 </div>
                
//                 <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
//                     <p style="color: #777; font-size: 14px;">Thank you for choosing PhysioCare for your healthcare needs.</p>
//                     <p style="color: #777; font-size: 12px;">© ${new Date().getFullYear()} PhysioCare. All rights reserved.</p>
//                 </div>
//             </div>
//         `;
        
//         const response = await transporter.sendMail({
//             from: '"PhysioCare" <guptashivamsg02@gmail.com>',
//             to: email,
//             subject: "Your PhysioCare Appointment Confirmation",
//             text: `Your appointment with ${doctorName} on ${formattedDate} at ${time} has been confirmed. Join your video consultation at: ${videoCallLink}`,
//             html: htmlContent
//         });
        
//         console.log('Appointment confirmation email sent successfully', response);
//     } catch (error) {
//         console.log('Email error', error);
//     }
// }

export const sendAppointmentConfirmationEmail = async(email, name, doctorName, date, time, patientId) => {
    try {
        // Fix for invalid date - ensure date is properly formatted
        let formattedDate;
        try {
            // Try to parse the date string
            formattedDate = new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // If the result is "Invalid Date", use a fallback format
            if (formattedDate === "Invalid Date") {
                // Try to parse date in format YYYY-MM-DD
                const parts = date.split('-');
                if (parts.length === 3) {
                    const parsedDate = new Date(parts[0], parts[1] - 1, parts[2]);
                    formattedDate = parsedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                } else {
                    formattedDate = date; // Use original string as fallback
                }
            }
        } catch (err) {
            console.log('Date formatting error:', err);
            formattedDate = date; // Use original string as fallback
        }
        
        // Create unique video call link based on doctor and patient
        const videoCallLink = "https://meet.jit.si/Consultation__John%20Doe";
        
        // Replace placeholders in the template
        let htmlContent = Appointment_Confirmation_Template
            .replace(/{patientName}/g, name)
            .replace(/{doctorName}/g, doctorName)
            .replace(/{appointmentDate}/g, formattedDate)
            .replace(/{appointmentTime}/g, time)
            .replace(/{videoCallLink}/g, videoCallLink)
            .replace(/{currentYear}/g, new Date().getFullYear());
        
        const response = await transporter.sendMail({
            from: '"PhysioCare" <guptashivamsg02@gmail.com>',
            to: email,
            subject: "Your PhysioCare Appointment Confirmation",
            text: `Your appointment with ${doctorName} on ${formattedDate} at ${time} has been confirmed. Join your video consultation at: ${videoCallLink}`,
            html: htmlContent
        });
        
        console.log('Appointment confirmation email sent successfully', response);
    } catch (error) {
        console.log('Email error', error);
    }
}

