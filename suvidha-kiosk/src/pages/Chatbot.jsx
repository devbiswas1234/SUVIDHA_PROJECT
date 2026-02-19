import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendMessage } from "../services/chatService";
import styles from "../styles/ChatWidget.module.css";

export default function Chatbot() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState([]);

  const messagesEndRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ✅ Default Quick Options (shown initially)
  const defaultQuickOptions = [
    "Apply for Birth Certificate",
    "File a Complaint",
    "Check Application Status",
    "Water Connection Service",
  ];

  const handleSendWithText = async (customText) => {
    const messageText = customText || input;
    if (!messageText.trim()) return;

    const userMessage = { text: messageText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setIsTyping(true);
    setDynamicOptions([]);

    try {
      const response = await sendMessage(messageText);

        // 🔥 NEW SERVICE ROUTE LOGIC
        if (response.type === "service" && response.redirect) {
          setIsTyping(false);
          navigate(response.redirect);
          return;
        }
        
        // ✅ Normal text reply
        if (response.reply) {
          setMessages((prev) => [
            ...prev,
            { text: response.reply, sender: "bot" },
          ]);
        }
        
        // ✅ Dynamic quick buttons
        if (response.quickOptions) {
          setDynamicOptions(response.quickOptions);
        }
        

      // ✅ Backend dynamic options
      if (response.quickOptions) {
        setDynamicOptions(response.quickOptions);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { text: "Server error. Please try again.", sender: "bot" },
      ]);
    }

    setIsTyping(false);
  };

  const handleSend = () => handleSendWithText();

  return (
    <div className={styles.chatContainer}>
      {/* Messages */}
      <div className={styles.messagesArea}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === "user"
                ? styles.userMessageWrapper
                : styles.botMessageWrapper
            }
          >
            <div
              className={
                msg.sender === "user"
                  ? styles.userMessage
                  : styles.botMessage
              }
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className={styles.typing}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ✅ Show Default Quick Options only at start */}
      {messages.length === 0 && (
        <div className={styles.quickOptions}>
          {defaultQuickOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSendWithText(option)}
              className={styles.quickButton}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* ✅ Show Dynamic Options from Backend */}
      {dynamicOptions.length > 0 && (
        <div className={styles.quickOptions}>
          {dynamicOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSendWithText(option)}
              className={styles.quickButton}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles.input}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
}
