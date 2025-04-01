import React from 'react';
import { Plus } from 'lucide-react';

function ChatInterface({ messages, newMessage, setNewMessage, handleSendMessage, walletAddress }) {
  return (
    <div className="flex flex-col h-96 border rounded-lg shadow-md overflow-hidden">
      {/* Chat Messages Display */}
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="mb-2">
            <span className="font-bold">{message.sender === walletAddress ? 'You' : 'Other'}:</span> {message.text}
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="bg-gray-700 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-grow bg-gray-800 text-white border border-gray-600 rounded-full py-2 px-4 focus:outline-none focus:border-blue-500"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline"
          >
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;