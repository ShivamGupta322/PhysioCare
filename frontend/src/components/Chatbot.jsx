
// import { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import ReactMarkdown from "react-markdown";
// // import "../components/Chatbot.css"
// import "../components/Chatbot"





// const Chatbot = ({ isVisible, onClose }) => {
//   const [chatHistory, setChatHistory] = useState([]);
//   const [question, setQuestion] = useState("");
//   const [generatingAnswer, setGeneratingAnswer] = useState(false);

//   const chatContainerRef = useRef(null);

//   useEffect(() => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [chatHistory, generatingAnswer]);

//   async function generateAnswer(e) {
//     e.preventDefault();
//     if (!question.trim()) return;

//     // Expanded list of topics, greetings, and farewells
//     const allowedTopics = [
//         "health", "physiotherapy", "balanced diet", "exercise", "therapy", 
//         "injury", "rehabilitation", "posture", "doctor", "consultation",
//     ];
//     const greetings = ["hi", "hey", "hello", "good morning", "good afternoon", "good evening", "hii", "hiii", "hoy"];
//     const farewells = ["bye", "goodbye", "see you", "talk to you later", "bye bye", "good bye", "see ya"];
    

//     // Check if the question is a greeting
//     const isGreeting = greetings.some((greeting) => 
//         question.toLowerCase().trim() === greeting || 
//         question.toLowerCase().startsWith(greeting + " ")
//     );

//     // Check if the question is a farewell
//     const isFarewell = farewells.some((farewell) => 
//         question.toLowerCase().trim() === farewell || 
//         question.toLowerCase().startsWith(farewell + " ")
//     );

//     // Check if the question is about allowed topics
//     const isRelevant = allowedTopics.some((topic) => 
//         question.toLowerCase().includes(topic)
//     );

//     // Handle greetings
//     if (isGreeting) {
//       const greetingResponses = [
//         "Hello! How can I help you today with health or physiotherapy-related questions?",
//         "Hi there! I'm here to assist you with any health or physiotherapy inquiries.",
//         "Good day! What health-related question can I help you with?",
//         "Welcome! I'm ready to provide information about health and physiotherapy."
//       ];
      
//       const randomGreetingResponse = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
      
//       setChatHistory((prev) => [
//         ...prev,
//         { type: "question", content: question },
//         { type: "answer", content: randomGreetingResponse },
//       ]);
//       setQuestion("");
//       return;
//     }
//     //doctor
   
    

//     // Handle farewells
//     if (isFarewell) {
//       const farewellResponses = [
//         "Goodbye! Take care of your health and feel free to return if you have any questions.",
//         "Bye! Wishing you good health and hope to assist you again soon.",
//         "See you later! Stay healthy and don't hesitate to reach out if you need help.",
//         "Farewell! Remember, maintaining your health is a journey, and I'm here to support you."
//       ];
      
//       const randomFarewellResponse = farewellResponses[Math.floor(Math.random() * farewellResponses.length)];
      
//       setChatHistory((prev) => [
//         ...prev,
//         { type: "question", content: question },
//         { type: "answer", content: randomFarewellResponse },
//       ]);
//       setQuestion("");
//       return;
//     }

//     // Existing topic relevance check
//     if (!isRelevant) {
//       setChatHistory((prev) => [
//         ...prev,
//         { type: "question", content: question },
//         { type: "answer", content: "I'm sorry, I can only answer questions related to health or physiotherapy. Please ask a question in these domains!" },
//       ]);
//       setQuestion("");
//       return;
//     }

//     setGeneratingAnswer(true);
//     const currentQuestion = question;
//     setQuestion("");

//     setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }]);

//     try {
//       const response = await axios({
//         url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,

//         method: "post",
//         data: {
//           contents: [{ parts: [{ text: currentQuestion }] }],
//         },
//       });

//       const aiResponse = response.data.candidates[0].content.parts[0].text; // Adjust if necessary
//       setChatHistory((prev) => [...prev, { type: "answer", content: aiResponse }]);
//     } catch (error) {
//       setChatHistory((prev) => [
//         ...prev,
//         { type: "answer", content: "Sorry - Something went wrong. Please try again!" },
//       ]);
//     } finally {
//       setGeneratingAnswer(false);
//     }
//   }

//   return (
//     <div
//       className={`fixed bottom-0 right-4 w-80 h-[70vh] bg-white shadow-lg rounded-lg transition-transform transform ${
//         isVisible ? "translate-y-0" : "translate-y-[100%]"
//       }`}
//     >
//       {/* Chat Header */}
//       <header className="bg-blue-500 text-white p-3 flex justify-between items-center rounded-t-lg">
//         <h3 className="text-lg font-bold"> PhysioCare Chatbot 🤖</h3>
//         <button onClick={onClose} className="text-white font-bold">
//           X
//         </button>
//       </header>
  
