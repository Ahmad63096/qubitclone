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
    <div className="chatbot-container floating-chat">
      <div className={`chat-icon-wrap ${isOpen ? 'hidden' : ''}`} onClick={togglePopup}>
        <img src={chaticon} alt="Chat Icon" className="chat-icon" />
      </div>
      <div className={`chat-popup ${isOpen ? 'open' : ''}`}>
        <div className="chat enter">
          <div className="header">
            <img className='qubit_logo' src={qubit} alt="" />
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