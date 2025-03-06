import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium' }) => {
  return (
    <div className={`spinner ${size}`}>
      <div className="spinner-inner"></div>
    </div>
  );
};

export default LoadingSpinner; 