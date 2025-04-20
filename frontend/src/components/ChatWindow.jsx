import React, { useEffect, useState, useRef } from "react";
import { startSession, sendMessage } from "../api/aiService";
import ChatMessage from "./ChatMessage";
import CodeInput from "./CodeInput";
import { FaMoon, FaSun, FaTrashAlt } from "react-icons/fa";

const ChatWindow = () => {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initializeSession = async () => {
      const id = await startSession();
      setSessionId(id);
    };
    initializeSession();
  }, []);

  const handleSend = async () => {
    if (!userMessage.trim()) return;

    // Add user message to UI
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setUserMessage("");
    setLoading(true);

    try {
      // Send the full chat history to backend
      const response = await sendMessage(sessionId, userMessage);

      // Append AI response to chat
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: response.aiResponse },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} h-screen w-full flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="w-full flex justify-between items-center p-4 bg-gray-200 dark:bg-gray-800 shadow-md">
        <h2 className="text-2xl font-bold">AI Code Reviewer</h2>
        <div className="flex gap-4">
          <button onClick={handleClearChat} className="text-lg p-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
            <FaTrashAlt />
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className="text-xl p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 transition">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      {/* Chat Messages with X-Axis Padding */}
      <div className="flex-1 overflow-auto p-4 lg:px-32 md:px-20 sm:px-10 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}
        {loading && <p className="text-center text-gray-500 animate-pulse">AI is thinking...</p>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 bg-gray-200 dark:bg-gray-800 w-full flex justify-center">
        <div className="w-full max-w-3xl">
          <CodeInput userMessage={userMessage} setUserMessage={setUserMessage} handleSend={handleSend} />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
