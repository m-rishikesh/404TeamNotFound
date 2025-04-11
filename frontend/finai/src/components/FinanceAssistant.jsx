import React, { useState, useRef, useEffect } from 'react';
import './FinanceAssistant.css';

const FinanceAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I\'m your Finance Assistant 💰. Ask me anything about investing, budgeting, or saving.' },
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newUserMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, newUserMessage]);

    setTimeout(() => {
      const botReply = generateFakeFinanceResponse(input);
      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);

    setInput('');
  };

  const generateFakeFinanceResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('invest')) {
      return 'You can start with mutual funds or SIPs for long-term investment. Want options based on risk level?';
    } else if (lower.includes('save')) {
      return 'Try the 50-30-20 rule: 50% needs, 30% wants, 20% savings.';
    } else if (lower.includes('budget')) {
      return 'Set your income, then track expenses. I recommend using apps or a spreadsheet.';
    } else {
      return 'Sorry, I\'m still learning! Try asking about investing, budgeting, or saving strategies.';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-wrapper">

      {/* Navbar */}
      <nav className="navbar">
        <h1>FinAI</h1>
      </nav>

      {/* Domain Selection */}
      <section className="domain-selection">
        <h2>Select the domain!</h2>
        <div className="domain-boxes">
          {['Stocks', 'SIP', 'Mutual Funds', 'IPO'].map((domain, i) => (
            <div key={i} className="domain-box">
              {domain}
            </div>
          ))}
        </div>
      </section>

      {/* Chat Section */}
      <div className="chat-box">
        <header className="chat-header">
          Finance Assistant AI 💸
        </header>

        <div className="chat-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="chat-input-section">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your finance question..."
            className="chat-input"
          />
          <button
            onClick={handleSend}
            className="chat-send-btn"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinanceAssistant;
