// import React, { useState, useRef, useEffect } from 'react';
// import axios from 'axios';
// import SendIcon from '@mui/icons-material/Send';
// import CircularProgress from '@mui/material/CircularProgress';
// import { Link } from 'react-router-dom';

// const ChatInterface = () => {
//   const [message, setMessage] = useState('');
//   const [conversation, setConversation] = useState([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [showPrompts, setShowPrompts] = useState(true);
//   const [showQuickQuestions, setShowQuickQuestions] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   // Custom Bangla prompts
//   const banglaPrompts = [
//     {
//       id: 1,
//       text: "আলুর কি কি জাত আছে?",
//       category: "আলু চাষ"
//     },
//     {
//       id: 2,
//       text: "ধান চাষের জন্য সেরা সময় কখন?",
//       category: "ধান চাষ"
//     },
//     {
//       id: 3,
//       text: "ট্মেটো চাষের উপযুক্ত সময় কখন?",
//       category: "ট্মেটো চাষ"
//     },
//     // {
//     //   id: 4,
//     //   text: "কৃষি বীমার জন্য আবেদন কীভাবে করতে হয়?",
//     //   category: "বীমা ও নিরাপত্তা"
//     // },
//     // {
//     //   id: 5,
//     //   text: "টমেটো চাষে কী কী রোগ হয়?",
//     //   category: "রোগ ও পোকামাকড়"
//     // },
//     // {
//     //   id: 6,
//     //   text: "কৃষি যন্ত্রপাতি কেনার জন্য সরকারি সহায়তা কী?",
//     //   category: "যন্ত্রপাতি ও সরঞ্জাম"
//     // },
//     // {
//     //   id: 7,
//     //   text: "জলবায়ু পরিবর্তনের প্রভাব কৃষির উপর কী?",
//     //   category: "জলবায়ু ও পরিবেশ"
//     // },
//     // {
//     //   id: 8,
//     //   text: "কৃষি পণ্য বিক্রির জন্য বাজার কোথায়?",
//     //   category: "বাজার ও বিক্রয়"
//     // },
//     // {
//     //   id: 9,
//     //   text: "আলু চাষের জন্য কী কী বিষয় খেয়াল রাখতে হয়?",
//     //   category: "ফসল চাষ"
//     // },
//     // {
//     //   id: 10,
//     //   text: "কৃষি জমির রেকর্ড কীভাবে দেখতে হয়?",
//     //   category: "জমি ও নথি"
//     // },
//     // {
//     //   id: 11,
//     //   text: "সেচের জন্য কী কী পদ্ধতি আছে?",
//     //   category: "সেচ ও পানি ব্যবস্থাপনা"
//     // },
//     // {
//     //   id: 12,
//     //   text: "কৃষি গবেষণা কেন্দ্রে কী কী সুবিধা পাওয়া যায়?",
//     //   category: "গবেষণা ও প্রশিক্ষণ"
//     // }
//   ];

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [conversation]);

//   useEffect(() => {
//     // Focus input on component mount
//     inputRef.current?.focus();
//   }, []);

//   const handlePromptClick = (promptText) => {
//     setMessage(promptText);
//     setShowPrompts(false);
//     inputRef.current?.focus();
//   };

//   const resetConversation = () => {
//     setConversation([]);
//     setShowPrompts(true);
//     setMessage('');
//     inputRef.current?.focus();
//   };

//   const formatBotResponse = (text) => {
//     // Split text into paragraphs
//     const paragraphs = text.split('\n').filter(p => p.trim());
    
//     // Function to process bold text
//     const processBoldText = (text) => {
//       const parts = text.split(/(\*\*.*?\*\*)/g);
//       return parts.map((part, i) => {
//         if (part.startsWith('**') && part.endsWith('**')) {
//           return <strong key={i}>{part.slice(2, -2)}</strong>;
//         }
//         return part;
//       });
//     };

//     // Function to check if text is a numbered point
//     const isNumberedPoint = (text) => {
//       return /^\d+\.\s/.test(text.trim());
//     };

//     // Function to check if text is a bullet point
//     const isBulletPoint = (text) => {
//       return /^[-•*]\s/.test(text.trim());
//     };
    
