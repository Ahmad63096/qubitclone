import { useState, useRef, useEffect } from "react";
import powerby from "../assets/images/footerlogo.png";
import Svg, { Emoji } from "./Svg";
import typing from "../assets/images/typing.gif";
import { animateBotReply } from "./Function";

function Message() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const sessionId = "_fi68ybtky";
  const ip = "103.8.112.36";

  const getTimestamp = () => {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "pm" : "am";
    return `${hours}:${minutes} ${ampm}`;
  };

  const getUniqueMessageId = () => Date.now();

  const sendMessage = async (message = currentMessage) => {
    if (message.trim()) {
      const userMessage = {
        sender: "user",
        text: message,
        timestamp: getTimestamp(),
        id: getUniqueMessageId(),
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setCurrentMessage("");
      inputRef.current?.focus();
      setIsTyping(true);

      try {
        const botReply = await fetchBotReply(message);
        if (botReply) {
          const firstReply = {
            sender: "bot",
            text: botReply.main_response,
            timestamp: getTimestamp(),
            id: getUniqueMessageId(),
          };
          setMessages((prevMessages) => [...prevMessages, firstReply]);
          setTimeout(() => animateBotReply(firstReply.id), 0);

          if (botReply.follow_up_question?.trim()) {
            setTimeout(() => {
              const secondReply = {
                sender: "bot",
                text: botReply.follow_up_question,
                timestamp: getTimestamp(),
                id: getUniqueMessageId(),
              };
              setMessages((prevMessages) => [...prevMessages, secondReply]);
              setTimeout(() => animateBotReply(secondReply.id), 0);
            }, 2000);
          }
        }
      } catch (error) {
        console.error("Error fetching bot reply:", error);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const fetchBotReply = async (message) => {
    const zoneTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
    const data = {
      session_id: sessionId,
      message,
      Zone: "Asia/Karachi",
      zoneTime,
      ip,
    };

    const response = await fetch("https://bot.devspandas.com/v1/devbot/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch bot reply");
    }

    return response.json();
  };

  const handleButtonClick = (buttonText) => {
    let responseMessage = "";

    // Define the mapping of button text to corresponding response message
    const buttonMessages = {
      "AI BOT Development": "I want to know about AI chatbots.",
      "Software Development": "I want to know about software development",
      "DevOps & cloud computing": "I want to know about the DevOps & Cloud computing",
      "Schedule Demo": "I want to book a demo"
    };

    // Check if the button text exists in the mapping
    if (buttonMessages[buttonText]) {
      responseMessage = buttonMessages[buttonText];
    } else {
      responseMessage = "Sorry, I didn't understand that request.";
    }

    // Send the message corresponding to the button click
    sendMessage(responseMessage);
  };
  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchGreetingMessage = async () => {
      try {
        const response = await fetch("https://bot.devspandas.com/api/config/get_greetings_message");
        const data = await response.json();

        const greetingMessage = {
          sender: "bot",
          text: data.data,
          timestamp: getTimestamp(),
          id: getUniqueMessageId(),
          buttons: [
            "AI BOT Development",
            "Software Development",
            "DevOps & cloud computing",
            "Schedule Demo",
          ],
        };

        setMessages([greetingMessage]);
        setTimeout(() => animateBotReply(greetingMessage.id), 0);
      } catch (error) {
        console.error("Error fetching the greeting message:", error);
      }
    };

    fetchGreetingMessage();
  }, []);

  return (
    <>
      <ul ref={messagesContainerRef} className="messages">
        {messages.map((msg) =>
          msg.buttons ? (
            <div key={msg.id} id={`message-${msg.id}`} className="buttons-container">
              <li className="other">
                {msg.text}
                <div className="timestamp">{msg.timestamp}</div>
              </li>
              <div>
                {msg.buttons.map((buttonText, index) => (
                  <button key={index} onClick={() => handleButtonClick(buttonText)}>
                    {buttonText}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <li key={msg.id} id={`message-${msg.id}`} className={msg.sender === "user" ? "self" : "other"}>
              {msg.text}
              <div className="timestamp">{msg.timestamp}</div>
            </li>
          )
        )}
      </ul>

      {isTyping && (
        <li className="typing">
          <img src={typing} alt="Typing indicator" />
        </li>
      )}

      <div className="footer">
        <textarea
          ref={inputRef}
          className="text-box"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Enter here...."
          rows={1}
          autoFocus
        />
        <button id="fileadd">
          <Emoji />
        </button>
        <button id="emojibutton">
          <i className="fa-regular fa-face-smile"></i>
        </button>
        <button
          id="sendMessage"
          onClick={sendMessage}
          disabled={!currentMessage.trim()}
        >
          <Svg />
        </button>
      </div>
      <p className="copyright-two">
        Powered by <img src={powerby} alt="Powered by logo" />
      </p>
    </>
  );
}

export default Message;






















































// import { useState, useRef, useEffect } from "react";
// import powerby from "../assets/images/footerlogo.png";
// import Svg, { Emoji } from "./Svg";
// import typing from "../assets/images/typing.gif";
// import { animateBotReply } from "./Function";
// function Message() {
//   const [messages, setMessages] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [showButtons, setShowButtons] = useState(false);
//   const messagesContainerRef = useRef(null);
//   const inputRef = useRef(null);
//   const sessionId = "_fi68ybtky";
//   const ip = "103.8.112.36";
//   const getTimestamp = () => {
//     const now = new Date();
//     const hours = now.getHours() % 12 || 12;
//     const minutes = String(now.getMinutes()).padStart(2, "0");
//     const ampm = now.getHours() >= 12 ? "pm" : "am";
//     return `${hours}:${minutes} ${ampm}`;
//   };
//   const getUniqueMessageId = () => {
//     return Date.now();
//   };
//   const sendMessage = async (message = currentMessage) => {
//     if (message.trim()) {
//       const userMessage = {
//         sender: "user",
//         text: message,
//         timestamp: getTimestamp(),
//         id: getUniqueMessageId(),
//       };
//       setMessages((prevMessages) => [...prevMessages, userMessage]);
//       setCurrentMessage("");
//       inputRef.current?.focus();
//       setIsTyping(true);
//       try {
//         const botReply = await fetchBotReply(message);
//         if (botReply) {
//           setTimeout(() => {
//             const firstReply = {
//               sender: "bot",
//               text: botReply.main_response,
//               timestamp: getTimestamp(),
//               id: getUniqueMessageId(),
//             };
//             setMessages((prevMessages) => [...prevMessages, firstReply]);
//             setTimeout(() => animateBotReply(firstReply.id), 0);
//             if (botReply.follow_up_question && botReply.follow_up_question.trim()) {
//               setTimeout(() => {
//                 const secondReply = {
//                   sender: "bot",
//                   text: botReply.follow_up_question,
//                   timestamp: getTimestamp(),
//                   id: getUniqueMessageId(),
//                 };
//                 setMessages((prevMessages) => [...prevMessages, secondReply]);
//                 setTimeout(() => animateBotReply(secondReply.id), 0);
//               }, 2000);
//             }
//           }, 0);
//         }
//       } catch (error) {
//         console.error("Error fetching bot reply:", error);
//       } finally {
//         setIsTyping(false);
//       }
//     }
//   };
//   const fetchBotReply = async (message) => {
//     const zoneTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
//     const data = {
//       session_id: sessionId,
//       message: message,
//       Zone: "Asia/Karachi",
//       zoneTime: zoneTime,
//       ip: ip,
//     };
//     console.log("Sending chat message", data);
//     const response = await fetch("https://bot.devspandas.com/v1/devbot/chat", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       throw new Error("Failed to fetch bot reply");
//     }
//     const result = await response.json();
//     console.log("API response", result);
//     return result;
//   };
//   const handleInputChange = (e) => {
//     setCurrentMessage(e.target.value);
//   };
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };
//   const scrollToBottom = () => {
//     const container = messagesContainerRef.current;
//     if (container) {
//       container.scrollTo({
//         top: container.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   };
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
//   useEffect(() => {
//     const fetchGreetingMessage = async () => {
//       try {
//         const response = await fetch("https://bot.devspandas.com/api/config/get_greetings_message");
//         const data = await response.json();
//         const greetingMessage = {
//           sender: "bot",
//           text: data.data,
//           timestamp: getTimestamp(),
//           id: getUniqueMessageId(),
//         };
//         setMessages([greetingMessage]);
//         setTimeout(() => animateBotReply(greetingMessage.id), 0);
//         setTimeout(() => {
//           setShowButtons(true);
//         }, 2000);
//       } catch (error) {
//         console.error("Error fetching the greeting message:", error);
//       }
//     };
//     fetchGreetingMessage();
//   }, []);
//   const handleButtonClick = (buttonText) => {
//     sendMessage(buttonText);
//   };
//   return (
//     <>
//       <ul ref={messagesContainerRef} className="messages">
//         {messages.map((msg) => (
//           <li key={msg.id} id={`message-${msg.id}`} className={msg.sender === "user" ? "self" : "other"}>
//             {msg.text}
//             <div className="timestamp">{msg.timestamp}</div>
//           </li>
//         ))}
//       </ul>
//       {isTyping && (
//         <li className="typing">
//           <img src={typing} alt="Typing indicator" />
//         </li>
//       )}
//       {showButtons && (
//         <div className="buttons-container">
//           <button onClick={() => handleButtonClick("AI Bot Dev")}>AI Bot Dev</button>
//           <button onClick={() => handleButtonClick("Software Dev")}>Software Dev</button>
//           <button onClick={() => handleButtonClick("DevOPS Work")}>DevOPS Work</button>
//           <button onClick={() => handleButtonClick("Anythingspecial")}>Any Thing Special</button>
//           <button onClick={() => handleButtonClick("Schedule Call")}>Schedule Call</button>
//           <button onClick={() => handleButtonClick("Send Email")}>Send Email</button>
//         </div>
//       )}
//       <div className="footer">
//         <textarea
//           ref={inputRef}
//           className="text-box"
//           value={currentMessage}
//           onChange={handleInputChange}
//           onKeyPress={handleKeyPress}
//           placeholder="Enter here...."
//           rows={1}
//           autoFocus
//         />
//         <button id="fileadd">
//           <Emoji />
//         </button>
//         <button id="emojibutton">
//           <i className="fa-regular fa-face-smile"></i>
//         </button>
//         <button
//           id="sendMessage"
//           onClick={sendMessage}
//           disabled={!currentMessage.trim()}
//         >
//           <Svg />
//         </button>
//       </div>
//       <p className="copyright">
//         Powered by <img src={powerby} alt="Powered by logo" />
//       </p>
//     </>
//   );
// }
// export default Message;




















// import { useState, useRef, useEffect } from "react";
// import powerby from "../assets/images/footerlogo.png";
// import Svg, { Emoji } from "./Svg";
// import typing from "../assets/images/typing.gif";
// import { animateBotReply } from "./Function";

// function Message() {
//   const [messages, setMessages] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [showButtons, setShowButtons] = useState(false);
//   const messagesContainerRef = useRef(null);
//   const inputRef = useRef(null);
//   const sessionId = "_fi68ybtky";
//   const ip = "103.8.112.36";

//   const getTimestamp = () => {
//     const now = new Date();
//     const hours = now.getHours() % 12 || 12;
//     const minutes = String(now.getMinutes()).padStart(2, "0");
//     const ampm = now.getHours() >= 12 ? "pm" : "am";
//     return `${hours}:${minutes} ${ampm}`;
//   };

//   const getUniqueMessageId = () => {
//     return Date.now();
//   };
//   const sendMessage = async () => {
//     if (currentMessage.trim()) {
//       const userMessage = {
//         sender: "user",
//         text: currentMessage,
//         timestamp: getTimestamp(),
//         id: getUniqueMessageId(),
//       };
//       setMessages((prevMessages) => [...prevMessages, userMessage]);
//       setCurrentMessage("");
//       inputRef.current?.focus();
//       setIsTyping(true);
//       try {
//         const botReply = await fetchBotReply(currentMessage);
//         if (botReply) {
//           setTimeout(() => {
//             const firstReply = {
//               sender: "bot",
//               text: botReply.main_response,
//               timestamp: getTimestamp(),
//               id: getUniqueMessageId(),
//             };
//             setMessages((prevMessages) => [...prevMessages, firstReply]);
//             setTimeout(() => animateBotReply(firstReply.id), 0);
//             if (botReply.follow_up_question && botReply.follow_up_question.trim()) {
//               setTimeout(() => {
//                 const secondReply = {
//                   sender: "bot",
//                   text: botReply.follow_up_question,
//                   timestamp: getTimestamp(),
//                   id: getUniqueMessageId(),
//                 };
//                 setMessages((prevMessages) => [...prevMessages, secondReply]);
//                 setTimeout(() => animateBotReply(secondReply.id), 0);
//               }, 2000);
//             }
//           }, 0);
//         }
//       } catch (error) {
//         console.error("Error fetching bot reply:", error);
//       } finally {
//         setIsTyping(false);
//       }
//     }
//   };
//   const fetchBotReply = async (message) => {
//     const zoneTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
//     const data = {
//       session_id: sessionId,
//       message: message,
//       Zone: "Asia/Karachi",
//       zoneTime: zoneTime,
//       ip: ip,
//     };
//     console.log("Sending chat message", data);
//     const response = await fetch("https://bot.devspandas.com/v1/devbot/chat", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       throw new Error("Failed to fetch bot reply");
//     }
//     const result = await response.json();
//     console.log("API response", result);
//     return result;
//   };
//   const handleInputChange = (e) => {
//     setCurrentMessage(e.target.value);
//   };
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };
//   const scrollToBottom = () => {
//     const container = messagesContainerRef.current;
//     if (container) {
//       container.scrollTo({
//         top: container.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   useEffect(() => {
//     const fetchGreetingMessage = async () => {
//       try {
//         const response = await fetch("https://bot.devspandas.com/api/config/get_greetings_message");
//         const data = await response.json();
//         const greetingMessage = {
//           sender: "bot",
//           text: data.data,
//           timestamp: getTimestamp(),
//           id: getUniqueMessageId(),
//         };
//         setMessages([greetingMessage]);
//         setTimeout(() => animateBotReply(greetingMessage.id), 0);
//         setTimeout(() => {
//           setShowButtons(true);
//         }, 2000);
//       } catch (error) {
//         console.error("Error fetching the greeting message:", error);
//       }
//     };
//     fetchGreetingMessage();
//   }, []);
//   return (
//     <>
//       <ul ref={messagesContainerRef} className="messages">
//         {messages.map((msg) => (
//           <li
//             key={msg.id}
//             id={`message-${msg.id}`}
//             className={msg.sender === "user" ? "self" : "other"}
//           >
//             {msg.text}
//             <div className="timestamp">{msg.timestamp}</div>
//           </li>
//         ))}
//       </ul>
//       {isTyping && (
//         <li className="typing">
//           <img src={typing} alt="Typing indicator" />
//         </li>
//       )}
//       {showButtons && (
//         <div className="buttons-container">
//           <button onClick={() => console.log("Button 1 clicked")}>AI Bot Dev</button>
//           <button onClick={() => console.log("Button 2 clicked")}>Software Dev</button>
//           <button onClick={() => console.log("Button 3 clicked")}>DevOPS Work</button>
//           <button onClick={() => console.log("Button 1 clicked")}>Anythingspecial</button>
//           <button onClick={() => console.log("Button 2 clicked")}>Schedule Call</button>
//           <button onClick={() => console.log("Button 3 clicked")}>Send Email</button>
//         </div>
//       )}
//       <div className="footer">
//         <textarea
//           ref={inputRef}
//           className="text-box"
//           value={currentMessage}
//           onChange={handleInputChange}
//           onKeyPress={handleKeyPress}
//           placeholder="Enter here...."
//           rows={1}
//           autoFocus
//         />
//         <button id="fileadd">
//           <Emoji />
//         </button>
//         <button id="emojibutton">
//           <i className="fa-regular fa-face-smile"></i>
//         </button>
//         <button
//           id="sendMessage"
//           onClick={sendMessage}
//           disabled={!currentMessage.trim()}
//         >
//           <Svg />
//         </button>
//       </div>
//       <p className="copyright">
//         Powered by <img src={powerby} alt="Powered by logo" />
//       </p>
//     </>
//   );
// }
// export default Message;































// import { useState, useRef, useEffect } from "react";
// import powerby from "../assets/images/footerlogo.png";
// import Svg, { Emoji } from "./Svg";
// import typing from "../assets/images/typing.gif";
// import { animateBotReply } from "./Function";
// function Message() {
//   const [messages, setMessages] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesContainerRef = useRef(null);
//   const inputRef = useRef(null);
//   const sessionId = "_fi68ybtky";
//   const ip = "103.8.112.36";
//   const getTimestamp = () => {
//     const now = new Date();
//     const hours = now.getHours() % 12 || 12;
//     const minutes = String(now.getMinutes()).padStart(2, "0");
//     const ampm = now.getHours() >= 12 ? "pm" : "am";
//     return `${hours}:${minutes} ${ampm}`;
//   };
//   const getUniqueMessageId = () => {
//     return Date.now();
//   };
//   const sendMessage = async () => {
//     if (currentMessage.trim()) {
//       const userMessage = {
//         sender: "user",
//         text: currentMessage,
//         timestamp: getTimestamp(),
//         id: getUniqueMessageId(),
//       };
//       setMessages((prevMessages) => [...prevMessages, userMessage]);
//       setCurrentMessage("");
//       inputRef.current?.focus();
//       setIsTyping(true);
//       try {
//         const botReply = await fetchBotReply(currentMessage);
//         if (botReply) {
//           setTimeout(() => {
//             const firstReply = {
//               sender: "bot",
//               text: botReply.main_response,
//               timestamp: getTimestamp(),
//               id: getUniqueMessageId(),
//             };
//             setMessages((prevMessages) => [...prevMessages, firstReply]);
//             setTimeout(() => animateBotReply(firstReply.id), 0);
//             if (botReply.follow_up_question && botReply.follow_up_question.trim()) {
//               setTimeout(() => {
//                 const secondReply = {
//                   sender: "bot",
//                   text: botReply.follow_up_question,
//                   timestamp: getTimestamp(),
//                   id: getUniqueMessageId(),
//                 };
//                 setMessages((prevMessages) => [...prevMessages, secondReply]);
//                 setTimeout(() => animateBotReply(secondReply.id), 0);
//               }, 2000);
//             }
//           }, 0);
//         }
//       } catch (error) {
//         console.error("Error fetching bot reply:", error);
//       } finally {
//         setIsTyping(false);
//       }
//     }
//   };
//   const fetchBotReply = async (message) => {
//     const zoneTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
//     const data = {
//       session_id: sessionId,
//       message: message,
//       Zone: "Asia/Karachi",
//       zoneTime: zoneTime,
//       ip: ip,
//     };
//     console.log("Sending chat message", data);
//     const response = await fetch("https://bot.devspandas.com/v1/devbot/chat", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       throw new Error("Failed to fetch bot reply");
//     }
//     const result = await response.json();
//     console.log("API response", result);
//     return result;
//   };
//   const handleInputChange = (e) => {
//     setCurrentMessage(e.target.value);
//   };
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };
//   const scrollToBottom = () => {
//     const container = messagesContainerRef.current;
//     if (container) {
//       container.scrollTo({
//         top: container.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   };
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
//   useEffect(() => {
//     const fetchGreetingMessage = async () => {
//       try {
//         const response = await fetch("https://bot.devspandas.com/api/config/get_greetings_message");
//         const data = await response.json();
//         const greetingMessage = {
//           sender: "bot",
//           text: data.data,
//           timestamp: getTimestamp(),
//           id: getUniqueMessageId(),
//         };
//         setMessages([greetingMessage]);
//         setTimeout(() => animateBotReply(greetingMessage.id), 0);
//       } catch (error) {
//         console.error("Error fetching the greeting message:", error);
//       }
//     };
//     fetchGreetingMessage();
//   }, []);
//   return (
//     <>
//       <ul ref={messagesContainerRef} className="messages">
//         {messages.map((msg) => (
//           <li
//             key={msg.id}
//             id={`message-${msg.id}`}
//             className={msg.sender === "user" ? "self" : "other"}
//           >
//             {msg.text}
//             <div className="timestamp">{msg.timestamp}</div>
//           </li>
//         ))}
//       </ul>
//       {isTyping && (
//         <li className="typing">
//           <img src={typing} alt="Typing indicator" />
//         </li>
//       )}
//       <div className="footer">
//         <textarea
//           ref={inputRef}
//           className="text-box"
//           value={currentMessage}
//           onChange={handleInputChange}
//           onKeyPress={handleKeyPress}
//           placeholder="Enter here...."
//           rows={1}
//           autoFocus
//         />
//         <button id="fileadd">
//           <Emoji />
//         </button>
//         <button id="emojibutton">
//           <i className="fa-regular fa-face-smile"></i>
//         </button>
//         <button
//           id="sendMessage"
//           onClick={sendMessage}
//           disabled={!currentMessage.trim()}
//         >
//           <Svg />
//         </button>
//       </div>
//       <p className="copyright">
//         Powered by <img src={powerby} alt="Powered by logo" />
//       </p>
//     </>
//   );
// }
// export default Message;















































