import React from "react";
import { FaXmark } from "react-icons/fa6";
import { RiDeleteBinFill } from "react-icons/ri";
const ChatHeader = ({ onClose, resetMessages }) => {
  // const handleClearHistory = () => {
  //   localStorage.removeItem("chatMessages");
  //   resetMessages();
  // };
  return (
    <div className="">
      <div className="animated-border rounded-t-lg ">
        <div className="flex items-center justify-between  py-2 bg-white rounded-t-lg">
          <div className="flex items-center justify-center w-[80%]">
            <h2 className="text-lg font-semibold text-black truncate font-kanit tracking-widest ">QUBIT Commerce</h2>
          </div>
          {/* <button
            onClick={handleClearHistory}
            className="w-[10%] text-right text-black text-lg relative group"
          >
            <RiDeleteBinFill size={22} />
            <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 text-sm text-white bg-black rounded px-2 py-1 whitespace-nowrap transition-opacity duration-300">
              Clear Chat
            </span>
          </button> */}
          <button onClick={onClose} className="w-[10%] text-right text-black text-lg">
            <FaXmark size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;