import React, { useState, useEffect, useRef } from "react";
import { startSession, sendMessage } from "./api/aiService";
import { Edit, File, LayoutList, Settings, Sun, Moon, Clipboard } from "lucide-react";
import "./App.css";

function App() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([
    { sender: "Bug Hawk", text: "Welcome to Bug Hawk! Type your bug below, and I will fix it..." },
  ]);
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    const initializeSession = async () => {
      const id = await startSession();
      setSessionId(id);
    };
    initializeSession();
  }, []);

  const handleStartChat = () => setShowWelcome(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    const newUserMessage = { sender: "User", text: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);
    setUserMessage("");
    setLoading(true);

    try {
      const response = await sendMessage(sessionId, userMessage);
      const aiReply = { sender: "Bug Hawk", text: response.aiResponse };

      setMessages((prev) => [...prev, aiReply]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedMessages = JSON.parse(event.target.result);
          if (Array.isArray(importedMessages)) {
            setMessages(importedMessages);
          }
        } catch (err) {
          alert("Failed to import messages");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(messages, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "chat-export.json");
    downloadAnchor.click();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div
      className={`${
        darkMode ? "bg-black text-green-500" : "bg-white text-gray-900"
      } flex h-screen w-screen font-mono relative`}
    >
      {showWelcome && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center font-mono">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to ChatBot
          </h1>
          <h2 className="text-2xl md:text-3xl mb-2">
            Experience the Power of Bug Hawk AI
          </h2>
          <p className="text-sm md:text-base mb-8">
            Automate, analyze, and create like never before.
          </p>
          <button
            onClick={handleStartChat}
            className="bg-gray-800 text-green-400 font-bold px-6 py-3 rounded-xl hover:bg-green-600 hover:text-black transition"
          >
            Start Chat!
          </button>
        </div>
      )}

      {!showWelcome && (
        <>
          {/* Sidebar */}
          <div
            className={`${darkMode ? "bg-gray-900" : "bg-gray-200"} ${
              isSidebarOpen ? "w-44" : "w-12"
            } transition-all duration-300 flex flex-col items-start py-4`}
          >
            {/* Menu Toggle Button (3-dash) */}
            <div
              className={`w-full flex ${
                isSidebarOpen ? "justify-start px-4" : "justify-center"
              } mb-6`}
            >
              <button
                title="Menu"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="flex items-center"
              >
                <LayoutList
                  className={`w-6 h-6 ${
                    darkMode
                      ? "text-green-400 hover:text-green-300"
                      : "text-gray-700 hover:text-black"
                  }`}
                />
                {isSidebarOpen && (
                  <span className="ml-2 font-semibold text-sm">Menu</span>
                )}
              </button>
            </div>

            {/* Import & Export */}
            <div className="w-full flex flex-col items-start space-y-4 px-2">
              <button
                title="Import"
                onClick={handleImport}
                className="flex items-center hover:bg-opacity-10 rounded px-2 py-1"
              >
                <File
                  className={`w-5 h-5 ${
                    darkMode ? "text-green-400" : "text-gray-700"
                  }`}
                />
                {isSidebarOpen && <span className="ml-2 text-sm">Import</span>}
              </button>
              <button
                title="Export"
                onClick={handleExport}
                className="flex items-center hover:bg-opacity-10 rounded px-2 py-1"
              >
                <Edit
                  className={`w-5 h-5 ${
                    darkMode ? "text-green-400" : "text-gray-700"
                  }`}
                />
                {isSidebarOpen && <span className="ml-2 text-sm">Export</span>}
              </button>
            </div>

            <div className="flex-grow" />

            {/* Theme Toggle + Settings */}
            <div
              className={`w-full flex flex-col ${
                isSidebarOpen ? "items-start px-4" : "items-center"
              } space-y-4 mt-6`}
            >
              <button
                title="Toggle Theme"
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center"
              >
                {darkMode ? (
                  <>
                    <Sun className="w-5 h-5 text-yellow-400" />
                    {isSidebarOpen && (
                      <span className="ml-2 text-sm">Light Mode</span>
                    )}
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 text-gray-700" />
                    {isSidebarOpen && (
                      <span className="ml-2 text-sm">Dark Mode</span>
                    )}
                  </>
                )}
              </button>
              <button title="Settings" className="flex items-center">
                <Settings
                  className={`w-5 h-5 ${
                    darkMode ? "text-green-400" : "text-gray-700"
                  }`}
                />
                {isSidebarOpen && (
                  <span className="ml-2 text-sm">Settings</span>
                )}
              </button>
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col">
            <div className="space-y-4 flex-grow">
              {messages.map((msg, index) => (
                <div key={index} className="whitespace-pre-wrap flex items-start">
                  <span className="font-bold">`{msg.sender} &gt;`</span>  
                  {msg.text.includes("```") ? (
                    <pre className="bg-gray-800 text-white p-2 rounded w-full">
                      <code>{msg.text.replace(/```/g, "")}</code>
                    </pre>
                  ) : (
                    <span className="ml-2">{msg.text}</span>
                  )}
                  {msg.sender === "Bug Hawk" && (
                    <button onClick={() => copyToClipboard(msg.text)} className="ml-2 text-gray-400 hover:text-white">
                      <Clipboard className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              {loading && (
                <div className="animate-pulse">
                  <span className="font-bold">Bug Hawk &gt;</span> Typing...
                </div>
              )}
            </div>
            <form onSubmit={handleSend} className="mt-4 flex">
              <input
                type="text"
                placeholder="Prompt your code...."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                className="bg-transparent focus:outline-none w-full"
                autoFocus
              />
            </form>
            <div ref={bottomRef} />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
