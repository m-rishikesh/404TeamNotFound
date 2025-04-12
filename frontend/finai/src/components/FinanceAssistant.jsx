import React, { useState, useRef, useEffect } from 'react';
import './FinanceAssistant.css';
import LearnSection from './LearnSection';
import RiskAssessmentForm from './RiskAssessmentForm';
import { domainQuestions } from '../apis/domQues.js';
import { productRecommendationQuestions } from '../apis/productRecmd.js';
import Navb from './nav.jsx';

const FinanceAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I\'m your Finance Assistant 💰. Ask me anything about investing, budgeting, or saving.' },
  ]);
  const [input, setInput] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [domainAnswers, setDomainAnswers] = useState({});
  const [selectedMode, setSelectedMode] = useState(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [isQuestionnaireComplete, setIsQuestionnaireComplete] = useState(false);
  const chatEndRef = useRef(null);
  const formRef = useRef(null);
  const [showRiskForm, setShowRiskForm] = useState(false);

  const handleSendgenai = async () => {
    if (!input.trim()) return;

    const newUserMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, newUserMessage]);

    try {
      const response = await fetch('http://localhost:8080/getDomain/personalizedtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_query: input }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      console.error('Error fetching AI response:', err);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }

    setInput('');
  };

  const handleDomainSubmittobackend = async (e) => {
    e.preventDefault();
    setIsQuestionnaireComplete(true);

    const payload = {
      domain: selectedDomain,
      question: domainQuestions[selectedDomain],
      answers: Object.values(domainAnswers),
    };

    try {
      const response = await fetch('http://localhost:8080/getDomain/givetest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.text();
      console.log('Backend response:', result);
    } catch (error) {
      console.error('Error sending data:', error);
    }

    setMessages(prev => [
      ...prev,
      { sender: 'bot', text: `You selected ${selectedDomain} and answered: ${JSON.stringify(domainAnswers)}.` },
    ]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (selectedMode === 'Risk Assessment' || selectedMode === 'Goals') {
      document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, selectedMode]);

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
      return 'You can start with mutual funds or SIPs for long-term investment.';
    } else if (lower.includes('save')) {
      return 'Try the 50-30-20 rule: 50% needs, 30% wants, 20% savings.';
    } else if (lower.includes('budget')) {
      return 'Set your income, then track expenses using budgeting tools.';
    } else {
      return 'Sorry, I\'m still learning! Try asking about investing, budgeting, or saving strategies.';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleDomainClick = (domain) => {
    setSelectedDomain(domain);
    setShowQuestionnaire(true);
    setSelectedMode(null);
    setDomainAnswers({});
    setIsQuestionnaireComplete(false);
  };

  const handleAnswerChange = (index, value) => {
    setDomainAnswers({
      ...domainAnswers,
      [index]: value,
    });
  };

  const handleDomainSubmit = (e) => {
    e.preventDefault();
    setIsQuestionnaireComplete(true);
    setMessages(prev => [
      ...prev,
      { sender: 'bot', text: `You selected ${selectedDomain} and your knowledge level is: ${JSON.stringify(domainAnswers)}.` },
    ]);
  };

  const handleModeClick = (mode) => {
    setSelectedMode(mode);
    setSelectedDomain(null);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  return (
    <div className="chat-wrapper">
      <Navb />

      <div className="mainheader">
        <p className="heading">From Confused to Confident</p>
        <p className="subheading">Your AI-Powered Partner in Wealth & Wisdom</p>
      </div>

      {!selectedDomain && (
        <section className="domain-selection">
          <h2>Select the domain!</h2>
          <div className="domain-boxes">
            {Object.keys(domainQuestions).map((domain, i) => (
              <div
                key={i}
                className="domain-box"
                onClick={() => handleDomainClick(domain)}
              >
                <span>{domain}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {showQuestionnaire && selectedDomain && !isQuestionnaireComplete && (
        <section className="domain-form-section" ref={formRef}>
          <h2>How much do you know about {selectedDomain}?</h2>
          <form onSubmit={handleDomainSubmittobackend}>
            {domainQuestions[selectedDomain].map((question, i) => (
              <div key={i} className="form-group">
                <label>{question}</label>
                <input
                  type="text"
                  value={domainAnswers[i] || ''}
                  onChange={(e) => handleAnswerChange(i, e.target.value)}
                  placeholder="Your answer here"
                  required
                />
              </div>
            ))}
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </section>
      )}

      {isQuestionnaireComplete && !selectedMode && (
        <section className="mode-selection">
          <h2>Choose your action!</h2>
          <div className="mode-boxes">
            {['Learn', 'Risk Assessment', 'Goals'].map((mode, i) => (
              <div
                key={i}
                className={`mode-box ${selectedMode === mode ? 'selected' : ''}`}
                onClick={() => handleModeClick(mode)}
              >
                {mode}
              </div>
            ))}
          </div>
        </section>
      )}

      {selectedMode === 'Learn' && isQuestionnaireComplete && (
        <div className="learn-section">
          <LearnSection />
        </div>
      )}

{selectedMode === 'Risk Assessment' && isQuestionnaireComplete && (
  <div id="form-section" ref={formRef}>
    <RiskAssessmentForm />
  </div>
)}

      {isQuestionnaireComplete && selectedDomain && selectedMode !== 'Learn' && (
        <div className="secondpage">
          <div className="chat-box">
            <header className="chat-header">Finance Assistant AI 💸</header>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
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
              <button onClick={handleSendgenai} className="chat-send-btn">Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceAssistant;
