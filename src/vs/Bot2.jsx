import { useState } from 'react';
// import './assets/css/v2.css';
import chaticon from './assets/images/chaticon.png';
import qubit from './assets/images/logo.png'
import Message from './Message';
function Bot2() {
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="chatbot-container-v2 floating-chat-v2">
      <div className={`chat-icon-wrap-v2 ${isOpen ? 'hidden-v2' : ''}`} onClick={togglePopup}>
        <img src={chaticon} alt="Chat Icon" className="chat-icon-v2" />
      </div>
      <div className={`chat-popup-v2 ${isOpen ? 'open-v2' : ''}`}>
        <div className="chat-v2 enter-v2">
          <div className="header-v2">
            <img className='qubit_logo-v2' src={qubit} alt="" />
            {/* <span className="title">Devpandas</span> */}
            <i onClick={togglePopup} className="fa fa-times" aria-hidden="true" style={{ fontSize: '30px' }}></i>
          </div>
          <Message/>
        </div>
      </div>
    </div>
  );
}

export default Bot2