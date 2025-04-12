import React, { useState, useRef, useEffect } from 'react';
import './FinanceAssistant.css';
import LearnSection from './LearnSection';
import { domainQuestions } from '../apis/domQues.js';
import { modeQuestions } from '../apis/goalsQues.js';
import { productRecommendationQuestions } from '../apis/productRecmd.js';
import Navb from './nav.jsx';


const FinanceAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I\'m your Finance Assistant 💰. Ask me anything about investing, budgeting, or saving.' },
  ]);

  const [input, setInput] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [domainAnswers, setDomainAnswers] = useState({});
  const [modeAnswers, setModeAnswers] = useState({});
  const chatEndRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behaviour:'smooth' });
    if (selectedMode === 'Product Recommendation' || selectedMode === 'Goals') {
        document.getElementById('form-section')?.scrollIntoView({ behavior: 'smooth' });
      }
  }, [messages,selectedMode]);
 

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
    setDomainAnswers({});
    setSelectedMode(null); // clear any mode
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleModeClick = (mode) => {
    setSelectedMode(mode);
    setModeAnswers({});
    setSelectedDomain(null); // clear any domain
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 200);
  };

  const handleAnswerChange = (index, value, type) => {
    const update = type === 'domain' ? domainAnswers : modeAnswers;
    const setter = type === 'domain' ? setDomainAnswers : setModeAnswers;
    setter({
      ...update,
      [index]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const submittedData = selectedDomain
      ? { type: 'domain', name: selectedDomain, answers: domainAnswers }
      : { type: 'mode', name: selectedMode, answers: modeAnswers };
    console.log('Form Submitted:', submittedData);
    alert('Form submitted successfully!');
  };

  return (
    <div className="chat-wrapper">

        <Navb/>
    <div className='mainheader'>
        <p className='heading'>From Confused to Confident</p>
        <p className='subheading'>Your AI-Powered Partner in Wealth & Wisdom</p>
    </div>

      {/* Domain Selection */}
      <section className="domain-selection">
        <h2>Select the domain!</h2>
        <div className="domain-boxes">
          {Object.keys(domainQuestions).map((domain, i) => (
            <div key={i} className="domain-box" onClick={() => handleDomainClick(domain)}>
              {domain}
            </div>
          ))}
        </div>
      </section>

      {/* Domain or Mode Form */}
      {(selectedDomain || (selectedMode && modeQuestions[selectedMode])) && (
        <section className="domain-form-section" ref={formRef}>
          <h2>{selectedDomain || selectedMode} Questions</h2>
          <form className="domain-form" onSubmit={handleFormSubmit}>
            {(selectedDomain
              ? domainQuestions[selectedDomain]
              : modeQuestions[selectedMode]
            ).map((question, i) => (
              <div className="form-group" key={i}>
                <label>{question}</label>
                <input
                  type="text"
                  value={
                    selectedDomain
                      ? domainAnswers[i] || ''
                      : modeAnswers[i] || ''
                  }
                  onChange={(e) =>
                    handleAnswerChange(
                      i,
                      e.target.value,
                      selectedDomain ? 'domain' : 'mode'
                    )
                  }
                  required
                />
              </div>
            ))}
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </section>
      )}
    
      <div className='secondpage'>
        {/* Mode Selection */}
        <section className="mode-selection">
            <h2>Choose your action!</h2>
            <div className="mode-boxes">
            {['Learn', 'Goals', 'Product Recommendation'].map((mode, i) => (
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

        {/* Learn Section */}
        {selectedMode === 'Learn' && <LearnSection />}

        
        {/* Chat Section */}
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
            <button onClick={handleSend} className="chat-send-btn">Send</button>
            </div>
        </div>
      </div>
      

    {selectedMode === 'Product Recommendation' && (
        <div>
        <h2>Risk Tolerance Questionnaire 🧠</h2>
        {productRecommendationQuestions.map((q, index) => (
            <div key={index} className="question-box">
            <p>{q.question}</p>
            {q.options.map((option, idx) => (
                <label key={idx} className="checkbox-label">
                <input
                    type="checkbox"
                    name={`q${index}`}
                    value={option}
                    className="checkbox-input"
                />
                {option}
                </label>
            ))}
            </div>
        ))}
        </div>
    )}
    </div>
  );
};

export default FinanceAssistant;
