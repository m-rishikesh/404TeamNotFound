import React from 'react';
import './LearnSection.css';

const videoLinks = {
  'Stocks': [
    'https://www.youtube.com/embed/9J9jYgZJvoY',
    'https://www.youtube.com/embed/O_CbT-pYpBo',
    'https://www.youtube.com/embed/PHe0bXAIuk0',
    'https://www.youtube.com/embed/nAFlG0mXR8E',
  ],
  'SIP': [
    'https://www.youtube.com/embed/TnGnVd0VLCg',
    'https://www.youtube.com/embed/BVfCWuca9nw',
    'https://www.youtube.com/embed/tB2O0wXcNPo',
    'https://www.youtube.com/embed/dTL7zbZMlH4',
  ],
  'Mutual Funds': [
    'https://www.youtube.com/embed/BMcCqGvZ6NY',
    'https://www.youtube.com/embed/IgR7L1jV9vE',
    'https://www.youtube.com/embed/jzZ5p7JkDUw',
    'https://www.youtube.com/embed/pPNzqXLS1yo',
  ],
  'IPO': [
    'https://www.youtube.com/embed/MgSY5pHHm-8',
    'https://www.youtube.com/embed/VlRt95zFpdY',
    'https://www.youtube.com/embed/C5v9Ar7z3s8',
    'https://www.youtube.com/embed/lTrB8jBEJjU',
  ]
};

const LearnSection = () => {
  return (
    <div className="learn-section">
      <h2>Learn About Domains </h2>
      {Object.entries(videoLinks).map(([domain, links]) => (
        <div className="domain-learn-box" key={domain}>
          <h3>{domain}</h3>
          <div className="video-grid">
            {links.map((link, index) => (
              <div className="video-box" key={index}>
                <iframe
                  width="100%"
                  height="200"
                  src={link}
                  title={`YouTube video for ${domain} ${index}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LearnSection;