// import { useState, useRef, useEffect } from "react";
// import powerby from '../assets/images/footerlogo.png';
// import Svg, { Emoji } from "./Svg";
// function Message() {
//   const [messages, setMessages] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState("");
//   const messagesContainerRef = useRef(null);
//   const inputRef = useRef(null);
//   const getTimestamp = () => {
//     const now = new Date();
//     const hours = now.getHours() % 12 || 12;
//     const minutes = String(now.getMinutes()).padStart(2, "0");
//     const ampm = now.getHours() >= 12 ? "pm" : "am";
//     return `${hours}:${minutes} ${ampm}`;
//   };
//   const sendMessage = () => {
//     if (currentMessage.trim()) {
//       const userMessage = {
//         sender: "user",
//         text: currentMessage,
//         timestamp: getTimestamp(),
//       };
//       setMessages((prevMessages) => [...prevMessages, userMessage]);
//       setCurrentMessage("");
//       inputRef.current?.focus();
//       setTimeout(() => {
//         const botReply = {
//           sender: "bot",
//           text: "This is an automated reply.",
//           timestamp: getTimestamp(),
//         };
//         setMessages((prevMessages) => [...prevMessages, botReply]);
//       }, 1000);
//     }
//   };
//   const handleInputChange = (e) => {
//     setCurrentMessage(e.target.value);
//   };
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };
//   const scrollToBottom = () => {
//     const container = messagesContainerRef.current;
//     if (container) {
//       container.scrollTo({
//         top: container.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   };
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
//   useEffect(() => {
//     const fetchGreetingMessage = async () => {
//       try {
//         const response = await fetch("https://bot.devspandas.com/api/config/get_greetings_message");
//         const data = await response.json();
//         console.log('greatting message',data);
//         const greetingMessage = {
//           sender: "bot",
//           text: data.data,
//           timestamp: getTimestamp(),
//         };
//         setMessages([greetingMessage]);
//       } catch (error) {
//         console.error("Error fetching the greeting message:", error);
//       }
//     };
//     fetchGreetingMessage();
//   }, []);
//   return (
//     <>
//       <ul ref={messagesContainerRef} className="messages">
//         {messages.map((msg, index) => (
//           <li key={index} className={msg.sender === "user" ? "self" : "other"}>
//             {msg.text}
//             <div className="timestamp">{msg.timestamp}</div>
//           </li>
//         ))}
//       </ul>
//       <div className="footer">
//         <textarea
//           ref={inputRef}
//           className="text-box"
//           value={currentMessage}
//           onChange={handleInputChange}
//           onKeyPress={handleKeyPress}
//           placeholder="Enter here...."
//           rows={1}
//           autoFocus
//         />
//         <button id="fileadd">
//           <Emoji />
//         </button>
//         <button id="emojibutton">
//           <i className="fa-regular fa-face-smile"></i>
//         </button>
//         <button id="sendMessage" onClick={sendMessage} disabled={!currentMessage.trim()}>
//           <Svg />
//         </button>
//       </div>
//       <p className="copyright">
//         Powered by <img src={powerby} alt="" />
//       </p>
//     </>
//   );
// }
// export default Message;