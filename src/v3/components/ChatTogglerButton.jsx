import React from "react";
import Logo from '../assets/devpanda-loggo.png'
const ChatTogglerButton = ({ isOpen, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-16 h-16 bg-purple-200 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:bg-purple-400 transition duration-300">
      {isOpen ? (
        ""
      ) : (
        <img src={Logo} alt="QUBIT Logo" className="w-9 h-9  devpandas-animation" />
      )}
    </button>
  );
};
export default ChatTogglerButton;
