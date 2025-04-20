import React from "react";
import { FaCopy } from "react-icons/fa";
import { useState } from "react";

const ChatMessage = ({ role, content }) => {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  // Detects code blocks and formats them
  const renderMessage = () => {
    const codeBlockMatch = content.match(/```([\s\S]*?)```/);
    if (codeBlockMatch) {
      return (
        <div className="relative bg-gray-800 text-white font-mono p-3 rounded-md">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
            onClick={() => {
              navigator.clipboard.writeText(codeBlockMatch[1]);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            <FaCopy />
          </button>
          <pre>{codeBlockMatch[1]}</pre>
        </div>
      );
    }
    return <p>{content}</p>;
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div
        className={`p-3 rounded-lg w-fit max-w-lg ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        <strong>{isUser ? "You" : "AI"}:</strong>
        {renderMessage()}
        {copied && <span className="text-green-400 text-xs ml-2">Copied!</span>}
      </div>
    </div>
  );
};

export default ChatMessage;
