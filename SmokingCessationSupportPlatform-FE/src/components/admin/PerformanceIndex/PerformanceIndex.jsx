import React from 'react';
import './PerformanceIndex.css';

const PerformanceIndex = () => {
  return (
    <div className="performance-index">
      
      <div className="performance-cards">
        <div className="performance-card">
          <h3 className="card-title">Success rate of quitting smoking</h3>
          <div className="progress-circle">
            <div className="circle-container">
              <svg width="120" height="120" className="progress-svg">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#e3e8f7"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="#4285f4"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="314"
                  strokeDashoffset="138"
                  className="progress-circle-bar"
                />
              </svg>
              <div className="percentage">56%</div>
            </div>
          </div>
          <p className="card-description">
            Percentage of users who reported successfully quitting smoking after using the platform.
          </p>
        </div>

        <div className="performance-card">
          <h3 className="card-title">System stability index</h3>
          <div className="stability-metrics">
            <div className="metric-item">
              <span className="metric-label">Uptime</span>
              <span className="metric-value uptime">99.98 %</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Error Rate</span>
              <span className="metric-value error-rate">0.05 %</span>
            </div>
          </div>
          <p className="card-description">
            Tracked in the last 7 days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceIndex;