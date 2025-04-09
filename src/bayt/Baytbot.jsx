import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from './assets/images/avatar-2.png';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const getSessionId = () => {
  return "session-" + Math.random().toString(36).substr(2, 9);
};
const fetchBotReply = async (data) => {
  try {
    const response = await fetch(import.meta.env.VITE_BAYT_CHAT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching bot reply:', error);
    throw error;
  }
};
function BaytBot() {
  const [messages, setMessages] = useState([
    { type: "text", text: "Hello! How can I help you?", sender: "bot" }
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const sendMessage = async () => {
    if (!userMessage.trim()) return;
    const newMessages = [...messages, { type: "text", text: userMessage, sender: "user" }];
    setMessages(newMessages);
    const data = {
      session_id: getSessionId(),
      message: userMessage,
      Zone: "Asia/Karachi",
      zoneTime: new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }),
      ip: "116.58.22.198",
    };
    setUserMessage("");
    try {
      const reply = await fetchBotReply(data);
      console.log("Full API reply:", reply);
      const messagesToAdd = [];
      if (reply.response_content && reply.response_content.trim() !== "") {
        messagesToAdd.push({ type: "text", text: reply.response_content, sender: "bot" });
      }
      if (reply.product_suggestions && reply.product_suggestions.length > 0) {
        messagesToAdd.push({ type: "products", products: reply.product_suggestions, sender: "bot" });
      }
      if (reply.follow_up_question && reply.follow_up_question.trim() !== "") {
        messagesToAdd.push({ type: "text", text: reply.follow_up_question, sender: "bot" });
      }
      setMessages(prevMessages => [
        ...prevMessages,
        ...messagesToAdd
      ]);
    } catch (error) {
      console.error("Error fetching bot reply:", error);
      setMessages(prevMessages => [
        ...prevMessages,
        { type: "text", text: "Sorry, there was an error. Please try again later.", sender: "bot" }
      ]);
    }
  };
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  const chatWindowVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } }
  };
  const messageVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerPadding: '0px',
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <div>
      <div
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          backgroundColor: "#007bff",
          color: "white",
          borderRadius: "50%",
          padding: "15px",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          fontSize: "20px",
        }}
      >
        💬
      </div>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            variants={chatWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: "fixed",
              bottom: "70px",
              right: "20px",
              width: "350px",
              height: "550px",
              border: "1px solid #ccc",
              borderRadius: "10px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff"
            }}
          >
            <div className="chat-title" style={{ color: 'white', backgroundColor: '#133b3b' }}>
              <h1 style={{ margin: 0, fontSize: "18px" }}>Bayt Bot</h1>
              {/* <figure className="avatar" style={{ margin: 0 }}>
                <img src={logo} alt="Bot Avatar" style={{ width: "30px", height: "30px", borderRadius: "50%" }} />
              </figure> */}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "10px", }}>
              {messages.map((msg, index) => (
                <motion.div key={index} variants={messageVariants} initial="hidden" animate="visible" style={{ marginBottom: "10px", display: "flex", flexDirection: msg.sender === "user" ? "row-reverse" : "row", alignItems: "flex-start", }}>
                  {msg.sender === "bot" && (
                    <img src={logo} alt="Bot Avatar" style={{ width: "30px", height: "30px", borderRadius: "50%", marginRight: msg.sender === "user" ? "0" : "10px", border: '1px solid #00000066' }} />
                  )}
                  {msg.type === "text" && (
                    <div
                      style={{
                        width: msg.sender === "user" ? '' : '100%',
                        background: msg.sender === "user" ? "#133b3b" : "#eee",
                        color: msg.sender === "user" ? "#fff" : '',
                        border: msg.sender === "user" ? 'none' : "1px solid #00000038",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        maxWidth: "70%",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </div>
                  )}
                  {msg.type === "products" && (
                    <div
                      style={{
                        width: "75%",
                      }}
                    >
                      <Slider
                        {...sliderSettings}
                        key={msg.products.length}
                      >
                        {msg.products.map((product, idx) => (
                          <div key={idx} style={{ padding: "0 5px", width: '100px' }}>
                            <div
                              style={{
                                background: "#fff",
                                color: "#000",
                                borderRadius: "5px",
                                padding: "10px",
                                textAlign: "center",
                                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                height: "100%",
                              }}
                            >
                              <img
                                src={product.image}
                                alt={product.product_name}
                                style={{
                                  width: "100%",
                                  height: "150px",
                                  objectFit: "cover",
                                  borderRadius: "5px"
                                }}
                              />
                              <p style={{ fontSize: '14px', textAlign: 'justify' }}>{product.product_name}</p>
                              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', margin: '10px 0' }}>
                                <span>Price:</span><span>${product.price}</span>
                              </div>
                              <button style={{ backgroundColor: 'rgb(19, 59, 59)', color: 'white', padding: '8px 30px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Add To Cart</button>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                  )}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div
              style={{
                display: "flex",
                padding: "10px",
                borderTop: "1px solid #ccc",
              }}
            >
              <input
                type="text"
                placeholder="Type a message..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                style={{
                  flex: 1,
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: "8px",
                  outline: "none",
                  marginRight: "10px",
                }}
              />
              <button
                onClick={sendMessage}
                style={{
                  backgroundColor: "#133b3b",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "8px 12px",
                  cursor: "pointer",
                }}
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default BaytBot






























// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import logo from './assets/images/avatar-2.png';
// const getSessionId = () => {
//   return "session-" + Math.random().toString(36).substr(2, 9);
// };
// const fetchBotReply = async (data) => {
//   try {
//     const response = await fetch('https://0dc9-116-58-22-198.ngrok-free.app/v1/ecom/ecom_chat', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     const result = await response.json();
//     return result;
//   } catch (error) {
//     console.error('Error fetching bot reply:', error);
//     throw error;
//   }
// };
// function ChatBot() {
//   const [messages, setMessages] = useState([
//     { text: "Hello! How can I help you?", sender: "bot" }
//   ]);
//   const [userMessage, setUserMessage] = useState("");
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const messagesEndRef = useRef(null);
//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [messages]);
//   const sendMessage = async () => {
//     if (!userMessage.trim()) return;
//     const newMessages = [...messages, { text: userMessage, sender: "user" }];
//     setMessages(newMessages);
//     const data = {
//       session_id: getSessionId(),
//       message: userMessage,
//       Zone: "Asia/Karachi",
//       zoneTime: new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }),
//       ip: "116.58.22.198",
//     };
//     setUserMessage("");
//     try {
//       const reply = await fetchBotReply(data);
//       console.log("Full API reply:", reply);
//       console.log("Response Content:", reply.response_content);
//       console.log("Follow Up Question:", reply.follow_up_question);
//       setMessages(prevMessages => [
//         ...prevMessages,
//         { text: reply.response_content, sender: "bot" },
//         { text: reply.follow_up_question, sender: "bot" }
//       ]);
//     } catch (error) {
//       console.error("Error fetching bot reply:", error);
//       setMessages(prevMessages => [
//         ...prevMessages,
//         { text: "Sorry, there was an error. Please try again later.", sender: "bot" }
//       ]);
//     }
//   };
//   const toggleChat = () => setIsChatOpen(!isChatOpen);
//   const chatWindowVariants = {
//     hidden: { opacity: 0, scale: 0.8, y: 50 },
//     visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
//     exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } }
//   };
//   const messageVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
//   };
//   return (
//     <div>
//       <div
//         onClick={toggleChat}
//         style={{
//           position: "fixed",
//           bottom: "20px",
//           right: "20px",
//           backgroundColor: "#007bff",
//           color: "white",
//           borderRadius: "50%",
//           padding: "15px",
//           cursor: "pointer",
//           boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
//           fontSize: "20px",
//         }}
//       >
//         💬
//       </div>
//       <AnimatePresence>
//         {isChatOpen && (
//           <motion.div
//             variants={chatWindowVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             style={{
//               position: "fixed",
//               bottom: "70px",
//               right: "20px",
//               width: "350px",
//               height: "550px",
//               border: "1px solid #ccc",
//               borderRadius: "10px",
//               boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
//               display: "flex",
//               flexDirection: "column",
//               backgroundColor: "#fff"
//             }}
//           >
//             <div className="chat-title">
//               <h1>Qubit Commerce</h1>
//               <figure className="avatar">
//                 <img src={logo} alt="Bot Avatar" />
//               </figure>
//             </div>
//             <div
//               style={{
//                 flex: 1,
//                 overflowY: "auto",
//                 padding: "10px",
//               }}
//             >
//               {messages.map((msg, index) => (
//                 <motion.div
//                   key={index}
//                   variants={messageVariants}
//                   initial="hidden"
//                   animate="visible"
//                   style={{
//                     marginBottom: "10px",
//                     display: "flex",
//                     flexDirection: msg.sender === "user" ? "row-reverse" : "row",
//                     alignItems: "center",
//                   }}
//                 >
//                   {msg.sender === "bot" && (
//                     <img
//                       src={logo}
//                       alt="Bot Avatar"
//                       style={{
//                         width: "30px",
//                         height: "30px",
//                         borderRadius: "50%",
//                         marginRight: msg.sender === "user" ? "0" : "10px",
//                         border: '1px solid #00000066'
//                       }}
//                     />
//                   )}
//                   <div
//                     style={{
//                       background: msg.sender === "user" ? "#00c853" : "#37474f",
//                       color: "#fff",
//                       padding: "8px 12px",
//                       borderRadius: "5px",
//                       maxWidth: "70%",
//                       boxShadow: msg.sender === "user" ? "" : "0px 8px 32px -6px rgba(15,15,15,1)",
//                       wordBreak: "break-word",
//                     }}
//                   >
//                     {msg.text}
//                   </div>
//                 </motion.div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 padding: "10px",
//                 borderTop: "1px solid #ccc",
//                 backgroundColor: "#37474f",
//               }}
//             >
//               <input
//                 type="text"
//                 placeholder="Type a message..."
//                 value={userMessage}
//                 onChange={(e) => setUserMessage(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     e.preventDefault();
//                     sendMessage();
//                   }
//                 }}
//                 style={{
//                   flex: 1,
//                   border: "1px solid #ccc",
//                   borderRadius: "5px",
//                   padding: "8px",
//                   outline: "none",
//                   marginRight: "10px",
//                 }}
//               />
//               <button
//                 onClick={sendMessage}
//                 style={{
//                   backgroundColor: "#00c853",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "5px",
//                   padding: "8px 12px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Send
//               </button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }
// export default ChatBot;