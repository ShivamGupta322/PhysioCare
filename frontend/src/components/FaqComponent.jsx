import React, { useState } from 'react';
import { ChevronDown, Activity, Monitor, CreditCard, Stethoscope, HelpCircle } from 'lucide-react';

const FAQItem = ({ question, answer, icon, isOpen, onClick }) => {
  return (
    <div className={`border border-gray-200 rounded-lg mb-4 overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md' : 'shadow-sm'}`}>
      <button
        className={`flex items-center justify-between w-full p-5 text-left ${isOpen ? 'bg-blue-50' : 'bg-white hover:bg-gray-50'}`}
        onClick={onClick}
      >
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-full ${isOpen ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600'}`}>
            {icon}
          </div>
          <span className={`text-lg font-medium ${isOpen ? 'text-blue-800' : 'text-gray-800'}`}>{question}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 transition-transform duration-300 ${
            isOpen ? 'transform rotate-180 text-blue-700' : 'text-gray-500'
          }`}
        />
      </button>
      <div
        className={`transition-all duration-300 overflow-hidden bg-white ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="p-5 text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  );
};

function Faq() {
  const [openIndex, setOpenIndex] = useState(0); // Default open the first FAQ
  
  const faqData = [
    {
      question: 'Is online physiotherapy effective?',
      answer: 'Yes, online physiotherapy has been proven effective for many conditions. Our therapists use video consultations to assess movement, provide exercises, and monitor progress. Studies show that telehealth physiotherapy can achieve similar outcomes to in-person care for many conditions.',
      icon: <Activity className="w-5 h-5" />,
    },
    {
      question: 'What equipment do I need?',
      answer: "You'll need a device with a camera (smartphone, tablet, or computer) and a stable internet connection. For exercises, basic items like a yoga mat and some floor space are helpful. Your physiotherapist will recommend any specific equipment based on your condition.",
      icon: <Monitor className="w-5 h-5" />,
    },
    {
      question: 'How do payments and insurance work?',
      answer: 'We accept major credit cards and provide detailed receipts for insurance claims. Many insurance providers cover online physiotherapy sessions. We recommend checking with your insurance provider about coverage for telehealth physiotherapy services.',
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      question: 'What happens during the first consultation?',
      answer: 'Your first session includes a detailed assessment of your condition, medical history review, and movement analysis. Your physiotherapist will develop a personalized treatment plan and demonstrate exercises. The session typically lasts 45-60 minutes.',
      icon: <Stethoscope className="w-5 h-5" />,
    },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block p-3 bg-blue-100 rounded-full text-blue-700 mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about online physiotherapy consultations with PhysioCare. 
            Can't find what you're looking for? Contact our support team.
          </p>
        </div>
        
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              icon={item.icon}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
        
        {/* <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
            Contact Support
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Faq;