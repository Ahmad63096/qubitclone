import React from "react";
import { FaXmark } from "react-icons/fa6";
const ChatHeader = ({ onClose, resetMessages }) => {
  return (
    <div className="">
      <div className="animated-border rounded-t-lg ">
        <div className="flex items-center justify-between  py-2 bg-white rounded-t-lg">
          <div className="flex items-center justify-center w-[80%]">
            <h2 className="text-lg font-semibold text-black truncate font-kanit tracking-widest ">QUBIT Commerce</h2>
          </div>
          <button onClick={onClose} className="w-[10%] text-right text-black text-lg">
            <FaXmark size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ChatHeader;