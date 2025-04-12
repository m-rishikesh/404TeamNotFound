import React, { useEffect, useState } from 'react';
import './LearnSection.css';

const LearnSection = () => {
  const [videoLinks, setVideoLinks] = useState({
    'Stocks': [],
    'IPO': [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Ask me anything about this video!' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  
  const handleSendMessage = () => {
    if (!userInput.trim()) return;
  
    const userMessage = { from: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setIsLoadingResponse(true);
  
    // Make a POST request to send the user's query
    fetch('http://localhost:8080/top10ytquery/chatquery', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ chatquery: userInput }),  // Send user input as JSON
    })
      .then(res => res.json())
      .then(data => {
        const aiMessage = { from: 'ai', text: data.answer || 'Sorry, no answer found.' };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoadingResponse(false);
      })
      .catch(err => {
        const errorMsg = { from: 'ai', text: 'Something went wrong. Please try again.' };
        setMessages(prev => [...prev, errorMsg]);
        setIsLoadingResponse(false);
      });
  
    setUserInput('');
  };
  
  

  useEffect(() => {
    const fetchStocks = fetch('http://localhost:8080/top10ytquery?q=Learning Video on Stocks')
      .then(res => res.json())
      .then(data => ({ Stocks: data }));

    const fetchIPO = fetch('http://localhost:8080/top10ytquery?q=Learning Video on IPO')
      .then(res => res.json())
      .then(data => ({ IPO: data }));

    Promise.all([fetchStocks, fetchIPO])
      .then(([stocksData, ipoData]) => {
        setVideoLinks(prev => ({
          ...prev,
          ...stocksData,
          ...ipoData,
        }));
        setLoading(false);
      });
  }, []);

  const extractVideoId = (url) => {
    const match = url.match(/v=([^&]+)/);
    return match ? match[1] : null;
  };

  return (
    <div className="learn-section">
      <h2>Learn About Domains</h2>
      {loading ? (
        <p className="loading-message">Loading videos, please wait...</p>
      ) : (
        Object.entries(videoLinks).map(([domain, videos]) => (
          <div className="domain-learn-box" key={domain}>
            <h3>{domain}</h3>
            <div className="video-slider">
              {videos.map((video, index) => (
                <div className="video-card" key={index} onClick={() => setSelectedVideo(video)}>
                  <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                  <p className="video-title">{video.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

            {/* Modal */}
            {selectedVideo && (
        <div className="modal-overlay" onClick={() => setSelectedVideo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${extractVideoId(selectedVideo.link)}?autoplay=1`}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            <div className="modal-chat">
              <h4>Ask AI</h4>
              <div className="chat-box">
                {messages.map((msg, i) => (
                  <p key={i} style={{ textAlign: msg.from === 'user' ? 'right' : 'left' }}>
                    <strong>{msg.from === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
                  </p>
                ))}
                {isLoadingResponse && <p><strong>AI:</strong> Typing...</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  className="chat-input"
                  placeholder="Ask something..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage} className="send-button">Send</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LearnSection;
