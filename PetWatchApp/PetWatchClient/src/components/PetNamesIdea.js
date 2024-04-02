import React from "react";
import {petNameIdeas} from '../utils/utils';
import "../styles/PetNamesIdea.css"; 

const PetNamesIdea = () => {

  const handleLetterClick = (letter) => {
    // Get the corresponding section element by ID
    const sectionId = `letter-section-${letter}`;
    const sectionElement = document.getElementById(sectionId);
  
    // Get the height of any fixed elements (e.g., header)
    const headerHeight = document.getElementById('header').offsetHeight; // Adjust 'header' to match your actual header element
    
    // Scroll to the section with an offset to compensate for fixed elements
    if (sectionElement) {
      const sectionTop = sectionElement.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: sectionTop - headerHeight*2, behavior: "smooth" });
    }
  };

  return (
    <div className="names-container">
      <div id='header' className="header">
        <h1>Finding The Perfect Pet Name</h1>
        <div className="letters-container">
          {petNameIdeas.map(({ letter }) => (
            <div key={letter} className="letter-circle" onClick={() => handleLetterClick(letter)}>
              {letter}
            </div>
          ))}
        </div>
      </div>
    
      <div className="desciption-section">
        <p>
          Choosing the most suitable name for your pet is a significant yet not always simple task.
          A pet's name is more than just a label; it helps identify and strengthens their self-concept,
          forming a crucial part of the bond between the pet and its owner.
        </p>
        <p>
          Calling your pet by its name enhances comfort and security, making training and bonding processes easier.
          Now that we understand the importance of a pet's name, the question remains: how to choose the perfect name
          that will accompany them for a lifetime?
        </p>
        <p>
          Some people base a pet's name on sex, breed, or color, while others prefer names inspired by relatives or loved ones.
          There's also the belief that a pet's name should be unique, reflecting their personality. Many turn to online name
          databases for inspiration.
        </p>
        <p>
          To assist you in finding the perfect name for your beloved pet, we've prepared suggestions and original ideas.
          Explore the sections below for names starting with each letter of the alphabet.
        </p>
      </div>

      {petNameIdeas.map(({ letter, names }) => (
        <div key={letter} className="letter-section" id={`letter-section-${letter}`}>
          <h2>{letter}</h2>
          <div className="name-grid">
            {names.map((name, index) => (
              <div key={index} className="name-item">{name}</div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetNamesIdea;
