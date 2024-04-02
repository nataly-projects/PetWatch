import React from 'react';
import '../styles/VaccinationPage.css';

const CatVaccinationPage = () => {

    const vaccinations = [
        { name: 'FVRCP vaccine', description: 'Protects against serious and contagious viral diseases. Feline leukemia, Calicivirus, and Rhinotracheitis are included. Chlamydia, if required, should be administered separately. ' },
        { name: 'Rabies vaccine', description: 'Fatal disease that affects many mammals, including humans. Cats that go outdoors and are at risk of being bitten should be vaccinated.' },
        { name: 'FeLV vaccine', description: 'Recommended for cats that live in areas with a high prevalence of FeLV, cats that go outdoors and are exposed to other cats, and cats of susceptible breeds.' },
    ];

    const vaccinationsFrequency = [
        { name: 'FVRCP (Quad/Triple)**', kittenAge: '6-8 weeks, 12-16 weeks, 16-20 weeks', adultCatAge: 'Once a year' },
        { name: 'Rabies', kittenAge: '16-20 weeks', adultCatAge: 'Once every three years'},
        { name: 'FeLV (Optional)', kittenAge: '6-8 weeks, repeat as recommended by veterinarian', adultCatAge: 'Repeat as recommended by veterinarian' }
    ];

    const routineCare = [
        { name: 'Deworming', description: 'It is recommended to give cats a preventive treatment for internal and external parasites once a month.' },
        { name: 'Flea and Tick Control', description: 'It is important to regularly treat for fleas and ticks, both by applying a direct treatment to the cat (such as ampoules) and by treating the environment in which they live.' },
        { name: 'Ear Cleaning', description: 'It is recommended to clean your cat\'s ears regularly using a special cleaning solution.' },
        { name: 'Teeth Brushing', description: 'Daily teeth brushing will help prevent gum disease and tartar buildup.' }
    ];

    const renderVaccineScheduleTable = () => {
        return (
            <table>
             <thead>
                <tr>
                    <th>Vaccine</th>
                    <th>Kitten Age</th>
                    <th>Adult Cat Age</th>
                </tr>
            </thead>
            <tbody>
                {vaccinationsFrequency.map((vaccination, index) => (
                    <tr key={index}>
                        <td>{vaccination.name}</td>
                        <td>{vaccination.kittenAge}</td>
                        <td>{vaccination.adultCatAge}</td>
                    </tr>
                ))}
            </tbody>
            </table>
        );
    };

    return (
        <div className="container">
            <div className="section">
                <h2>Cat Vaccinations and Routine Care</h2>
                <p>Below is a list of common cat vaccinations and their descriptions:</p>
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
                <h2>Cat Vaccination Schedule:</h2>
                {renderVaccineScheduleTable()}
            </div>
           

            <h2>Routine Care:</h2>
            <ul>
                {routineCare.map((care, index) => (
                    <li key={index}>
                        <h3>{care.name}</h3>
                        <p>{care.description}</p>
                    </li>
                ))}
                <p><strong>It is important to consult with a veterinarian about the vaccination program that is most appropriate for your cat.</strong></p>
            </ul>
        </div>
    );
};

export default CatVaccinationPage;
