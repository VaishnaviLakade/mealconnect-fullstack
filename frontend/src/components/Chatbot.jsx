import React, { useState } from "react";
import axios from "axios";
import { IoChatbubbleEllipsesOutline, IoSend } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("http://localhost:3000/api/chat", {
        message: input,
      });

      setMessages([...newMessages, { text: response.data.reply, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { text: "Error getting response. Try again!", sender: "bot" }]);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <div
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition z-1000"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <AiOutlineClose size={24} /> : <IoChatbubbleEllipsesOutline size={28} />}
      </div>

      {/* Chatbox */}
      <div
        className={`fixed right-6 bottom-25 w-80 md:w-96 bg-white shadow-2xl rounded-xl overflow-hidden transition-all duration-300 transform ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-purple-500 text-white">
          <h2 className="text-lg font-semibold">Chatbot</h2>
          <AiOutlineClose
            size={24}
            className="cursor-pointer"
            onClick={() => setIsOpen(false)}
          />
        </div>

        {/* Chat Messages */}
        <div className="flex flex-col p-4 h-80 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-300">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] p-3 text-sm rounded-lg shadow-md ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="flex items-center p-3 border-t bg-white">
          <input
            type="text"
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            className="bg-purple-600 text-white p-2 rounded-lg ml-2 hover:bg-purple-700 transition"
            onClick={sendMessage}
          >
            <IoSend size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
