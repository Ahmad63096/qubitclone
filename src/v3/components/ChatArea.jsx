import React, { useEffect, useRef } from "react";
import LogoDev from "../assets/dev-animation.png";
const ChatArea = ({ messages, isBotTyping }) => {
  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div
      ref={chatContainerRef}
      className="font-kanit flex-grow p-3 pt-5 overflow-y-auto bg-white text-sm custom-scrollbar"
    >
      {messages.map((msg, index) => (
        <div key={index} className={`mb-3 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
          {msg.sender === "bot" && (
            <div className="flex-shrink-0 w-6 h-6 mr-3">
              <img className="w-full h-full object-contain dev-animation" src={LogoDev} alt="Bot Logo Animation" />
            </div>
          )}
          <div className={`py-1 px-2 max-w-xs w-auto rounded-lg ${msg.sender === "user" ? "ring-2 ring-chatpanda text-gray-700 ml-4" : "bg-gray-100 text-gray-700 ring-2 ring-purple-400"} ${msg.isLoading ? "animate-pulse" : ""} break-words`}>
            <p>{msg.text}</p>
            {msg.image && (
              <div className="mb-2">
                <img src={msg.image} alt="Product" className="w-full h-auto rounded-lg" />
                <div>
                  <button className="bg-blue-500 rounded p-1 text-white cursor-pointer mr-2">Add to cart</button>
                  <button className="bg-blue-500 rounded p-1 text-white cursor-pointer">Checkout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      {isBotTyping && (
        <div className="mb-3 flex justify-start">
          <div className="p-3 max-w-xs rounded-lg bg-gray-100 text-gray-700 animate-pulse">
            <p>QUBIT is typing...</p>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatArea;