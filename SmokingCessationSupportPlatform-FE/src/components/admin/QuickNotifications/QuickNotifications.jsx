import React from 'react';
import './QuickNotifications.css';

const notifications = [
  {
    title: 'Blog Posts Pending Approval (5)',
    description: 'There are new posts from coaches or admins that need to be reviewed and approved.',
    action: 'See details',
  },
  {
    title: 'Community content requiring moderation (2)',
    description: 'Some posts or comments in the community have been flagged and need your review.',
    action: 'Review Now',
  },
  {
    title: 'New comments pending (10)',
    description: 'The user has submitted a new feedback or question that needs to be answered.',
    action: 'Read feedback',
  },
];

const QuickNotifications = () => (
  <div className="quick-notifications">
    <h2 className="quick-notifications__title">Quick Notifications & Moderation</h2>
    <div className="quick-notifications__grid">
      {notifications.map((item, idx) => (
        <div className="quick-notifications__card" key={idx}>
          <div className="quick-notifications__card-title">{item.title}</div>
          <div className="quick-notifications__card-desc">{item.description}</div>
          <div className="quick-notifications__card-action">{item.action}</div>
        </div>
      ))}
    </div>
  </div>
);

export default QuickNotifications;