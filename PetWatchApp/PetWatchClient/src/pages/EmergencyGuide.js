import React from 'react';
import '../styles/EmergencyGuide.css';

const EmergencyGuide = () => {
    return (
        <div className="emergency-page">
          <h1>Emergency Care for Pets</h1>
          <div className="emergency-section">
          <h2>Important Information</h2>
            <ul>
                <li>Know your veterinarian's contact information and emergency clinic's hours and location.</li>
                <li>Keep a pet first aid kit with essentials like bandages, gauze, antiseptic, and a thermometer.</li>
                <li>Know your pet's normal vital signs and behavior to recognize abnormalities.</li>
                <li>Learn pet CPR and first aid techniques.</li>
            </ul>
            <h2>Basic Emergency Care</h2>
            <p>
              In case of emergency, it's important to remain calm and take immediate action to ensure the safety and well-being of your pet. Here are some basic steps to follow:
            </p>
            <ul>
                <li>Assess the situation and ensure your own safety first.</li>
                <li>Stay calm and assess the situation.</li>
                <li>Secure your pet to prevent further injury.</li>
                <li>Administer basic first aid if necessary.</li>
                <li>Contact your veterinarian or emergency clinic immediately.</li>
                <li>Transport your pet to the nearest veterinary clinic or emergency facility as quickly as possible.</li>
            </ul>
          </div>
          <div className="emergency-section">
            <h2>CPR for Pets</h2>
            <p>
              CPR (Cardiopulmonary Resuscitation) may be necessary if your pet is not breathing or does not have a heartbeat. Here's how to perform CPR on pets:
            </p>
            <p>Basic steps for pet CPR:</p>
            <ol>
                <li>Check for responsiveness.</li>
                <li>Place your pet on a flat surface.</li>
                <li>Clear the airway and check breathing.</li>
                <li>Perform chest compressions and rescue breaths.</li>
                <li>Continue until your pet regains consciousness or until you reach the veterinarian.</li>
            </ol>

            <h2>CPR for Dogs and Cats</h2>
            <p><strong>Locating the Heart:</strong> For both dogs and cats, the heart is located in the chest cavity, 
            just behind the front legs. You can feel the heartbeat by placing your hand on the left side of the chest, 
            behind the elbow.</p>
            <p><strong>Performing Chest Compressions:</strong> Before starting CPR, assess responsiveness. Ensure the 
            airway is clear and check for breathing. <br></br>
            <span className="underline" > For dogs -</span>  lay them on their right side and place the heel of one hand over the widest part 
            of the chest. <br></br>
            <span className="underline" >For cats -</span> lay them on their right side and cup your hands over the widest part of the chest. 
            Perform chest compressions to the rhythm of "Stayin' Alive" by the Bee Gees.</p>
            <p><strong>Performing Rescue Breaths:</strong> After every 30 chest compressions, give two rescue breaths. <br></br>
            <span className="underline" >For dogs -</span> close the mouth and breathe into the nose. <br></br>
            <span className="underline" >For cats -</span> cover the mouth and nose with your mouth and give short, sharp breaths.</p>
            <p>Note: Proper training in pet CPR and first aid is essential. Consult with your veterinarian or local animal hospital for training opportunities.</p>
         
          </div>
        </div>
      );
};

export default EmergencyGuide;
