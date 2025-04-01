import React, { useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, getWalletAddress, spawnProcess, messageAR } from './arweaveFunctions';
import ChatInterface from './components/ChatInterface';
import { Home, Users, Settings, Mail, Plus } from 'lucide-react';
const pId = "oBND0IgrBTgHGUk4UdL1-1yBUn0WA4NYdA2RUCeVVUY"

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [processId, setProcessId] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      const address = await getWalletAddress();
      setWalletAddress(address || '');
      setIsConnected(!!address);
    } catch (error) {
      console.error("Wallet not connected", error);
      setIsConnected(false);
    }
  };

  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      await connectWallet();
      const address = await getWalletAddress();
      setWalletAddress(address);
      setIsConnected(true);
    } catch (error) {
      console.error("Connection error:", error);
      setIsConnected(false);
      alert("Failed to connect wallet.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectWallet = async () => {
    setLoading(true);
    try {
      await disconnectWallet();
      setWalletAddress('');
      setProcessId('');
      setMessages([]);
      setIsConnected(false);
    } catch (error) {
      console.error("Disconnection error:", error);
      alert("Failed to disconnect wallet.");
    } finally {
      setLoading(false);
    }
  };

  const pId ="oBND0IgrBTgHGUk4UdL1-1yBUn0WA4NYdA2RUCeVVUY"

  

  const handleSendMessage = async () => {
    if (!newMessage) return;
   
    setLoading(true);
    try {
      const messageId = await messageAR({ process: pId, data: newMessage });
      setMessages(prevMessages => [...prevMessages, { id: messageId, text: newMessage, sender: walletAddress }]);
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message", error);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-900 to-blue-700 text-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">AO Chat</h1>
        <div>
          {loading && <span className="mr-2">Loading...</span>}
          {isConnected ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}</span>
              <button onClick={handleDisconnectWallet} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Disconnect Wallet</button>
            </div>
          ) : (
            <button onClick={handleConnectWallet} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Connect Wallet</button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow p-4 flex flex-col items-center">
         
          <div className="w-full max-w-2xl">
            <p className="mb-2">Process ID: {pId}</p>
            <ChatInterface messages={messages} newMessage={newMessage} setNewMessage={setNewMessage} handleSendMessage={handleSendMessage} walletAddress={walletAddress} />
          </div>
       
      </main>

      {/* Footer/Navigation */}
      <footer className="bg-gray-800 p-4">
        <nav className="flex justify-around">
          <a href="#" className="hover:text-gray-300"><Home /> Home</a>
          <a href="#" className="hover:text-gray-300"><Users /> Community</a>
          <a href="#" className="hover:text-gray-300"><Mail /> Messages</a>
          <a href="#" className="hover:text-gray-300"><Settings /> Settings</a>
        </nav>
      </footer>
    </div>
  );
}

export default App;