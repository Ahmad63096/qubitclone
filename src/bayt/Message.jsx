import { useState, useRef, useEffect } from "react";
import powerby from "./assets/images/footerlogo.png";
import typing from "./assets/images/typing.gif";
import { animateBotReply, fetchBotReply, getTimestamp, splitMessage } from "./Function";
import { fetchControlPanelSettings } from "../components/Function";
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
          const { main_response, follow_up_question } = botReply;
          const displayMessages = async (response) => {
            if (response?.trim()) {
              const messages = splitMessage(response.trim());
              for (let index = 0; index < messages.length; index++) {
                const chunk = messages[index];
                await new Promise((resolve) =>
                  setTimeout(() => {
                    const botMessage = {
                      sender: "bot",
                      text: chunk,
                      timestamp: getTimestamp(),
                      id: getUniqueMessageId() + index,
                    };
                    setMessages((prevMessages) => [...prevMessages, botMessage]);
                    setTimeout(() => animateBotReply(botMessage.id), 0);
                    resolve();
                  }, index * 1000)
                );
              }
            }
          };
          if (Array.isArray(main_response)) {
            main_response.forEach((product, index) => {
              const productMessage = {
                sender: "bot",
                text: product.response_content,
                image: product.images || null,
                timestamp: getTimestamp(),
                id: getUniqueMessageId() + index,
              };
              setMessages((prevMessages) => [...prevMessages, productMessage]);
            });
          } else if (main_response?.trim()) {
            await displayMessages(main_response);
          }
          if (follow_up_question?.trim()) {
            const followUpMessage = {
              sender: "bot",
              text: follow_up_question,
              timestamp: getTimestamp(),
              id: getUniqueMessageId(),
            };
            setMessages((prevMessages) => [...prevMessages, followUpMessage]);
          }
        }
      } catch (error) {
        console.error("Error fetching bot reply:", error);
      } finally {
        setIsTyping(false);
      }
    }
  };
  useEffect(() => {
    localStorage.removeItem("session_id");
    return () => resetTimers();
  }, []);
  useEffect(() => {
    const fetchGreetingMessage = async () => {
      try {
        const greeting = await fetchControlPanelSettings('qubit_ecom');
        console.log("greeting data: ", greeting.data.settings.greeting_message);
        const data = greeting.data.settings.greeting_message;
        const greetingMessage = {
          sender: "bot",
          text: data,
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
      <ul ref={messagesContainerRef} className="messages-v3">
        {messages.map((msg) =>
          msg.image ? (
            <div key={msg.id} id={`message-${msg.id}`} className="product-message">
              <li className="other-v3">
                {msg.text}
                <div className="timestamp-v3">{msg.timestamp}</div>
              </li>
              <li className="other-v3">
                <img src={msg.image} alt="Product Image" className="product-image" />
                <div className="button-group">
                  <button className="button">Add to Cart</button>
                  <button className="button">Checkout</button>
                </div>
              </li>
            </div>
          ) : (
            <li key={msg.id} id={`message-${msg.id}`} className={msg.sender === "user" ? "self-v3" : "other-v3"}>
              {msg.text}
              <div className="timestamp-v3">{msg.timestamp}</div>
            </li>
          )
        )}
      </ul>
      {isTyping && (
        <li className="typing-v3">
          <img src={typing} alt="Typing indicator" />
        </li>
      )}
      <div className="footer-v3">
        <textarea
          ref={inputRef}
          className="text-box-v3"
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
        <button id="fileadd-v3">
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
      <p className="copyright-two-v3">
        Powered by <img src={powerby} alt="Powered by logo" />
      </p>
    </>
  );
}
export default Message;