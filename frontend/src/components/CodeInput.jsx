import React from "react";

const CodeInput = ({ userMessage, setUserMessage, handleSend }) => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };
  
    return (
      <div className="flex flex-col w-full mt-2">
        <textarea
          className="p-3 w-full border rounded-lg dark:bg-gray-700 dark:text-white"
          placeholder="Enter your code here..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-600"
        >
          Send to AI
        </button>
      </div>
    );
  };
  
  export default CodeInput;
  