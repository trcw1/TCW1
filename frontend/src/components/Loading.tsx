import React from 'react';
import '../styles/Loading.css';

interface LoadingProps {
  type?: 'spinner' | 'dots' | 'bars' | 'pulse';
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ type = 'spinner', size = 'medium', text }) => {
  return (
    <div className={`loading-container loading-${size}`}>
      {type === 'spinner' && (
        <div className="spinner">
          <div className="spinner-inner"></div>
        </div>
      )}

      {type === 'dots' && (
        <div className="dots-loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}

      {type === 'bars' && (
        <div className="bars-loader">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      )}

      {type === 'pulse' && (
        <div className="pulse-loader">
          <div className="pulse"></div>
        </div>
      )}

      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;
