import '../styles/ImportantInfoPage.css';
import React from "react";
import { Link } from "react-router-dom";

const InfoGridItem = ({ to, labelText, imageSrc  }) => {

  return (
    <Link to={to} className="info-item">
      <div className="info-circle">
      {imageSrc && <img src={imageSrc} alt="Info Image" className="grid-image" />}
      </div>
      <p>{labelText}</p>
    </Link>
  );
};

export default InfoGridItem;