//     return (
//       <div className="bot-response">
//         {paragraphs.map((paragraph, index) => {
//           const trimmedText = paragraph.trim();
          
//           // Handle numbered points
//           if (isNumberedPoint(trimmedText)) {
//             const number = trimmedText.match(/^\d+/)[0];
//             const content = trimmedText.substring(number.length + 2);
//             return (
//               <div key={index} className="numbered-item">
//                 <span className="number">{number}.</span>
//                 <span className="content">{processBoldText(content)}</span>
//               </div>
//             );
//           }
          
//           // Handle bullet points
//           if (isBulletPoint(trimmedText)) {
//             return (
//               <div key={index} className="list-item">
//                 <span className="bullet">•</span>
//                 <span className="content">{processBoldText(trimmedText.substring(2))}</span>
//               </div>
//             );
//           }
          
//           // Check if paragraph is a heading
//           if (trimmedText.startsWith('#')) {
//             const level = trimmedText.match(/^#+/)[0].length;
//             const content = trimmedText.replace(/^#+\s*/, '');
//             return React.createElement(`h${level}`, { key: index, className: 'response-heading' }, processBoldText(content));
//           }
          
//           // Regular paragraph
//           return <p key={index} className="response-paragraph">{processBoldText(paragraph)}</p>;
//         })}
//       </div>
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!message.trim() || isProcessing) return;

//     try {
//       setIsProcessing(true);
//       const userMessage = {
//         text: message,
//         isUser: true,
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       };

//       setConversation(prev => [...prev, userMessage]);
//       setShowPrompts(false); // Hide prompts after first message

//       const response = await axios.post('http://127.0.0.1:8000/api/v1/chatbot/ask/', {
//         question: message
//       });

//       const botMessage = {
//         text: response.data.answer || "No answer available",
//         isUser: false,
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       };

//       setConversation(prev => [...prev, botMessage]);

//     } catch (error) {
//       const errorMessage = error.response?.data?.details || 'Request failed';
//       setConversation(prev => [...prev, {
//         text: `Error: ${errorMessage}`,
//         isUser: false,
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         isError: true
//       }]);
//     } finally {
//       setIsProcessing(false);
//       setMessage('');
//       inputRef.current?.focus();
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">
//         <Link to="/" className="home-button">
//           <i className="bi bi-house-door-fill"></i>
//           <span>Home</span>
//         </Link>
//         <div className="header-content">
//           <h1>🌿 AgriAssist</h1>
//           <p>Ask about agricultural regulations and policies</p>
//         </div>
//         {conversation.length > 0 && (
//           <button className="reset-button" onClick={resetConversation}>
//             <i className="bi bi-arrow-clockwise"></i>
//             <span>New Chat</span>
//           </button>
//         )}
//       </div>

//       <div className="chat-messages">
//         {conversation.length === 0 ? (
//           <div className="welcome-section">
//             <div className="welcome-message">
//               <h2>স্বাগতম AgriAssist! 👋</h2>
//               <p>আমি আপনাকে কৃষি সম্পর্কিত তথ্য দিতে সাহায্য করব। আপনি নিম্নলিখিত বিষয়ে প্রশ্ন করতে পারেন:</p>
//               <ul>
//                 <li>কৃষি নিয়ন্ত্রণ ও নীতি</li>
//                 <li>চাষাবাদ পদ্ধতি</li>
//                 <li>রোগ ও পোকামাকড় নিয়ন্ত্রণ</li>
//               </ul>
//             </div>
            
//             {/* Custom Bangla Prompts Section */}
//             <div className="prompts-section">
//               <h3>💡 দ্রুত প্রশ্ন (Quick Questions)</h3>
//               <div className="prompts-grid">
//                 {banglaPrompts.map((prompt) => (
//                   <button
//                     key={prompt.id}
//                     className="prompt-button"
//                     onClick={() => handlePromptClick(prompt.text)}
//                     disabled={isProcessing}
//                   >
//                     <div className="prompt-category">{prompt.category}</div>
//                     <div className="prompt-text">{prompt.text}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ) : (
//           conversation.map((msg, index) => (
//             <div
//               key={index}
//               className={`message-wrapper ${msg.isUser ? 'user-message' : 'bot-message'}`}
//             >
//               <div className={`message ${msg.isError ? 'error-message' : ''}`}>
//                 <div className="message-content">
//                   {msg.isUser ? msg.text : formatBotResponse(msg.text)}
//                 </div>
//                 <div className="message-timestamp">
//                   {msg.timestamp}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//         {isProcessing && (
//           <div className="message-wrapper bot-message">
//             <div className="message typing-indicator">
//               <div className="typing-dots">
//                 <span></span>
//                 <span></span>
//                 <span></span>
//               </div>
//             </div>
//           </div>
//         )}
//         <div ref={messagesEndRef} />
//       </div>

