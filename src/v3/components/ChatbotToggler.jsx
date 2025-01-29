import React, { useState } from "react";
import ChatbotInterface from "./ChatbotInterface";
import ChatTogglerButton from "./ChatTogglerButton";

const ChatbotToggler = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Conditionally render the ChatbotInterface */}
      {isOpen && <ChatbotInterface onClose={toggleChatbot} />}

      {/* Conditionally render the ChatTogglerButton */}
      {!isOpen && <ChatTogglerButton isOpen={isOpen} onClick={toggleChatbot} />}
    </div>
    
  );  
};

export default ChatbotToggler;
