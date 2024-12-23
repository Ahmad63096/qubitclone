import { useState, useRef, useEffect } from "react";
import powerby from "../assets/images/footerlogo.png";
import Svg, { Emoji } from "./Svg";
import typing from "../assets/images/typing.gif";
import { animateBotReply, getSessionId, getVisitorIp } from "./Function";
function Message() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [waitingSent, setWaitingSent] = useState(false);
  const [thankYouSent, setThankYouSent] = useState(false);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef({ waiting: null, thankYou: null });
  const getTimestamp = () => {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = now.getHours() >= 12 ? "pm" : "am";
    return `${hours}:${minutes} ${ampm}`;
  };
  const getUniqueMessageId = () => Date.now();
  const resetTimers = () => {
    clearTimeout(timers.current.waiting);
    clearTimeout(timers.current.thankYou);
    timers.current.waiting = null;
    timers.current.thankYou = null;
    setWaitingSent(false);
    setThankYouSent(false);
  };
  const startInactivityTimer = () => {
    resetTimers();
    timers.current.waiting = setTimeout(() => {
      if (!waitingSent) {
        showWaitingMessage();
        setWaitingSent(true);
      }
      timers.current.thankYou = setTimeout(() => {
        if (!thankYouSent) {
          showThankYouMessage();
          setThankYouSent(true);
        }
      }, 120000);
    }, 120000);
  };
  const showWaitingMessage = () => {
    const waitingMessage = {
      sender: "bot",
      text: "Are you still there? Feel free to ask any questions!",
      timestamp: getTimestamp(),
      id: getUniqueMessageId(),
    };
    setMessages((prevMessages) => [...prevMessages, waitingMessage]);
  };
  const showThankYouMessage = () => {
    const thankYouMessage = {
      sender: "bot",
      text: "Thank you for visiting! The session has ended.",
      timestamp: getTimestamp(),
      id: getUniqueMessageId(),
    };
    setMessages((prevMessages) => [...prevMessages, thankYouMessage]);
    localStorage.removeItem("session_id");
  };
  const sendMessage = async (message = currentMessage) => {
    if (message.trim()) {
      resetTimers();
      startInactivityTimer();
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
          const { main_response, follow_up_question, show_button } = botReply;
          if (main_response?.trim()) {
            const mainMessages = splitMessage(main_response.trim());
            mainMessages.forEach((messageChunk, index) => {
              setTimeout(() => {
                const mainMessage = {
                  sender: "bot",
                  text: messageChunk,
                  timestamp: getTimestamp(),
                  id: getUniqueMessageId() + index,
                };
                setMessages((prevMessages) => [...prevMessages, mainMessage]);
                setTimeout(() => animateBotReply(mainMessage.id), 0); 
              }, index * 1000);
            });
          }
          if (follow_up_question?.trim()) {
            const followUpMessages = splitMessage(follow_up_question.trim());
            followUpMessages.forEach((messageChunk, index) => {
              setTimeout(() => {
                const followUpMessage = {
                  sender: "bot",
                  text: messageChunk,
                  timestamp: getTimestamp(),
                  id: getUniqueMessageId() + index,
                };
                setMessages((prevMessages) => [...prevMessages, followUpMessage]);
                setTimeout(() => animateBotReply(followUpMessage.id), 0); 
              }, 2000 + index * 1000);
            });
          }
          if (show_button) {
            setTimeout(() => {
              const buttonMessage = {
                sender: "bot",
                text: "",
                timestamp: getTimestamp(),
                id: getUniqueMessageId(),
                buttons: [
                  "AI BOT Development",
                  "Software Development",
                  "DevOps & cloud computing",
                  "Schedule Demo",
                ],
              };
              setMessages((prevMessages) => {
                if (!prevMessages.some((msg) => msg.buttons)) {
                  return [...prevMessages, buttonMessage];
                }
                return prevMessages;
              });
              setTimeout(() => animateBotReply(buttonMessage.id), 0);
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Error fetching bot reply:", error);
      } finally {
        setIsTyping(false);
      }
    }
  };  
  const handleButtonClick = (buttonText) => {
    resetTimers();
    startInactivityTimer();
    const buttonResponses = {
      "AI BOT Development": "I want to know about AI chatbots.",
      "Software Development": "I want to know about software development.",
      "DevOps & cloud computing": "I want to know about DevOps & Cloud computing.",
      "Schedule Demo": "I want to book a demo.",
    };
    const responseMessage = buttonResponses[buttonText] || "Sorry, I didn't understand that.";
    sendMessage(responseMessage);
  };
  // const splitMessage = (text, maxLength = 100) => {
  //   const chunks = [];
  //   let start = 0;
  //   while (start < text.length) {
  //     let end = start + maxLength;
  //     if (end < text.length) {
  //       const sentenceEndIndex = text.slice(end).search(/[.!?]/);
  //       if (sentenceEndIndex !== -1) {
  //         end += sentenceEndIndex + 1;
  //       } else {
  //         const nextSpaceIndex = text.slice(end).search(/\s/);
  //         if (nextSpaceIndex !== -1) {
  //           end += nextSpaceIndex;
  //         }
  //       }
  //     }
  //     chunks.push(text.substring(start, end).trim());
  //     start = end;
  //   }
  //   return chunks;
  // };
  const splitMessage = (text, maxLength = 100) => {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
      let end = start + maxLength;
      if (end < text.length) {
        const sentenceEndIndex = text.slice(end).search(/[.!?]/);
        if (sentenceEndIndex !== -1) {
          end += sentenceEndIndex + 1;
        } else {
          const nextSpaceIndex = text.slice(end).search(/\s/);
          if (nextSpaceIndex !== -1) {
            end += nextSpaceIndex;
          }
        }
      }  
      const chunk = text.substring(start, end).trim();
      if (chunk.length < 5 && end < text.length) {
        end += maxLength;
        const extendedChunk = text.substring(start, end).trim();
        if (extendedChunk.length > chunk.length) {
          chunks.push(extendedChunk);
          start = end;
          continue;
        }
      }
      chunks.push(chunk);
      start = end;
    }  
    return chunks;
  };  
  const fetchBotReply = async (message) => {
    const zoneTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
    const ip = await getVisitorIp();
    const data = {
      session_id: getSessionId(),
      message,
      Zone: "Asia/Karachi",
      zoneTime,
      ip: ip || "IP not available",
    };
    const response = await fetch("https://bot.devspandas.com/v1/devbot/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Failed to fetch bot reply");
    return response.json();
  };
  useEffect(() => {
    localStorage.removeItem("session_id");
    return () => resetTimers();
  }, []);
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
        };
        setMessages([greetingMessage]);
        setTimeout(() => animateBotReply(greetingMessage.id), 0);
        startInactivityTimer();
      } catch (error) {
        console.error("Error fetching greeting message:", error);
      }
    };
    fetchGreetingMessage();
  }, []);
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <>
      <ul ref={messagesContainerRef} className="messages">
        {messages.map((msg) =>
          msg.buttons ? (
            <div key={msg.id} id={`message-${msg.id}`} className="buttons-container">
              {msg.text && (
                <li className="other">
                  {msg.text}
                  <div className="timestamp">{msg.timestamp}</div>
                </li>
              )}
              <div className="btn-wrap">
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
        <button id="sendMessage" onClick={sendMessage} disabled={!currentMessage.trim()}>
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
// import { animateBotReply, getSessionId, getVisitorIp } from "./Function";
// function Message() {
//   const [messages, setMessages] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [waitingSent, setWaitingSent] = useState(false);
//   const [thankYouSent, setThankYouSent] = useState(false);
//   const messagesContainerRef = useRef(null);
//   const inputRef = useRef(null);
//   const timers = useRef({ waiting: null, thankYou: null });
//   const getTimestamp = () => {
//     const now = new Date();
//     const hours = now.getHours() % 12 || 12;
//     const minutes = String(now.getMinutes()).padStart(2, "0");
//     const ampm = now.getHours() >= 12 ? "pm" : "am";
//     return `${hours}:${minutes} ${ampm}`;
//   };
//   const getUniqueMessageId = () => Date.now();
//   const resetTimers = () => {
//     clearTimeout(timers.current.waiting);
//     clearTimeout(timers.current.thankYou);
//     timers.current.waiting = null;
//     timers.current.thankYou = null;
//     setWaitingSent(false);
//     setThankYouSent(false);
//   };
//   const startInactivityTimer = () => {
//     resetTimers();
//     timers.current.waiting = setTimeout(() => {
//       if (!waitingSent) {
//         showWaitingMessage();
//         setWaitingSent(true);
//       }
//       timers.current.thankYou = setTimeout(() => {
//         if (!thankYouSent) {
//           showThankYouMessage();
//           setThankYouSent(true);
//         }
//       }, 120000);
//     }, 120000);
//   };
//   const showWaitingMessage = () => {
//     const waitingMessage = {
//       sender: "bot",
//       text: "Are you still there? Feel free to ask any questions!",
//       timestamp: getTimestamp(),
//       id: getUniqueMessageId(),
//     };
//     setMessages((prevMessages) => [...prevMessages, waitingMessage]);
//   };
//   const showThankYouMessage = () => {
//     const thankYouMessage = {
//       sender: "bot",
//       text: "Thank you for visiting! The session has ended.",
//       timestamp: getTimestamp(),
//       id: getUniqueMessageId(),
//     };
//     setMessages((prevMessages) => [...prevMessages, thankYouMessage]);
//     localStorage.removeItem("session_id");
//   };
//   const sendMessage = async (message = currentMessage) => {
//     if (message.trim()) {
//       resetTimers();
//       startInactivityTimer();
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
//           const { main_response, follow_up_question, show_button } = botReply;
//           if (main_response?.trim()) {
//             const mainMessage = {
//               sender: "bot",
//               text: main_response.trim(),
//               timestamp: getTimestamp(),
//               id: getUniqueMessageId(),
//             };
//             setMessages((prevMessages) => [...prevMessages, mainMessage]);
//             setTimeout(() => animateBotReply(mainMessage.id), 0);
//           }
//           if (follow_up_question?.trim()) {
//             setTimeout(() => {
//               const followUpMessage = {
//                 sender: "bot",
//                 text: follow_up_question.trim(),
//                 timestamp: getTimestamp(),
//                 id: getUniqueMessageId(),
//               };
//               setMessages((prevMessages) => [...prevMessages, followUpMessage]);
//               setTimeout(() => animateBotReply(followUpMessage.id), 0);
//             }, 2000);
//           }
//           if (show_button) {
//             setTimeout(() => {
//               const buttonMessage = {
//                 sender: "bot",
//                 text: "",
//                 timestamp: getTimestamp(),
//                 id: getUniqueMessageId(),
//                 buttons: [
//                   "AI BOT Development",
//                   "Software Development",
//                   "DevOps & cloud computing",
//                   "Schedule Demo",
//                 ],
//               };
//               setMessages((prevMessages) => {
//                 if (!prevMessages.some((msg) => msg.buttons)) {
//                   return [...prevMessages, buttonMessage];
//                 }
//                 return prevMessages;
//               });
//               setTimeout(() => animateBotReply(buttonMessage.id), 0);
//             }, 2000);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching bot reply:", error);
//       } finally {
//         setIsTyping(false);
//       }
//     }
//   };
//   const handleButtonClick = (buttonText) => {
//     resetTimers();
//     startInactivityTimer();
//     const buttonResponses = {
//       "AI BOT Development": "I want to know about AI chatbots.",
//       "Software Development": "I want to know about software development.",
//       "DevOps & cloud computing": "I want to know about DevOps & Cloud computing.",
//       "Schedule Demo": "I want to book a demo.",
//     };
//     const responseMessage = buttonResponses[buttonText] || "Sorry, I didn't understand that.";
//     sendMessage(responseMessage);
//   };
//   const fetchBotReply = async (message) => {
//     const zoneTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
//     const ip = await getVisitorIp();
//     const data = {
//       session_id: getSessionId(),
//       message,
//       Zone: "Asia/Karachi",
//       zoneTime,
//       ip: ip || "IP not available",
//     };
//     const response = await fetch("https://bot.devspandas.com/v1/devbot/chat", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) throw new Error("Failed to fetch bot reply");
//     return response.json();
//   };
//   useEffect(() => {
//     localStorage.removeItem("session_id");
//     return () => resetTimers();
//   }, []);
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
//         startInactivityTimer();
//       } catch (error) {
//         console.error("Error fetching greeting message:", error);
//       }
//     };
//     fetchGreetingMessage();
//   }, []);
//   useEffect(() => {
//     const container = messagesContainerRef.current;
//     if (container) {
//       container.scrollTo({
//         top: container.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   }, [messages]);
//   return (
//     <>
//       <ul ref={messagesContainerRef} className="messages">
//         {messages.map((msg) =>
//           msg.buttons ? (
//             <div key={msg.id} id={`message-${msg.id}`} className="buttons-container">
//               {msg.text && (
//                 <li className="other">
//                   {msg.text}
//                   <div className="timestamp">{msg.timestamp}</div>
//                 </li>
//               )}
//               <div className="btn-wrap">
//                 {msg.buttons.map((buttonText, index) => (
//                   <button key={index} onClick={() => handleButtonClick(buttonText)}>
//                     {buttonText}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <li key={msg.id} id={`message-${msg.id}`} className={msg.sender === "user" ? "self" : "other"}>
//               {msg.text}
//               <div className="timestamp">{msg.timestamp}</div>
//             </li>
//           )
//         )}
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
//           onChange={(e) => setCurrentMessage(e.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               sendMessage();
//             }
//           }}
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
//       <p className="copyright-two">
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
// import { animateBotReply, getSessionId, getVisitorIp } from "./Function";
// function Message() {
//   const [messages, setMessages] = useState([]);
//   const [currentMessage, setCurrentMessage] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const [inactivityTimeout, setInactivityTimeout] = useState(null);
//   const [sessionEnded, setSessionEnded] = useState(false);
//   const messagesContainerRef = useRef(null);
//   const inputRef = useRef(null);
//   const getTimestamp = () => {
//     const now = new Date();
//     const hours = now.getHours() % 12 || 12;
//     const minutes = String(now.getMinutes()).padStart(2, "0");
//     const ampm = now.getHours() >= 12 ? "pm" : "am";
//     return `${hours}:${minutes} ${ampm}`;
//   };
//   const getUniqueMessageId = () => Date.now();
//   const sendMessage = async (message = currentMessage) => {
//     if (sessionEnded) {
//       localStorage.removeItem("session_id");
//       setSessionEnded(false);
//     }
//     resetInactivityTimer()
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
//         console.log("bot reply", botReply);
//         if (botReply) {
//           const mainResponse = botReply.main_response?.trim();
//           const followUpQuestion = botReply.follow_up_question?.trim();
//           const showButton = botReply.show_button === 1;
//           if (mainResponse) {
//             const mainResponseMessage = {
//               sender: "bot",
//               text: mainResponse,
//               timestamp: getTimestamp(),
//               id: getUniqueMessageId(),
//             };
//             setMessages((prevMessages) => [...prevMessages, mainResponseMessage]);
//             setTimeout(() => animateBotReply(mainResponseMessage.id), 0);
//           }
//           if (followUpQuestion) {
//             setTimeout(() => {
//               const followUpMessage = {
//                 sender: "bot",
//                 text: followUpQuestion,
//                 timestamp: getTimestamp(),
//                 id: getUniqueMessageId(),
//               };
//               setMessages((prevMessages) => [...prevMessages, followUpMessage]);
//               setTimeout(() => animateBotReply(followUpMessage.id), 0);
//             }, 2000);
//           }
//           if (showButton) {
//             setTimeout(() => {
//               const buttonMessage = {
//                 sender: "bot",
//                 text: "",
//                 timestamp: getTimestamp(),
//                 id: getUniqueMessageId(),
//                 buttons: [
//                   "AI BOT Development",
//                   "Software Development",
//                   "DevOps & cloud computing",
//                   "Schedule Demo",
//                 ],
//               };
//               setMessages((prevMessages) => {
//                 const updatedMessages = [...prevMessages];
//                 if (!prevMessages.some(msg => msg.buttons)) {
//                   updatedMessages.push(buttonMessage);
//                 }
//                 return updatedMessages;
//               });
//               setTimeout(() => animateBotReply(buttonMessage.id), 0);
//             }, 2000);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching bot reply:", error);
//       } finally {
//         setIsTyping(false);
//       }
//     }
//   };
//   const resetInactivityTimer = () => {
//     if (inactivityTimeout) {
//       clearTimeout(inactivityTimeout);
//     }
//     const timeout = setTimeout(() => {
//       showWaitingMessage();
//       const thankYouTimeout = setTimeout(() => {
//         showThankYouMessage();
//         setSessionEnded(true);
//       }, 180000);
//       setInactivityTimeout(thankYouTimeout);
//     }, 180000);

//     setInactivityTimeout(timeout);
//   };
//   const showWaitingMessage = () => {
//     const waitingMessage = {
//       sender: "bot",
//       text: "Are you still there? Feel free to ask any questions!",
//       timestamp: getTimestamp(),
//       id: getUniqueMessageId(),
//     };
//     setMessages((prevMessages) => [...prevMessages, waitingMessage]);
//   };
//   const showThankYouMessage = () => {
//     const thankYouMessage = {
//       sender: "bot",
//       text: "Thank you for visiting! The session has ended.",
//       timestamp: getTimestamp(),
//       id: getUniqueMessageId(),
//     };
//     setMessages((prevMessages) => [...prevMessages, thankYouMessage]);
//     localStorage.removeItem("session_id");
//   };
//   const fetchBotReply = async (message) => {
//     const zoneTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" });
//     const ip = await getVisitorIp();
//     const data = {
//       session_id: getSessionId(),
//       message,
//       Zone: "Asia/Karachi",
//       zoneTime,
//       ip: ip || "IP not available",
//     };
//     console.log('message data', data);
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
//     return response.json();
//   };
//   const handleButtonClick = (buttonText) => {
//     if (sessionEnded) {
//       localStorage.removeItem("session_id");
//       setSessionEnded(false);
//     }
//     resetInactivityTimer();
//     let responseMessage = "";
//     const buttonMessages = {
//       "AI BOT Development": "I want to know about AI chatbots.",
//       "Software Development": "I want to know about software development",
//       "DevOps & cloud computing": "I want to know about the DevOps & Cloud computing",
//       "Schedule Demo": "I want to book a demo"
//     };
//     if (buttonMessages[buttonText]) {
//       responseMessage = buttonMessages[buttonText];
//     } else {
//       responseMessage = "Sorry, I didn't understand that request.";
//     }
//     sendMessage(responseMessage);
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
//     localStorage.removeItem('session_id');
//   }, []);
//   useEffect(() => {
//     return () => {
//       if (inactivityTimeout) {
//         clearTimeout(inactivityTimeout);
//       }
//     };
//   }, [inactivityTimeout]);
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
//         resetInactivityTimer();
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
//           msg.buttons ? (
//             <div key={msg.id} id={`message-${msg.id}`} className="buttons-container">
//               {msg.text && (
//                 <li className="other">
//                   {msg.text}
//                   <div className="timestamp">{msg.timestamp}</div>
//                 </li>
//               )}
//               <div className="btn-wrap">
//                 {msg.buttons.map((buttonText, index) => (
//                   <button key={index} onClick={() => handleButtonClick(buttonText)}>
//                     {buttonText}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ) : (
//             <li key={msg.id} id={`message-${msg.id}`} className={msg.sender === "user" ? "self" : "other"}>
//               {msg.text}
//               <div className="timestamp">{msg.timestamp}</div>
//             </li>
//           )
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
//           onChange={(e) => setCurrentMessage(e.target.value)}
//           onKeyPress={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               sendMessage();
//             }
//           }}
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
//       <p className="copyright-two">
//         Powered by <img src={powerby} alt="Powered by logo" />
//       </p>
//     </>
//   );
// }
// export default Message;