//       <div className="chat-input-container">
//         {conversation.length > 0 && (
//           <div className="quick-questions-section">
//             <button 
//               className="quick-questions-toggle"
//               onClick={() => setShowQuickQuestions(!showQuickQuestions)}
//               disabled={isProcessing}
//             >
//               <i className="bi bi-lightning-charge"></i>
//               দ্রুত প্রশ্ন (Quick Questions)
//               <i className={`bi bi-chevron-${showQuickQuestions ? 'up' : 'down'}`}></i>
//             </button>
//             {showQuickQuestions && (
//               <div className="quick-questions-dropdown">
//                 <div className="quick-questions-grid">
//                   {banglaPrompts.slice(0, 6).map((prompt) => (
//                     <button
//                       key={prompt.id}
//                       className="quick-prompt-button"
//                       onClick={() => {
//                         handlePromptClick(prompt.text);
//                         setShowQuickQuestions(false);
//                       }}
//                       disabled={isProcessing}
//                     >
//                       <div className="quick-prompt-category">{prompt.category}</div>
//                       <div className="quick-prompt-text">{prompt.text}</div>
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="chat-input-form">
//           <input
//             ref={inputRef}
//             type="text"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="💬 আপনার প্রশ্ন লিখুন..."
//             disabled={isProcessing}
//             className="chat-input"
//           />
//           <button
//             type="submit"
//             disabled={isProcessing || !message.trim()}
//             className="send-button"
//           >
//             {isProcessing ? (
//               <CircularProgress size={24} style={{ color: 'white' }} />
//             ) : (
//               <SendIcon />
//             )}
//           </button>
//         </form>
//       </div>

//       <style jsx>{`
//         .chat-container {
//           display: flex;
//           flex-direction: column;
//           height: 100vh;
//           background-color: #f5f7fb;
//         }

//         .chat-header {
//           background: linear-gradient(135deg, #06beb6 0%, #48b1bf 100%);
//           padding: 1rem;
//           color: white;
//           text-align: center;
//           position: relative;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//         }

//         .home-button {
//           position: absolute;
//           left: 1rem;
//           top: 50%;
//           transform: translateY(-50%);
//           color: white;
//           text-decoration: none;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.5rem 1rem;
//           border-radius: 1.5rem;
//           background: rgba(255, 255, 255, 0.1);
//           transition: all 0.3s ease;
//         }

//         .home-button:hover {
//           background: rgba(255, 255, 255, 0.2);
//           color: white;
//         }

//         .header-content h1 {
//           margin: 0;
//           font-size: 1.5rem;
//           font-weight: 600;
//         }

//         .header-content p {
//           margin: 0.5rem 0 0;
//           opacity: 0.9;
//           font-size: 0.9rem;
//         }

//         .chat-messages {
//           flex: 1;
//           overflow-y: auto;
//           padding: 1.5rem;
//           display: flex;
//           flex-direction: column;
//           gap: 1rem;
//         }

//         .welcome-section {
//           display: flex;
//           flex-direction: column;
//           gap: 2rem;
//         }

//         .welcome-message {
//           text-align: center;
//           padding: 2rem;
//           background: white;
//           border-radius: 1rem;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//           max-width: 600px;
//           margin: 0 auto;
//         }

//         .welcome-message h2 {
//           color: #06beb6;
//           margin-bottom: 1rem;
//         }

//         .welcome-message ul {
//           text-align: left;
//           display: inline-block;
//           margin-top: 1rem;
//         }

//         .prompts-section {
//           background: white;
//           border-radius: 1rem;
//           padding: 2rem;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//           max-width: 1000px;
//           margin: 0 auto;
//           width: 100%;
//         }

