import React from "react";
import InfoGridItem from "../components/InfoGridItem"; 
import petTagNameIcon from "../images/tag_name.png";
import dogVaccineIcon from "../images/dog_vaccine.png"
import catVaccineIcon from "../images/cat_vaccine.png"
import catIcon from "../images/cat.png";
import dogIcon from "../images/dog.png";
import emergencyIcon from "../images/emergency.png";
import '../styles/ImportantInfoPage.css';


const ImportantInfoPage = () => {
  return (
    <div>
      {/* <div className='info-image'>
        <h2> Information for pets owner </h2>
      </div> */}
      
      <div className="info-grid">
      <InfoGridItem to="/info/dog-care" labelText="Dogs Care Routine" imageSrc={dogVaccineIcon}/>
      <InfoGridItem to="/info/cat-care" labelText="Cats Care Routine" imageSrc={catVaccineIcon}/>
      <InfoGridItem to="/info/pet-names" labelText="Pet Names Idea" imageSrc={petTagNameIcon}/>
      <InfoGridItem to="/info/dog-guide" labelText="Dog Guide" imageSrc={dogIcon}/>
      <InfoGridItem to="/info/cat-guide" labelText="Cat Guide" imageSrc={catIcon}/>
      <InfoGridItem to="/info/emergency-guide" labelText="Emergency Guide" imageSrc={emergencyIcon}/>
      </div>
    </div>
  );
};

export default ImportantInfoPage;
