import React, { useState } from "react";
import { FiSend } from "react-icons/fi";
import { FaMicrophone } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react"; 
const ChatInput = ({ userInput, handleUserInput, handleSendMessage, handleKeyPress }) => {
  const [isListening, setIsListening] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); 
  const onEmojiClick = (emojiObject) => {
    handleUserInput({ target: { value: userInput + emojiObject.emoji } });
    setShowEmojiPicker(false);
  };
  return (
    <div className="p-2 bg-gray-100 border-t border-gray-300 flex items-center space-x-2 relative">
      <button
        className="text-gray-500 hover:text-purple-500"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
      >
        <BsEmojiSmile  size={24} />
      </button>
        {showEmojiPicker && (
        <div className="absolute bottom-14 left-0  z-10 bg-white shadow-md border border-gray-300 rounded-lg p-2 max-w-[90%]">
          <EmojiPicker className="right-16" onEmojiClick={onEmojiClick} />
        </div>
      )}
        <input
        type="text"
        value={userInput}
        onChange={handleUserInput}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        className="text-sm flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        style={{ minWidth: "0" }}       />
      <button
        onClick={handleSendMessage}
        className="bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 focus:outline-none flex items-center"
      >
        <FiSend size={20} />
      </button>
    </div>
  );  
};
export default ChatInput;