//         .prompts-section h3 {
//           color: #06beb6;
//           margin-bottom: 1.5rem;
//           text-align: center;
//           font-size: 1.3rem;
//         }

//         .prompts-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//           gap: 1rem;
//         }

//         .prompt-button {
//           background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
//           border: 2px solid #e2e8f0;
//           border-radius: 1rem;
//           padding: 1.5rem;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           text-align: left;
//           font-family: inherit;
//         }

//         .prompt-button:hover {
//           border-color: #06beb6;
//           background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(6, 190, 182, 0.15);
//         }

//         .prompt-button:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .prompt-category {
//           font-size: 0.8rem;
//           color: #06beb6;
//           font-weight: 600;
//           margin-bottom: 0.5rem;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .prompt-text {
//           font-size: 1rem;
//           color: #1f2937;
//           line-height: 1.4;
//           font-weight: 500;
//         }

//         .message-wrapper {
//           display: flex;
//           margin-bottom: 1rem;
//         }

//         .user-message {
//           justify-content: flex-end;
//         }

//         .bot-message {
//           justify-content: flex-start;
//         }

//         .message {
//           max-width: 80%;
//           padding: 1rem 1.5rem;
//           border-radius: 1.5rem;
//           position: relative;
//           box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
//         }

//         .user-message .message {
//           background: #4f46e5;
//           color: white;
//           border-bottom-right-radius: 0.5rem;
//         }

//         .bot-message .message {
//           background: white;
//           color: #1f2937;
//           border-bottom-left-radius: 0.5rem;
//         }

//         .error-message {
//           background: #fee2e2 !important;
//           color: #dc2626 !important;
//         }

//         .message-content {
//           font-size: 1rem;
//           line-height: 1.5;
//           white-space: pre-wrap;
//         }

//         .message-timestamp {
//           font-size: 0.75rem;
//           opacity: 0.7;
//           margin-top: 0.5rem;
//           text-align: right;
//         }

//         .chat-input-container {
//           background: white;
//           padding: 1rem;
//           border-top: 1px solid #e5e7eb;
//           position: relative; /* Added for quick questions dropdown positioning */
//         }

//         .quick-questions-section {
//           margin-bottom: 1rem;
//           padding: 0.75rem 1rem;
//           background: linear-gradient(135deg, #f0fdfa 0%, #e0f2f7 100%);
//           border: 1px solid #ccfbf1;
//           border-radius: 0.75rem;
//           position: relative;
//         }

//         .quick-questions-toggle {
//           background: none;
//           border: none;
//           color: #06beb6;
//           font-size: 0.9rem;
//           font-weight: 600;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           padding: 0.5rem 1rem;
//           border-radius: 0.5rem;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           width: 100%;
//           justify-content: center;
//         }

//         .quick-questions-toggle:hover {
//           background: rgba(6, 190, 182, 0.1);
//           color: #06beb6;
//         }

//         .quick-questions-toggle:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .quick-questions-dropdown {
//           position: absolute;
//           bottom: 100%; /* Position above the input */
//           left: 0;
//           right: 0;
//           background: white;
//           border: 1px solid #e5e7eb;
//           border-radius: 0.75rem;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//           z-index: 10;
//           max-height: 300px;
//           overflow-y: auto;
//           margin-bottom: 0.5rem;
//         }

//         .quick-questions-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//           gap: 0.5rem;
//           padding: 1rem;
//         }

//         .quick-prompt-button {
//           background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
//           border: 1px solid #e2e8f0;
//           border-radius: 0.75rem;
//           padding: 0.75rem 1rem;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           text-align: left;
//           font-family: inherit;
//           display: flex;
//           flex-direction: column;
//           gap: 0.3rem;
//         }

//         .quick-prompt-button:hover {
//           border-color: #06beb6;
//           background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(6, 190, 182, 0.1);
//         }

//         .quick-prompt-button:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//           transform: none;
//         }

//         .quick-prompt-category {
//           font-size: 0.7rem;
//           color: #06beb6;
//           font-weight: 600;
//           text-transform: uppercase;
//           letter-spacing: 0.5px;
//         }

//         .quick-prompt-text {
//           font-size: 0.9rem;
//           color: #1f2937;
//           line-height: 1.3;
//           font-weight: 500;
//         }

//         .chat-input-form {
//           display: flex;
//           gap: 1rem;
//           max-width: 800px;
//           margin: 0 auto;
//         }

//         .chat-input {
//           flex: 1;
//           padding: 1rem 1.5rem;
//           border: 2px solid #e5e7eb;
//           border-radius: 1.5rem;
//           font-size: 1rem;
//           transition: all 0.3s ease;
//         }

//         .chat-input:focus {
//           outline: none;
//           border-color: #06beb6;
//           box-shadow: 0 0 0 4px rgba(6, 190, 182, 0.1);
//         }

//         .send-button {
//           background: linear-gradient(135deg, #06beb6 0%, #48b1bf 100%);
//           color: white;
//           border: none;
//           border-radius: 1.5rem;
//           padding: 0 1.5rem;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .send-button:disabled {
//           opacity: 0.7;
//           cursor: not-allowed;
//         }

//         .send-button:not(:disabled):hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(6, 190, 182, 0.2);
//         }

//         .typing-indicator {
//           padding: 1rem 1.5rem;
//           background: white;
//           border-radius: 1.5rem;
//         }

//         .typing-dots {
//           display: flex;
//           gap: 0.5rem;
//         }

//         .typing-dots span {
//           width: 8px;
//           height: 8px;
//           background: #06beb6;
//           border-radius: 50%;
//           animation: typing 1s infinite ease-in-out;
//         }

//         .typing-dots span:nth-child(2) {
//           animation-delay: 0.2s;
//         }

//         .typing-dots span:nth-child(3) {
//           animation-delay: 0.4s;
//         }

//         @keyframes typing {
//           0%, 100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-5px);
//           }
//         }

//         .numbered-item {
//           display: flex;
//           align-items: flex-start;
//           margin: 0.5rem 0;
//           padding-left: 1rem;
//         }

//         .number {
//           color: #06beb6;
//           font-weight: 600;
//           margin-right: 0.5rem;
//           min-width: 1.5rem;
//         }

//         .list-item {
//           display: flex;
//           align-items: flex-start;
//           margin: 0.5rem 0;
//           padding-left: 1rem;
//         }

//         .bullet {
//           color: #06beb6;
//           margin-right: 0.5rem;
//           font-size: 1.2rem;
//         }

//         .content {
//           flex: 1;
//         }

//         .bot-response {
//           font-size: 1rem;
//           line-height: 1.6;
//         }

//         .response-paragraph {
//           margin: 0.5rem 0;
//           color: #1f2937;
//         }

//         .response-heading {
//           margin: 1rem 0 0.5rem;
//           color: #06beb6;
//           font-weight: 600;
//         }

//         .response-heading h1 {
//           font-size: 1.5rem;
//         }

//         .response-heading h2 {
//           font-size: 1.3rem;
//         }

//         .response-heading h3 {
//           font-size: 1.1rem;
//         }

//         .reset-button {
//           position: absolute;
//           right: 1rem;
//           top: 50%;
//           transform: translateY(-50%);
//           background: rgba(255, 255, 255, 0.2);
//           color: white;
//           border: 1px solid white;
//           border-radius: 1.5rem;
//           padding: 0.5rem 1rem;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           gap: 0.5rem;
//           transition: all 0.3s ease;
//           z-index: 10;
//         }

//         .reset-button:hover {
//           background: rgba(255, 255, 255, 0.3);
//           color: white;
//         }

//         .reset-button:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         @media (max-width: 768px) {
//           .chat-messages {
//             padding: 1rem;
//           }

//           .message {
//             max-width: 90%;
//           }

//           .chat-input-form {
//             padding: 0 0.5rem;
//           }

//           .chat-input {
//             padding: 0.8rem 1.2rem;
//           }

//           .send-button {
//             padding: 0 1.2rem;
//           }

//           .bot-message .message {
//             max-width: 90%;
//           }

//           .user-message .message {
//             max-width: 85%;
//           }

//           .response-paragraph {
//             font-size: 0.95rem;
//           }

//           .prompts-grid {
//             grid-template-columns: 1fr;
//           }

//           .prompt-button {
//             padding: 1rem;
//           }

