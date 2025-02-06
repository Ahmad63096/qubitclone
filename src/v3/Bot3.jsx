import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from './assets/images/avatar-2.png'; // Replace with your bot avatar image path

// Function to generate a session ID (you can replace this with your own logic)
const getSessionId = () => {
  return "session-" + Math.random().toString(36).substr(2, 9);
};

// Function to fetch the bot's reply from the API
const fetchBotReply = async (data) => {
  try {
    const response = await fetch('https://0dc9-116-58-22-198.ngrok-free.app/v1/ecom/ecom_chat', {
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

function ChatBot() {
  const [messages, setMessages] = useState([
    { type: "text", text: "Hello! How can I help you?", sender: "bot" }
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the last message on every update.
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    // Prevent sending if the input is empty
    if (!userMessage.trim()) return;

    // Add the user's message to the chat
    const newMessages = [...messages, { type: "text", text: userMessage, sender: "user" }];
    setMessages(newMessages);

    // Build your data object dynamically:
    const data = {
      session_id: getSessionId(),
      message: userMessage,
      Zone: "Asia/Karachi",
      zoneTime: new Date().toLocaleString("en-US", { timeZone: "Asia/Karachi" }),
      ip: "116.58.22.198",
    };

    // Clear the input field
    setUserMessage("");

    try {
      const reply = await fetchBotReply(data);
      console.log("Full API reply:", reply);
    
      // Build an array of messages conditionally
      const messagesToAdd = [];
    
      // Add response content only if it's not empty.
      if (reply.response_content && reply.response_content.trim() !== "") {
        messagesToAdd.push({ type: "text", text: reply.response_content, sender: "bot" });
      }
    
      // Add product suggestions only if the array exists and has items.
      if (reply.product_suggestions && reply.product_suggestions.length > 0) {
        messagesToAdd.push({ type: "products", products: reply.product_suggestions, sender: "bot" });
      }
    
      // Add follow-up question only if it's not empty.
      if (reply.follow_up_question && reply.follow_up_question.trim() !== "") {
        messagesToAdd.push({ type: "text", text: reply.follow_up_question, sender: "bot" });
      }
    
      // Append the new messages to the chat
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

  // Function to toggle chat open/closed.
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

  return (
    <div>
      {/* Chat Toggle Button */}
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
            <div className="chat-title" style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
              <h1 style={{ margin: 0, fontSize: "18px" }}>Qubit Commerce</h1>
              <figure className="avatar" style={{ margin: 0 }}>
                <img src={logo} alt="Bot Avatar" style={{ width: "30px", height: "30px", borderRadius: "50%" }} />
              </figure>
            </div>
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "10px",
              }}
            >
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  style={{
                    marginBottom: "10px",
                    display: "flex",
                    flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                    alignItems: "flex-start",
                  }}
                >
                  {msg.sender === "bot" && (
                    <img
                      src={logo}
                      alt="Bot Avatar"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        marginRight: msg.sender === "user" ? "0" : "10px",
                        border: '1px solid #00000066'
                      }}
                    />
                  )}

                  {msg.type === "text" && (
                    <div
                      style={{
                        background: msg.sender === "user" ? "#00c853" : "#37474f",
                        color: "#fff",
                        padding: "8px 12px",
                        borderRadius: "5px",
                        maxWidth: "70%",
                        boxShadow: msg.sender === "user" ? "" : "0px 8px 32px -6px rgba(15,15,15,1)",
                        wordBreak: "break-word",
                      }}
                    >
                      {msg.text}
                    </div>
                  )}

                  {msg.type === "products" && (
                    // Product suggestions slider
                    <div
                      style={{
                        background: "#37474f",
                        borderRadius: "5px",
                        padding: "10px",
                        maxWidth: "70%",
                        overflowX: "auto",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      {msg.products.map((product, idx) => (
                        <div
                          key={idx}
                          style={{
                            minWidth: "200px",
                            background: "#fff",
                            color: "#000",
                            borderRadius: "5px",
                            padding: "10px",
                            textAlign: "center",
                            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.product_name}
                            style={{ width: "100%", height: "auto", borderRadius: "5px" }}
                          />
                          <h4 style={{ margin: "10px 0 5px", fontSize: "16px" }}>
                            {product.product_name}
                          </h4>
                          <p style={{ fontSize: "14px", margin: "5px 0" }}>
                            {product.description}
                          </p>
                          <p style={{ fontWeight: "bold", margin: "5px 0" }}>
                            ${product.price}
                          </p>
                        </div>
                      ))}
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
                backgroundColor: "#37474f",
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
                  backgroundColor: "#00c853",
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

export default ChatBot;






























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