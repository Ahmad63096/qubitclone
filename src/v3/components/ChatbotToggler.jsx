import { useState, useEffect } from "react";
import ChatbotInterface from "./ChatbotInterface";
import ChatTogglerButton from "./ChatTogglerButton";
const ChatbotToggler = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };
  useEffect(() => {
    if (window.location.pathname === "/v3") {
      const script = document.createElement('script');
      script.src = "https://unpkg.com/@tailwindcss/browser@4";
      script.async = true;
      document.head.appendChild(script);
      return () => {
        document.head.removeChild(script);
      };
    }
  }, []); 
  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && <ChatbotInterface onClose={toggleChatbot} />}
      {!isOpen && <ChatTogglerButton isOpen={isOpen} onClick={toggleChatbot} />}
    </div>
  );
};
export default ChatbotToggler;




















// import  { useState } from "react";
// import ChatbotInterface from "./ChatbotInterface";
// import ChatTogglerButton from "./ChatTogglerButton";

// const ChatbotToggler = () => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleChatbot = () => {
//     setIsOpen((prev) => !prev);
//   };

//   return (
//     <div className="fixed bottom-5 right-5 z-50">
//       {isOpen && <ChatbotInterface onClose={toggleChatbot} />}
//       {!isOpen && <ChatTogglerButton isOpen={isOpen} onClick={toggleChatbot} />}
//     </div>
    
//   );  
// };

// export default ChatbotToggler;