//       {/* Chat Content */}
//       <div className="flex flex-col h-full">
//         {/* Scrollable Chat History */}
//         <div
//           ref={chatContainerRef}
//           className="flex-1 p-4 overflow-y-auto bg-gray-50 hide-scrollbar"
//         >
//           {chatHistory.length === 0 ? (
//             <div className="h-full flex flex-col items-center justify-center text-center p-6">
//               <div className="bg-blue-50 rounded-xl p-8 max-w-2xl">
//                 <h2 className="text-2xl font-bold text-blue-600 mb-4">
//                   Welcome to PhysioCare ChatBot! 👋
//                 </h2>
//                 <p className="text-gray-600 mb-4">
//                   I'm here to help you with anything you'd like to know. You can ask me about:
//                 </p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
//                   <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <span className="text-blue-500">👨‍⚕️</span> Physio Therapy
//                   </div>
//                   <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <span className="text-blue-500">🩺</span> Health
//                   </div>
//                   <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <span className="text-blue-500">🏋🏽</span> Sports Injury
//                   </div>
//                   <div className="bg-white p-4 rounded-lg shadow-sm">
//                     <span className="text-blue-500">🧘</span> Posture correction
//                   </div>
//                 </div>
//                 <p className="text-gray-500 mt-6 text-sm">
//                   Just type your question below and press Enter or click Send!
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <>
//               {chatHistory.map((chat, index) => (
//                 <div
//                   key={index}
//                   className={`mb-4 ${
//                     chat.type === "question" ? "text-right" : "text-left"
//                   }`}
//                 >
//                   <div
//                     className={`inline-block max-w-[80%] p-3 rounded-lg overflow-auto hide-scrollbar ${
//                       chat.type === "question"
//                         ? "bg-blue-500 text-white rounded-br-none"
//                         : "bg-gray-100 text-gray-800 rounded-bl-none"
//                     }`}
//                   >
//                     <ReactMarkdown className="overflow-auto hide-scrollbar">
//                       {chat.content}
//                     </ReactMarkdown>
//                   </div>
//                 </div>
//               ))}
//             </>
//           )}
//           {generatingAnswer && (
//             <div className="text-left">
//               <div className="inline-block bg-gray-100 p-3 rounded-lg animate-pulse">
//                 Thinking 💭...
//               </div>
//             </div>
//           )}
//         </div>
  
//         {/* Fixed Input Form */}
//         <form
//           onSubmit={generateAnswer}
//           className="bg-white rounded-b-lg shadow-lg p-4 border-t"
//         >
//           <div className="flex gap-2">
//             <textarea
//               required
//               className="flex-1 border mb-20 border-gray-300 rounded p-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
//               value={question}
//               onChange={(e) => setQuestion(e.target.value)}
//               placeholder="Ask anything..."
//               rows="2"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && !e.shiftKey) {
//                   e.preventDefault();
//                   generateAnswer(e);
//                 }
//               }}
//             ></textarea>
//             <button
//               type="submit"
//               className={`px-6 py-2 mb-20 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${
//                 generatingAnswer ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={generatingAnswer}
//             >
//               Send ➤
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
  
// };

// export default Chatbot;


import { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "../components/Chatbot.css";
import "../components/Chatbot";

const Chatbot = ({ isVisible, onClose }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [question, setQuestion] = useState("");
  const [generatingAnswer, setGeneratingAnswer] = useState(false);

  const chatContainerRef = useRef(null);

  // List of random doctors
  const doctors = [
    {
      name: "Dr. John Smith",
      specialty: "Physiotherapist",
      fee: "$50 per session",
      description: "Dr. Smith specializes in physical rehabilitation and sports injuries."
    },
    {
      _id: 'doc1',
             name: 'Dr. Richard James',
            
             speciality: 'Posture Correction Exercises',
             degree: 'MBBS',
             experience: '1 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 60,
             address: {
                 line1: '17th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc2',
             name: 'Dr. Emily Larson',
             
             speciality: 'Mobility Exercises',
             degree: 'MBBS',
             experience: '3 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 60,
             address: {
                 line1: '27th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc3',
             name: 'Dr. Sarah Patel',
            
             speciality: 'Balance and Coordination Exercises',
             degree: 'MBBS',
             experience: '5 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 70,
             address: {
                 line1: '37th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc4',
             name: 'Dr. Christopher Lee',
             
             speciality: 'Strengthening Exercise',
             degree: 'MBBS',
             experience: '3 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 50,
             address: {
                 line1: '47th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc5',
             name: 'Dr. Jennifer Garcia',
            
             speciality: 'Stretching Exercises',
             degree: 'MBBS',
             experience: '3 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 40,
             address: {
                 line1: '57th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc6',
             name: 'Dr. Andrew Williams',
             
             speciality: 'Stretching Exercises',
             degree: 'MBBS',
             experience: '7 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 53,
             address: {
                 line1: '57th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc7',
             name: 'Dr. Christopher Davis',
            
             speciality: 'Posture Correction Exercises',
             degree: 'MBBS',
             experience: '3 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 70,
             address: {
                 line1: '17th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc8',
             name: 'Dr. Timothy White',
            
             speciality: 'Mobility Exercises',
             degree: 'MBBS',
             experience: '6 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 70,
             address: {
                 line1: '27th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc9',
             name: 'Dr. Ava Mitchell',
             
             speciality: 'Balance and Coordination Exercises',
             degree: 'MBBS',
             experience: '6 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 70,
             address: {
                 line1: '37th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc10',
             name: 'Dr. Jeffrey King',
             
             speciality: 'Strengthening Exercise',
             degree: 'MBBS',
             experience: '6 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 70,
             address: {
                 line1: '47th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc11',
             name: 'Dr. Zoe Kelly',
             
             speciality: 'Stretching Exercises',
             degree: 'MBBS',
             experience: '2 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 40,
             address: {
                 line1: '57th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc12',
             name: 'Dr. Patrick Harris',
            
             speciality: 'Stretching Exercises',
             degree: 'MBBS',
             experience: '4 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 50,
             address: {
                 line1: '57th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc13',
             name: 'Dr. Chloe Evans',
             
             speciality: 'Posture Correction Exercises',
             degree: 'MBBS',
             experience: '5 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 60,
             address: {
                 line1: '17th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc14',
             name: 'Dr. Ryan Martinez',
             
             speciality: 'Mobility Exercises',
             degree: 'MBBS',
             experience: '3 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 50,
             address: {
                 line1: '27th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc15',
             name: 'Dr. Amelia Hill',
             
             speciality: 'Balance and Coordination Exercises',
             degree: 'MBBS',
             experience: '6 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 80,
             address: {
                 line1: '37th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
         {
             _id: 'doc16',
             name: 'Dr. Ram Sharma',
             
             speciality: 'Posture Correction Exercises',
             degree: 'MBBS',
             experience: '1 Years',
             about: 'Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
             fees: 50,
             address: {
                 line1: '37th Cross, Richmond',
                 line2: 'Circle, Ring Road, London'
             }
         },
  ];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, generatingAnswer]);

  async function generateAnswer(e) {
    e.preventDefault();
    if (!question.trim()) return;

    // Expanded list of topics, greetings, farewells
    const allowedTopics = [
      "health", "physiotherapy", "balanced diet", "exercise", "therapy",
      "injury", "rehabilitation", "posture", "doctor", "consultation","Pain"
    ];
    const greetings = ["hi", "hey", "hello", "good morning", "good afternoon", "good evening", "hii", "hiii", "hoy"];
    const farewells = ["bye", "goodbye", "see you", "talk to you later", "bye bye", "good bye", "see ya"];

    // Check if the question is a greeting
    const isGreeting = greetings.some((greeting) =>
      question.toLowerCase().trim() === greeting ||
      question.toLowerCase().startsWith(greeting + " ")
    );

    // Check if the question is a farewell
    const isFarewell = farewells.some((farewell) =>
      question.toLowerCase().trim() === farewell ||
      question.toLowerCase().startsWith(farewell + " ")
    );

    // Handle greetings
    if (isGreeting) {
      const greetingResponses = [
        "Hello! How can I help you today with health or physiotherapy-related questions?",
        "Hi there! I'm here to assist you with any health or physiotherapy inquiries.",
        "Good day! What health-related question can I help you with?",
        "Welcome! I'm ready to provide information about health and physiotherapy."
      ];

      const randomGreetingResponse = greetingResponses[Math.floor(Math.random() * greetingResponses.length)];
      setChatHistory((prev) => [
        ...prev,
        { type: "question", content: question },
        { type: "answer", content: randomGreetingResponse },
      ]);
      setQuestion("");
      return;
    }

    // Handle farewells
    if (isFarewell) {
      const farewellResponses = [
        "Goodbye! Take care of your health and feel free to return if you have any questions.",
        "Bye! Wishing you good health and hope to assist you again soon.",
        "See you later! Stay healthy and don't hesitate to reach out if you need help.",
        "Farewell! Remember, maintaining your health is a journey, and I'm here to support you."
      ];

      const randomFarewellResponse = farewellResponses[Math.floor(Math.random() * farewellResponses.length)];
      setChatHistory((prev) => [
        ...prev,
        { type: "question", content: question },
        { type: "answer", content: randomFarewellResponse },
      ]);
      setQuestion("");
      return;
    }

    // Check if the user is asking about a doctor
    const isDoctorQuery = doctors.some((doctor) =>
      question.toLowerCase().includes(doctor.name.toLowerCase())
    );

    if (isDoctorQuery) {
      const doctor = doctors.find((doctor) =>
        question.toLowerCase().includes(doctor.name.toLowerCase())
      );
      const doctorResponse = `
        Name: ${doctor.name}
        Specialty: ${doctor.speciality}
        Degree: ${doctor.degree}
        Experience: ${doctor.experience}
        Fee: ${doctor.fees}
        Description: ${doctor.about}
      `;

      setChatHistory((prev) => [
        ...prev,
        { type: "question", content: question },
        { type: "answer", content: doctorResponse },
      ]);
      setQuestion("");
      return;
    }

    // Existing topic relevance check
    const isRelevant = allowedTopics.some((topic) =>
      question.toLowerCase().includes(topic)
    );

    if (!isRelevant) {
      setChatHistory((prev) => [
        ...prev,
        { type: "question", content: question },
        { type: "answer", content: "I'm sorry, I can only answer questions related to health or physiotherapy. Please ask a question in these domains!" },
      ]);
      setQuestion("");
      return;
    }

    setGeneratingAnswer(true);
    const currentQuestion = question;
    setQuestion("");

    setChatHistory((prev) => [...prev, { type: "question", content: currentQuestion }]);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: currentQuestion }] }],
        },
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text; // Adjust if necessary
      setChatHistory((prev) => [...prev, { type: "answer", content: aiResponse }]);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { type: "answer", content: "Sorry - Something went wrong. Please try again!" },
      ]);
    } finally {
      setGeneratingAnswer(false);
    }
  }

  return (
    <div
      className={`fixed bottom-0 right-4 w-80 h-[70vh] bg-white shadow-lg rounded-lg transition-transform transform ${
        isVisible ? "translate-y-0" : "translate-y-[100%]"
      }`}
    >
      {/* Chat Header */}
      <header className="bg-blue-500 text-white p-3 flex justify-between items-center rounded-t-lg">
        <h3 className="text-lg font-bold">PhysioCare Chatbot 🤖</h3>
        <button onClick={onClose} className="text-white font-bold">X</button>
      </header>

      {/* Chat Content */}
      <div className="flex flex-col h-full">
        {/* Scrollable Chat History */}
        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50 hide-scrollbar">
          {chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="bg-blue-50 rounded-xl p-8 max-w-2xl">
                <h2 className="text-2xl font-bold text-blue-600 mb-4">Welcome to PhysioCare ChatBot! 👋</h2>
                <p className="text-gray-600 mb-4">
                  I'm here to help you with anything you'd like to know. You can ask me about:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="bg-white p-4 rounded-lg shadow-sm"><span className="text-blue-500">👨‍⚕️</span> Physio Therapy</div>
                  <div className="bg-white p-4 rounded-lg shadow-sm"><span className="text-blue-500">🩺</span> Health</div>
                  <div className="bg-white p-4 rounded-lg shadow-sm"><span className="text-blue-500">🏋🏽</span> Sports Injury</div>
                  <div className="bg-white p-4 rounded-lg shadow-sm"><span className="text-blue-500">🧘</span> Posture correction</div>
                </div>
                <p className="text-gray-500 mt-6 text-sm">Just type your question below and press Enter or click Send!</p>
              </div>
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div key={index} className={`mb-4 ${chat.type === "question" ? "text-right" : "text-left"}`}>
                <div className={`inline-block max-w-[80%] p-3 rounded-lg overflow-auto hide-scrollbar ${chat.type === "question" ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}>
                  <ReactMarkdown className="overflow-auto hide-scrollbar">{chat.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {generatingAnswer && (
            <div className="text-left">
              <div className="inline-block bg-gray-100 p-3 rounded-lg animate-pulse">Thinking 💭...</div>
            </div>
          )}
        </div>

        {/* Fixed Input Form */}
        <form onSubmit={generateAnswer} className="bg-white rounded-b-lg shadow-lg p-4 border-t">
          <div className="flex gap-2">
            <textarea
              required
              className="flex-1 border mb-20 border-gray-300 rounded p-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask anything..."
              rows="2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  generateAnswer(e);
                }
              }}
            ></textarea>
            <button
              type="submit"
              className={`px-6 py-2 mb-20 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${generatingAnswer ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={generatingAnswer}
            >
              Send ➤
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chatbot;
