import React from 'react';
import '../styles/VaccinationPage.css';
import fruitsCanEatImg from '../images/dogFruitsCanEat.jpg';
import meatCanEatImg from '../images/dogMeatCanEat.jpg';
import otherCanEatImg from '../images/dogOtherCanEat.jpg';
import eatCautiousImg from '../images/dogEatCautious.jpg';
import notToEatImg from '../images/dogNotEat.jpg';

const DogVaccinationPage = () => {
    const vaccinations = [
        { name: 'Multivalent Vaccine - DHPP', description: 'A vaccine that contains protection against 6 contagious diseases (among them also Parvo) that are dangerous for pups and adult dogs. The vaccine is given the first time at the age of 6 to 8 weeks and must be repeated twice after two-weeks gaps (all together a series of 3 multivalent Vaccine shots). Afterwards, or when referring to a dog above 1 year old, the vaccine is given once a year.' },
        { name: 'Rabies Vaccinations', description: 'An obligatory vaccine for all dogs that are 3 months old against the rabies disease which is contagious also to humans. The vaccination is given once a year. With the first rabies vaccine, it is obligatory to inject an electronic chip into the dog, which is done only once in the dog’s life.' },
        { name: 'Vaccination against Esophagus Worms/Park Worms (Spirocerca Lupi)', description: 'In actuality, this is not a vaccination but a preventive treatment for specific worms that can cause death by tearing the main artery-aorta and by migrating to the esophagus and there causing tumors that can develop to cancer.' },
        { name: 'Deworming Treatment (pills)', description: 'Treatment against internal parasites (such as intestinal worms and tapeworms).' },
        { name: 'Flea and Tick Treatment', description: 'There are various flea and tick treatment options available, including topical treatments, collars, sprays, shampoos, and oral medications.' },
    ];

    const routineCare = [
        { name: 'Brushing', 
        description: 'Regular brushing helps remove dead fur, dirt, and prevents mats.',
        frequency: ['Short-haired dogs: Once a week.', 'Medium-haired dogs: Twice a week.', 'Long-haired dogs: 3-4 times a week.'] },
        { name: 'Bathing', 
        description: 'Bathing as needed, using a shampoo designed for dogs.',
        frequency: ['Short-haired dogs: Once a month.', 'Medium-haired dogs: Once every two weeks.', 'Long-haired dogs: As needed, using a shampoo designed for dogs.'] },
        { name: 'Nail trimming', 
        description: 'Regular nail trimming prevents discomfort and injuries.',
        frequency: ['Once a month.'] },
        { name: 'Ear cleaning', 
        description: 'Regular ear cleaning prevents ear infections.',
        frequency: ['Once a week.'] },
        { name: 'Teeth brushing', 
        description: 'Regular teeth brushing prevents gum disease and tartar buildup.',
        frequency: ['3-4 times a week.'] },
    ];

    const puppyVaccineSchedule = [
        { age: '6–8 Weeks', vaccines: ['DHPP - first dose', 'Deworming'], additonal: [] },
        { age: '10–12 Weeks', vaccines: ['DHPP - second dose', 'Deworming'], additonal: []}, 
        { age: '14–16 Weeks', vaccines: ['DHPP - third dose', 'Rabies', 'Vaccination against Esophagus Worms'], additonal: ['Chip'] }
    ];
  
    const adultDogVaccineSchedule = [
    { frequency: 'Every 3 month', vaccines: ['Vaccination against Esophagus Worms'] },
    { frequency: 'Every 3 month', vaccines: ['Flea and Tick Treatment'] },
    { frequency: 'Every 6 month', vaccines: ['Deworming'] },
    { frequency: 'Evrey year', vaccines: ['Rabies', 'DHPP'] }
    ];


    const renderPuppyVaccineScheduleTable = () => {
        return (
            <table>
            <thead>
                <tr>
                <th>Age</th>
                <th>Vaccines</th>
                <th>Additonal</th>
                </tr>
            </thead>
            <tbody>
                {puppyVaccineSchedule.map((item, index) => (
                <tr key={index}>
                    <td>{item.age}</td>
                    <td>{item.vaccines.join(', ')}</td>
                    <td>{item.additonal.join(', ')}</td>
                </tr>
                ))}
            </tbody>
            </table>
        );
    };

    const renderAdultDogVaccineScheduleTable = () => {
        return (
            <table>
            <thead>
                <tr>
                <th>Frequency</th>
                <th>Vaccines</th>
                </tr>
            </thead>
            <tbody>
                {adultDogVaccineSchedule.map((item, index) => (
                <tr key={index}>
                    <td>{item.frequency}</td>
                    <td>{item.vaccines.join(', ')}</td>
                </tr>
                ))}
            </tbody>
            </table>
        );
    };

    const renderRoutineCareList = () => (
      <ul>
          {routineCare.map((item, index) => (
              <li key={index}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <p><strong>Frequency:</strong></p>
                  <ul>
                      {item.frequency.map((freq, i) => (
                          <li key={i}>{freq}</li>
                      ))}
                  </ul>
              </li>
          ))}
      </ul>
  );

  return (
    <div className="container">
        <div className="section">
        <h2>Dog Vaccinations and Routine Care</h2>
        <p>Below is a list of common dog vaccinations and their descriptions:</p>
        <ul>
            {vaccinations.map((vaccination, index) => (
            <li key={index}>
                <h3>{vaccination.name}</h3>
                <p>{vaccination.description}</p>
            </li>
            ))}
        </ul>
      </div>
      <div className="section">
        <h2>Puppy Vaccine Schedule</h2>
        <p>For puppy vaccines to provide necessary protection, they’re given every two to four weeks until a puppy is at least 16 weeks old. </p>
        <p>Here’s an example of what a typical puppy shot schedule looks like:</p>
        {renderPuppyVaccineScheduleTable()}

        <h2>Adult Dog Vaccine Schedule</h2>
        <p>A dog vaccination schedule for an adult dog may look like this:</p>
        {renderAdultDogVaccineScheduleTable()}

        <h2>Microchipping</h2>
        <p>Microchipping is a safe and permanent way to identify your dog and increase the chances of being reunited if they are lost or stolen.</p>
     </div>
     <div className="section">
        <h2> Routine Care:</h2>
        {renderRoutineCareList()}
        <ul>
        <strong>It is important to note that this is just a general recommendation, and the frequency of grooming may vary depending on several factors: </strong>
          <li><strong>Dog breed:</strong> Each breed has different needs.</li>
          <li><strong>Coat type:</strong> Long hair requires more frequent grooming.</li>
          <li><strong>Lifestyle:</strong> Dogs that are more active tend to get dirtier faster.</li>
          <li><strong>Dog's health:</strong> Dogs with skin problems or allergies may need special grooming.</li>
          <strong>It is important to consult with a veterinarian about the frequency and treatments most appropriate for your dog.</strong>
        </ul>
      </div>
      <h2>Feeding Your Dog</h2>
      <h3>What Can Dogs Eat?</h3>
      <p>
        Dogs can enjoy a variety of foods that provide essential nutrients to complement their regular diet. Some safe and healthy options include:
      </p>
      <ul>
        <li><strong>Fruit and Vegetables:</strong> Apples, bananas, strawberries, carrots, and other fruits and 
        vegetables are rich in vitamins, minerals, fiber, and protein.
        <img src={fruitsCanEatImg}></img>
        </li>
        <li><strong>Meat & Fish:</strong> Chicken, beef, salmon, and other meats and fish are high in protein 
        and essential fatty acids.
        <img src={meatCanEatImg}></img>
        </li>
        <li><strong>Other Foods:</strong> Grains, dairy, and eggs can also be given to dogs in moderation.
        <img src={otherCanEatImg}></img>
        </li>
      </ul>

      <h3>Foods to Be Cautious About</h3>
      <p>
        While not toxic, some human foods should be given to dogs in moderation to prevent potential issues. 
        These include grains, dairy products, and certain vegetables.
        <img src={eatCautiousImg}></img>
      </p>

      <h3>What Can Dogs Not Eat?</h3>
      <p>
        Certain foods are toxic to dogs and should be avoided at all costs, including chocolate, caffeine, grapes, 
        and certain vegetables. It's important to be aware of these foods to protect your dog's health.
        <img src={notToEatImg}></img>
      </p>
      <h3>Summary</h3>
      <p>
        Knowing what foods are safe and harmful to dogs is crucial for their health and well-being. While pre-made dog food can be convenient, incorporating natural foods like fruits, vegetables, meats, and fish into their diet can provide additional nutrients. By avoiding toxic foods and feeding them a balanced diet, you can ensure your dog stays healthy and happy.
      </p>

    </div>
  );
};

export default DogVaccinationPage;
