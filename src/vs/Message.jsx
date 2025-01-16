import { useState, useRef, useEffect } from "react";
import './assets/css/message.css';
import powerby from "./assets/images/footerlogo.png";
import typing from "./assets/images/typing.gif";
import { animateBotReply, getSessionId, getTimestamp, getVisitorIp, splitMessage } from "./Function";
function Message() {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [waitingSent, setWaitingSent] = useState(false);
  const [thankYouSent, setThankYouSent] = useState(false);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const timers = useRef({ waiting: null, thankYou: null });
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
    }, 600000);
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
        console.log("Bot reply:", botReply);
        if (botReply) {
          const { main_response, follow_up_question, show_button } = botReply;
          const displayMessages = async (response) => {
            if (response?.trim()) {
              const messages = splitMessage(response.trim());
              for (let index = 0; index < messages.length; index++) {
                const chunk = messages[index];
                await new Promise((resolve) =>
                  setTimeout(() => {
                    const message = {
                      sender: "bot",
                      text: chunk,
                      timestamp: getTimestamp(),
                      id: getUniqueMessageId() + index,
                    };
                    setMessages((prevMessages) => [...prevMessages, message]);
                    setTimeout(() => animateBotReply(message.id), 0);
                    resolve();
                  }, index * 1000)
                );
              }
            }
          };
          if (main_response?.trim() || follow_up_question?.trim()) {
            if (main_response?.trim()) {
              await displayMessages(main_response, "main_response");
            }
            if (follow_up_question?.trim()) {
              await displayMessages(follow_up_question, "follow_up_question");
            }
          }
          console.log("show button", show_button);
          if (show_button === 1) {
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
              setMessages((prevMessages) => [...prevMessages, buttonMessage]);
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
    const response = await fetch("https://bot.devspandas.com/v1/qubit/qubit_core", {
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
        console.log("data: ", data);
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
          placeholder="write message"
          rows={1}
          autoFocus
        />
        <button id="fileadd">
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
      <p className="copyright-two">
        Powered by <img src={powerby} alt="Powered by logo" />
      </p>
    </>
  );
}
export default Message;