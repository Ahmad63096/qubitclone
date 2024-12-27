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
        console.log('boot reply', botReply);
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
                if (index === mainMessages.length - 1 && follow_up_question?.trim()) {
                  const followUpMessages = splitMessage(follow_up_question.trim());
                  followUpMessages.forEach((questionChunk, qIndex) => {
                    setTimeout(() => {
                      const followUpMessage = {
                        sender: "bot",
                        text: questionChunk,
                        timestamp: getTimestamp(),
                        id: getUniqueMessageId() + qIndex,
                      };
                      setMessages((prevMessages) => [...prevMessages, followUpMessage]);
                      setTimeout(() => animateBotReply(followUpMessage.id), 0);
                    }, qIndex * 1000);
                  });
                }
              }, index * 1000);
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
  const splitMessage = (text, maxLength = 100) => {
    const chunks = [];
    let start = 0;
    const isEmoji = (char) => {
      const emojiRegex = /[\u231A-\u231B\u23E9-\u23EF\u23F0-\u23F3\u25FD-\u25FE\u2614-\u2615\u2648-\u2653\u267B-\u267F\u2692-\u269C\u26A1-\u26AA\u26AB\u26C4-\u26C5\u26CE\u26D4\u26EA\u26F2-\u26F3\u26F5-\u26F6\u26F9\u26FA\u26FD\u2702-\u2705\u2708-\u270D\u2728\u2744-\u2747\u274C-\u274E\u2753-\u2755\u2757\u2764\u2B50\u2B55\u2934-\u2935\u2B06-\u2B07\u2B1B-\u2B1C\u2B50\u3030\u303D\u3297\u3299\u1F004\u1F0CF\u1F170-\u1F171\u1F17E-\u1F17F\u1F18E\u1F191-\u1F19A\u1F1E6-\u1F1FF\u1F201-\u1F202\u1F21A\u1F22F\u1F232-\u1F236\u1F238-\u1F23A\u1F250-\u1F251\u1F300-\u1F321\u1F324-\u1F393\u1F396-\u1F397\u1F399-\u1F39B\u1F39E-\u1F3F0\u1F3F3-\u1F3F5\u1F3F7-\u1F3FA\u1F400-\u1F43E\u1F440\u1F442-\u1F4F7\u1F4F9-\u1F4FC\u1F4FF\u1F500-\u1F53D\u1F54B-\u1F54E\u1F550-\u1F567\u1F57A\u1F595-\u1F596\u1F5A4-\u1F5A5\u1F5A8-\u1F5BC\u1F5C2-\u1F5D2\u1F5E1\u1F5E3-\u1F5E8\u1F5EF\u1F5F3\u1F5FA-\u1F5FF\u1F600-\u1F64F\u1F680-\u1F6C5\u1F6CC\u1F6D0-\u1F6D2\u1F6E0-\u1F6E5\u1F6EB-\u1F6EC\u1F6F0-\u1F6F3\u1F910-\u1F91E\u1F920-\u1F927\u1F930-\u1F939\u1F93C-\u1F93E\u1F940-\u1F945\u1F947-\u1F94C\u1F950-\u1F96B\u1F980-\u1F991\u1F9C0\u1F9D0-\u1F9E6\u1FA70-\u1FA73\u1FA78-\u1FA7A\u1FA80-\u1FA82\u1FA90-\u1FA95]/;
      return emojiRegex.test(char);
    };
    // const isEmoji = (char) => {
    //   const emojiRegex =
    //     /[\u203C-\u3299\u1F004-\u1F0CF\u1F170-\u1F9FF\uDC00-\uDFFF\u200D\uFE0F\u2000-\u200A]/;
    //   return emojiRegex.test(char);
    // };

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

      let chunk = text.substring(start, end).trim();

      // Ensure that the first character of the next line is not an emoji
      if (end < text.length && isEmoji(text[end])) {
        const lastSpaceIndex = chunk.lastIndexOf(" ");
        if (lastSpaceIndex !== -1) {
          end = start + lastSpaceIndex;
          chunk = text.substring(start, end).trim();
        }
      }

      // Add the chunk to the list
      chunks.push(chunk);
      start = end;
    }

    return chunks;
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
  //     const chunk = text.substring(start, end).trim();
  //     if (chunk.length < 10 && end < text.length) {
  //       end += maxLength;
  //       const extendedChunk = text.substring(start, end).trim();
  //       if (extendedChunk.length > chunk.length) {
  //         chunks.push(extendedChunk);
  //         start = end;
  //         continue;
  //       }
  //     }
  //     chunks.push(chunk);
  //     start = end;
  //   }
  //   return chunks;
  // };
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