//           .prompts-section {
//             padding: 1.5rem;
//           }

//           .quick-questions-grid {
//             grid-template-columns: 1fr;
//           }

//           .quick-prompt-button {
//             padding: 0.75rem 1rem;
//           }

//           .quick-questions-section {
//             padding: 0.3rem 0.7rem;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ChatInterface;
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Custom Bangla prompts
  const banglaPrompts = [
    {
      id: 1,
      text: "আলুর কি কি জাত আছে?",
      category: "আলু চাষ"
    },
    {
      id: 2,
      text: "ধান চাষের জন্য সেরা সময় কখন?",
      category: "ধান চাষ"
    },
    {
      id: 3,
      text: "ট্মেটো চাষের উপযুক্ত সময় কখন?",
      category: "ট্মেটো চাষ"
    },
    // {
    //   id: 4,
    //   text: "কৃষি বীমার জন্য আবেদন কীভাবে করতে হয়?",
    //   category: "বীমা ও নিরাপত্তা"
    // },
    // {
    //   id: 5,
    //   text: "টমেটো চাষে কী কী রোগ হয়?",
    //   category: "রোগ ও পোকামাকড়"
    // },
    // {
    //   id: 6,
    //   text: "কৃষি যন্ত্রপাতি কেনার জন্য সরকারি সহায়তা কী?",
    //   category: "যন্ত্রপাতি ও সরঞ্জাম"
    // },
    // {
    //   id: 7,
    //   text: "জলবায়ু পরিবর্তনের প্রভাব কৃষির উপর কী?",
    //   category: "জলবায়ু ও পরিবেশ"
    // },
    // {
    //   id: 8,
    //   text: "কৃষি পণ্য বিক্রির জন্য বাজার কোথায়?",
    //   category: "বাজার ও বিক্রয়"
    // },
    // {
    //   id: 9,
    //   text: "আলু চাষের জন্য কী কী বিষয় খেয়াল রাখতে হয়?",
    //   category: "ফসল চাষ"
    // },
    // {
    //   id: 10,
    //   text: "কৃষি জমির রেকর্ড কীভাবে দেখতে হয়?",
    //   category: "জমি ও নথি"
    // },
    // {
    //   id: 11,
    //   text: "সেচের জন্য কী কী পদ্ধতি আছে?",
    //   category: "সেচ ও পানি ব্যবস্থাপনা"
    // },
    // {
    //   id: 12,
    //   text: "কৃষি গবেষণা কেন্দ্রে কী কী সুবিধা পাওয়া যায়?",
    //   category: "গবেষণা ও প্রশিক্ষণ"
    // }
  ];

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

  const handlePromptClick = (promptText) => {
    setMessage(promptText);
    setShowPrompts(false);
    inputRef.current?.focus();
  };

  const resetConversation = () => {
    setConversation([]);
    setShowPrompts(true);
    setMessage('');
    inputRef.current?.focus();
  };

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
      setShowPrompts(false); // Hide prompts after first message

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
        {conversation.length > 0 && (
          <button className="reset-button" onClick={resetConversation}>
            <i className="bi bi-arrow-clockwise"></i>
            <span>New Chat</span>
          </button>
        )}
      </div>

      <div className="chat-messages">
        {conversation.length === 0 ? (
          <div className="welcome-section">
            <div className="welcome-message">
              <h2>স্বাগতম AgriAssist! 👋</h2>
              <p>আমি আপনাকে কৃষি সম্পর্কিত তথ্য দিতে সাহায্য করব। আপনি নিম্নলিখিত বিষয়ে প্রশ্ন করতে পারেন:</p>
              <ul>
                <li>কৃষি নিয়ন্ত্রণ ও নীতি</li>
                <li>চাষাবাদ পদ্ধতি</li>
                <li>রোগ ও পোকামাকড় নিয়ন্ত্রণ</li>
              </ul>
            </div>
            
            {/* Custom Bangla Prompts Section */}
            <div className="prompts-section">
              <h3>💡 দ্রুত প্রশ্ন (Quick Questions)</h3>
              <div className="prompts-grid">
                {banglaPrompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    className="prompt-button"
                    onClick={() => handlePromptClick(prompt.text)}
                    disabled={isProcessing}
                  >
                    <div className="prompt-category">{prompt.category}</div>
                    <div className="prompt-text">{prompt.text}</div>
                  </button>
                ))}
              </div>
            </div>
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
        {conversation.length > 0 && (
          <div className="quick-questions-section">
            <button 
              className="quick-questions-toggle"
              onClick={() => setShowQuickQuestions(!showQuickQuestions)}
              disabled={isProcessing}
            >
              <i className="bi bi-lightning-charge"></i>
              দ্রুত প্রশ্ন (Quick Questions)
              <i className={`bi bi-chevron-${showQuickQuestions ? 'up' : 'down'}`}></i>
            </button>
            {showQuickQuestions && (
              <div className="quick-questions-dropdown">
                <div className="quick-questions-grid">
                  {banglaPrompts.slice(0, 6).map((prompt) => (
                    <button
                      key={prompt.id}
                      className="quick-prompt-button"
                      onClick={() => {
                        handlePromptClick(prompt.text);
                        setShowQuickQuestions(false);
                      }}
                      disabled={isProcessing}
                    >
                      <div className="quick-prompt-category">{prompt.category}</div>
                      <div className="quick-prompt-text">{prompt.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <form onSubmit={handleSubmit} className="chat-input-form">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="💬 আপনার প্রশ্ন লিখুন..."
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
          max-width: 900px; /* Adjusted width */
          margin: 0 auto;
        }

        .welcome-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .welcome-message {
          text-align: center;
          padding: 2rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          max-width: 600px;
          margin: 0 auto;
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

        .prompts-section {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          max-width: 1000px;
          margin: 0 auto;
          width: 100%;
        }

        .prompts-section h3 {
          color: #06beb6;
          margin-bottom: 1.5rem;
          text-align: center;
          font-size: 1.3rem;
        }

        .prompts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .prompt-button {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 2px solid #e2e8f0;
          border-radius: 1rem;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          font-family: inherit;
        }

        .prompt-button:hover {
          border-color: #06beb6;
          background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(6, 190, 182, 0.15);
        }

        .prompt-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .prompt-category {
          font-size: 0.8rem;
          color: #06beb6;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .prompt-text {
          font-size: 1rem;
          color: #1f2937;
          line-height: 1.4;
          font-weight: 500;
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
          position: relative;
        }

        .quick-questions-section {
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          background: linear-gradient(135deg, #f0fdfa 0%, #e0f2f7 100%);
          border: 1px solid #ccfbf1;
          border-radius: 0.75rem;
          position: relative;
        }

        .quick-questions-toggle {
          background: none;
          border: none;
          color: #06beb6;
          font-size: 0.9rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          justify-content: center;
        }

        .quick-questions-toggle:hover {
          background: rgba(6, 190, 182, 0.1);
          color: #06beb6;
        }

        .quick-questions-toggle:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .quick-questions-dropdown {
          position: absolute;
          bottom: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 10;
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 0.5rem;
        }

        .quick-questions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 0.5rem;
          padding: 1rem;
        }

        .quick-prompt-button {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          font-family: inherit;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }

        .quick-prompt-button:hover {
          border-color: #06beb6;
          background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(6, 190, 182, 0.1);
        }

        .quick-prompt-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .quick-prompt-category {
          font-size: 0.7rem;
          color: #06beb6;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .quick-prompt-text {
          font-size: 0.9rem;
          color: #1f2937;
          line-height: 1.3;
          font-weight: 500;
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

        .reset-button {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid white;
          border-radius: 1.5rem;
          padding: 0.5rem 1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .reset-button:hover {
          background: rgba(255, 255, 255, 0.3);
          color: white;
        }

        .reset-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .chat-messages {
            padding: 1rem;
            max-width: 100%; /* Ensure full width on smaller screens */
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

          .prompts-grid {
            grid-template-columns: 1fr;
          }

          .prompt-button {
            padding: 1rem;
          }

          .prompts-section {
            padding: 1.5rem;
          }

          .quick-questions-grid {
            grid-template-columns: 1fr;
          }

          .quick-prompt-button {
            padding: 0.75rem 1rem;
          }

          .quick-questions-section {
            padding: 0.3rem 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatInterface;