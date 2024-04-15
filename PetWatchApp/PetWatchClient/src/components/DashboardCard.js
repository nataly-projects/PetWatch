import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/DashboardCard.css';

const DashboardCard = ({ title, icon, content }) => {
  return (
    <div className="card">
        <div className='title-section'>
            <FontAwesomeIcon icon={icon} className="card-icon" />
            <h2 className="card-title">{title}</h2>
        </div>
      <p className="card-content">{content}</p>
    </div>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired, 
  content: PropTypes.string.isRequired,
};

export default DashboardCard;