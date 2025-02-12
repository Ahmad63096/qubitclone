import React, { useState, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatArea from "./ChatArea";
import ChatInput from "./ChatInput";
import footerlogo from "../assets/footerlogo.2594dd465ba2d84c4a42.png";
import { fetchControlPanelSettings, getSessionId } from "../../components/Function";

const ChatInterface = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [greetingMessage, setGreetingMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [sessionId] = useState(getSessionId());
  const [zone, setZone] = useState("");
  const [zoneTime, setZoneTime] = useState("");
  const [ip, setIp] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await fetchControlPanelSettings("qubit_ecom");
        if (settings?.data?.settings?.greeting_message) {
          setGreetingMessage(settings.data.settings.greeting_message);
        } else {
          setGreetingMessage("Hello! How can I assist you today?"); // Fallback message
        }
      } catch (error) {
        console.error("Error fetching control panel settings:", error);
        setGreetingMessage("Hello! How can I assist you today?");
      }
    };

    fetchSettings();
  }, []);

  // Update messages only when greetingMessage is set
  useEffect(() => {
    if (greetingMessage) {
      setMessages([{ text: greetingMessage, sender: "bot", isLoading: false }]);
    }
  }, [greetingMessage]);

  useEffect(() => {
    localStorage.removeItem("session_id");
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localTime = new Date().toLocaleString("en-US", { timeZone });
    setZone(timeZone);
    setZoneTime(localTime);

    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };

    fetchIp();
  }, []);
  const handleCloseChat = () => {
    onClose();
  };

  const handleUserInput = (e) => setUserInput(e.target.value);

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      const newMessages = [...messages, { text: userInput, sender: "user" }];
      setMessages(newMessages);
      setUserInput("");
      setIsBotTyping(true);

      try {
        const payload = {
          session_id: sessionId,
          message: userInput,
          Zone: zone,
          zoneTime,
          ip,
        };

        console.log("Payload Data:", payload);

        const response = await fetch("https://60ab-116-58-22-198.ngrok-free.app/v1/ecom/ecom_chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log("Response Data:", data);

        const botResponses = data.main_response.map((item) => ({
          text: item.response_content,
          image: item.images,
          sender: "bot",
          isLoading: false,
        }));

        const followUpQuestion = {
          text: data.follow_up_question,
          sender: "bot",
          isLoading: false,
        };

        setMessages([...newMessages, ...botResponses, followUpQuestion]);
      } catch (error) {
        console.error("Error fetching bot response:", error);
        setMessages([
          ...newMessages,
          { text: "Oops! Something went wrong. Please try again.", sender: "bot", isLoading: false },
        ]);
      } finally {
        setIsBotTyping(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 h-[600px] rounded-lg shadow-2xl flex flex-col border border-gray-300 z-50 animate-chatOpen">
      <ChatHeader
        onClose={handleCloseChat}
        resetMessages={() => setMessages([{ text: greetingMessage, sender: "bot", isLoading: false }])}
      />
      <ChatArea messages={messages} isBotTyping={isBotTyping} />
      <ChatInput
        userInput={userInput}
        handleUserInput={handleUserInput}
        handleKeyPress={handleKeyPress}
        handleSendMessage={handleSendMessage}
      />
      <div className="flex justify-center px-2 pt-2 text-gray-400 bg-gradient-to-b from-fuchsia-200 to-white">
        <p className="text-xs pb-3">
          Powered by{" "}
          <span>
            <img className="w-16 inline-block" src={footerlogo} alt="Footer Logo" />
          </span>
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;



























// import React, { useState, useEffect } from "react";
// import ChatHeader from "./ChatHeader";
// import ChatArea from "./ChatArea";
// import ChatInput from "./ChatInput";
// import footerlogo from '../assets/footerlogo.2594dd465ba2d84c4a42.png'
// import { getSessionId } from "../../components/Function";

// const ChatInterface = ({ onClose }) => {
//   const [messages, setMessages] = useState(() => {
//     const savedMessages = localStorage.getItem("chatMessages");
//     return savedMessages
//       ? JSON.parse(savedMessages)
//       : [
//         { text: "Hello! How can I assist you today?", sender: "bot", isLoading: false },
//       ];
//   });

//   useEffect(() => {
//     if (messages.length > 0) {
//       localStorage.setItem("chatMessages", JSON.stringify(messages));
//     }
//   }, [messages]);

//   const handleCloseChat = () => {
//     onClose();
//     localStorage.setItem("chatMessages", JSON.stringify(messages)); // Store messages when chat is closed
//   };

//   useEffect(() => {
//     const storedMessages = localStorage.getItem("chatMessages");
//     if (storedMessages) {
//       setMessages(JSON.parse(storedMessages));
//     }
//   }, []);

//   const resetMessages = () => {
//     setMessages([{ text: "Hello! How can I assist you today?", sender: "bot", isLoading: false }]);
//   };

//   const [userInput, setUserInput] = useState("");
//   const [isBotTyping, setIsBotTyping] = useState(false);
//   const [sessionId] = useState( getSessionId() );
//   const [zone, setZone] = useState("");
//   const [zoneTime, setZoneTime] = useState("");
//   const [ip, setIp] = useState("");
//   useEffect(() => {
//     const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
//     const localTime = new Date().toLocaleString("en-US", {
//       timeZone,
//     });

//     setZone(timeZone);
//     setZoneTime(localTime);
//     const fetchIp = async () => {
//       try {
//         const response = await fetch("https://api.ipify.org?format=json");
//         const data = await response.json();
//         setIp(data.ip);
//       } catch (error) {
//         console.error("Error fetching IP:", error);
//       }
//     };

//     fetchIp();
//   }, []);
//   const handleUserInput = (e) => setUserInput(e.target.value);
//   const handleSendMessage = async () => {
//     if (userInput.trim()) {
//       const newMessages = [...messages, { text: userInput, sender: "user" }];
//       setMessages(newMessages);
//       setUserInput("");
//       setIsBotTyping(true);
//       try {
//         const payload = {
//           session_id: sessionId,
//           message: userInput,
//           Zone: zone,
//           zoneTime,
//           ip,
//         };
//         console.log('payload data:', payload);
//         const response = await fetch("https://d6d9-103-150-242-99.ngrok-free.app/v1/ecom/ecom_chat", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         });
//         const data = await response.json();
//         console.log('data:', data);
//         const botResponses = data.main_response.map((item) => ({
//           text: item.response_content,
//           image: item.images,
//           sender: "bot",
//           isLoading: false,
//         }));
//         const followUpQuestion = {
//           text: data.follow_up_question,
//           sender: "bot",
//           isLoading: false,
//         };
//         setMessages([...newMessages, ...botResponses, followUpQuestion]);
//       } catch (error) {
//         console.error("Error fetching bot response:", error);
//         setMessages([
//           ...newMessages,
//           { text: "Oops! Something went wrong. Please try again.", sender: "bot", isLoading: false },
//         ]);
//       } finally {
//         setIsBotTyping(false);
//       }
//     }
//   };
//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") handleSendMessage();
//   };

//   return (
//     <div className="fixed bottom-5 right-5 w-80 h-[600px] rounded-lg shadow-2xl flex flex-col border border-gray-300 z-50 animate-chatOpen ">
//       <ChatHeader onClose={onClose} resetMessages={resetMessages} />
//       <ChatArea messages={messages} isBotTyping={isBotTyping} />
//       <ChatInput
//         userInput={userInput}
//         handleUserInput={handleUserInput}
//         handleKeyPress={handleKeyPress}
//         handleSendMessage={handleSendMessage}
//       />
//       <div className="flex justify-center px-2 pt-2 text-gray-400 bg-gradient-to-b from-fuchsia-200 to-white "  >
//         <p className="text-xs pb-3">
//           Powered by{" "}
//           <span>
//             <img className="w-16 inline-block" src={footerlogo} alt="Footer Logo" />
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;