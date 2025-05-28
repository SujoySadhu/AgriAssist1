import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  useEffect(() => {
    // Focus input on component mount
    inputRef.current?.focus();
  }, []);

  const formatBotResponse = (text) => {
    // Split text into paragraphs
    const paragraphs = text.split('\n').filter(p => p.trim());
    
    // Function to process bold text
    const processBoldText = (text) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return part;
      });
    };

    // Function to check if text is a numbered point
    const isNumberedPoint = (text) => {
      return /^\d+\.\s/.test(text.trim());
    };

    // Function to check if text is a bullet point
    const isBulletPoint = (text) => {
      return /^[-•*]\s/.test(text.trim());
    };
    
    return (
      <div className="bot-response">
        {paragraphs.map((paragraph, index) => {
          const trimmedText = paragraph.trim();
          
          // Handle numbered points
          if (isNumberedPoint(trimmedText)) {
            const number = trimmedText.match(/^\d+/)[0];
            const content = trimmedText.substring(number.length + 2);
            return (
              <div key={index} className="numbered-item">
                <span className="number">{number}.</span>
                <span className="content">{processBoldText(content)}</span>
              </div>
            );
          }
          
          // Handle bullet points
          if (isBulletPoint(trimmedText)) {
            return (
              <div key={index} className="list-item">
                <span className="bullet">•</span>
                <span className="content">{processBoldText(trimmedText.substring(2))}</span>
              </div>
            );
          }
          
          // Check if paragraph is a heading
          if (trimmedText.startsWith('#')) {
            const level = trimmedText.match(/^#+/)[0].length;
            const content = trimmedText.replace(/^#+\s*/, '');
            return React.createElement(`h${level}`, { key: index, className: 'response-heading' }, processBoldText(content));
          }
          
          // Regular paragraph
          return <p key={index} className="response-paragraph">{processBoldText(paragraph)}</p>;
        })}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;

    try {
      setIsProcessing(true);
      const userMessage = {
        text: message,
        isUser: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversation(prev => [...prev, userMessage]);

      const response = await axios.post('http://127.0.0.1:8000/api/v1/chatbot/ask/', {
        question: message
      });

      const botMessage = {
        text: response.data.answer || "No answer available",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversation(prev => [...prev, botMessage]);

    } catch (error) {
      const errorMessage = error.response?.data?.details || 'Request failed';
      setConversation(prev => [...prev, {
        text: `Error: ${errorMessage}`,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      }]);
    } finally {
      setIsProcessing(false);
      setMessage('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <Link to="/" className="home-button">
          <i className="bi bi-house-door-fill"></i>
          <span>Home</span>
        </Link>
        <div className="header-content">
          <h1>🌿 AgriAssist</h1>
          <p>Ask about agricultural regulations and policies</p>
        </div>
      </div>

      <div className="chat-messages">
        {conversation.length === 0 ? (
          <div className="welcome-message">
            <h2>Welcome to AgriAssist! 👋</h2>
            <p>I'm here to help you with agricultural information. Feel free to ask any questions about:</p>
            <ul>
              <li>Agricultural regulations</li>
              <li>Farming practices</li>
              
              
            </ul>
          </div>
        ) : (
          conversation.map((msg, index) => (
            <div
              key={index}
              className={`message-wrapper ${msg.isUser ? 'user-message' : 'bot-message'}`}
            >
              <div className={`message ${msg.isError ? 'error-message' : ''}`}>
                <div className="message-content">
                  {msg.isUser ? msg.text : formatBotResponse(msg.text)}
                </div>
                <div className="message-timestamp">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))
        )}
        {isProcessing && (
          <div className="message-wrapper bot-message">
            <div className="message typing-indicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="💬 Type your question..."
            disabled={isProcessing}
            className="chat-input"
          />
          <button
            type="submit"
            disabled={isProcessing || !message.trim()}
            className="send-button"
          >
            {isProcessing ? (
              <CircularProgress size={24} style={{ color: 'white' }} />
            ) : (
              <SendIcon />
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: #f5f7fb;
        }

        .chat-header {
          background: linear-gradient(135deg, #06beb6 0%, #48b1bf 100%);
          padding: 1rem;
          color: white;
          text-align: center;
          position: relative;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .home-button {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .home-button:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .header-content h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .header-content p {
          margin: 0.5rem 0 0;
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .welcome-message {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          max-width: 600px;
          margin: 2rem auto;
        }

        .welcome-message h2 {
          color: #06beb6;
          margin-bottom: 1rem;
        }

        .welcome-message ul {
          text-align: left;
          display: inline-block;
          margin-top: 1rem;
        }

        .message-wrapper {
          display: flex;
          margin-bottom: 1rem;
        }

        .user-message {
          justify-content: flex-end;
        }

        .bot-message {
          justify-content: flex-start;
        }

        .message {
          max-width: 80%;
          padding: 1rem 1.5rem;
          border-radius: 1.5rem;
          position: relative;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .user-message .message {
          background: #4f46e5;
          color: white;
          border-bottom-right-radius: 0.5rem;
        }

        .bot-message .message {
          background: white;
          color: #1f2937;
          border-bottom-left-radius: 0.5rem;
        }

        .error-message {
          background: #fee2e2 !important;
          color: #dc2626 !important;
        }

        .message-content {
          font-size: 1rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .message-timestamp {
          font-size: 0.75rem;
          opacity: 0.7;
          margin-top: 0.5rem;
          text-align: right;
        }

        .chat-input-container {
          background: white;
          padding: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .chat-input-form {
          display: flex;
          gap: 1rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .chat-input {
          flex: 1;
          padding: 1rem 1.5rem;
          border: 2px solid #e5e7eb;
          border-radius: 1.5rem;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .chat-input:focus {
          outline: none;
          border-color: #06beb6;
          box-shadow: 0 0 0 4px rgba(6, 190, 182, 0.1);
        }

        .send-button {
          background: linear-gradient(135deg, #06beb6 0%, #48b1bf 100%);
          color: white;
          border: none;
          border-radius: 1.5rem;
          padding: 0 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .send-button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(6, 190, 182, 0.2);
        }

        .typing-indicator {
          padding: 1rem 1.5rem;
          background: white;
          border-radius: 1.5rem;
        }

        .typing-dots {
          display: flex;
          gap: 0.5rem;
        }

        .typing-dots span {
          width: 8px;
          height: 8px;
          background: #06beb6;
          border-radius: 50%;
          animation: typing 1s infinite ease-in-out;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .numbered-item {
          display: flex;
          align-items: flex-start;
          margin: 0.5rem 0;
          padding-left: 1rem;
        }

        .number {
          color: #06beb6;
          font-weight: 600;
          margin-right: 0.5rem;
          min-width: 1.5rem;
        }

        .list-item {
          display: flex;
          align-items: flex-start;
          margin: 0.5rem 0;
          padding-left: 1rem;
        }

        .bullet {
          color: #06beb6;
          margin-right: 0.5rem;
          font-size: 1.2rem;
        }

        .content {
          flex: 1;
        }

        .bot-response {
          font-size: 1rem;
          line-height: 1.6;
        }

        .response-paragraph {
          margin: 0.5rem 0;
          color: #1f2937;
        }

        .response-heading {
          margin: 1rem 0 0.5rem;
          color: #06beb6;
          font-weight: 600;
        }

        .response-heading h1 {
          font-size: 1.5rem;
        }

        .response-heading h2 {
          font-size: 1.3rem;
        }

        .response-heading h3 {
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .chat-messages {
            padding: 1rem;
          }

          .message {
            max-width: 90%;
          }

          .chat-input-form {
            padding: 0 0.5rem;
          }

          .chat-input {
            padding: 0.8rem 1.2rem;
          }

          .send-button {
            padding: 0 1.2rem;
          }

          .bot-message .message {
            max-width: 90%;
          }

          .user-message .message {
            max-width: 85%;
          }

          .response-paragraph {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;
