import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/DashboardCard.css';

const DashboardCard = ({ title, icon, content }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-content">
          <FontAwesomeIcon icon={icon} size="2x" />
          <div className="dashboard-card-info">
              <p>{title}</p>
              <h3>{content}</h3>
          </div>
      </div>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired, 
  content: PropTypes.string.isRequired,
};

export default DashboardCard;