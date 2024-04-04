import React from 'react';
import '../styles/VaccinationPage.css';
import fruitsCanEatImg from '../images/catFruitCanEat.jpg';
import meatCanEatImg from '../images/catMeatCanEat.jpg';
import otherCanEatImg from '../images/catOtherCanEat.jpg';
import eatCautiousImg from '../images/catEatCautious.jpg';
import notToEatImg from '../images/catNotEat.jpg';

const CatCarePage = () => {

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
            <div className="section">
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
            <h2>Feeding Your Cat</h2>
            <h3>What Can Cats Eat?</h3>
            <p>
            Cats can enjoy a variety of foods that are beneficial for their health. Here are some foods that cats can eat:
            </p>
            <ul>
                <li><strong>Fruit and Vegetables:</strong>Apples, bananas, strawberries, carrots, and other fruits and vegetables are rich in vitamins, minerals, fiber, and protein.
                </li>
                <img src={fruitsCanEatImg} alt= 'fruits and vagetables cats can eat'/>
                <li><strong>Meat & Fish:</strong> Chicken, beef, salmon, and other meats and fish are high in protein and essential fatty acids.
                <img src={meatCanEatImg} alt= 'meats and fish cats can eat' />
                </li>
                <li><strong>Other Foods:</strong> Grains, dairy, and eggs can also be given to cats in moderation.
                <img src={otherCanEatImg} alt= 'other foods cats can eat' />
                </li>
            </ul>
            <h3>Foods to Be Cautious About</h3>
            <p>
            Foods in this group are ones that can be given to your cat, but you should be cautious about them. In general, what cats eat should be monitored, but with these, you need to be extra careful; most of these foods should be given to your cat in small quantities as too much can cause them potential harm. Others are foods that you need to watch carefully when giving your cat. For example, your cat can enjoy gnawing on a bone, but they can splinter and become sharp and dangerous so will then need to be taken away and safely disposed of if this happens.
            <img src={eatCautiousImg} alt='food to be cautious about giving your cat'/>
            </p>
            
            <h3>What Can Cats Not Eat?</h3>
            <p>
            Certain foods are toxic to cats and should be avoided. Here are some foods that cats can't eat
            </p>
                <ul>
                <li><strong>Chocolate:</strong> Contains theobromine and caffeine, which are toxic to cats.</li>
                <li><strong>Onions and Garlic:</strong> Can cause damage to a cat's red blood cells.</li>
                <li><strong>Grapes and Raisins:</strong> Can cause kidney failure in cats.</li>
                <img src={notToEatImg} alt= 'foods cats cant eat' />
            </ul>
            <h3>Summary</h3>
            <p>
            Understanding what cats can and can't eat is crucial for their health. While some human foods can be incorporated into their diet, others should be avoided entirely. By providing a balanced diet and avoiding harmful foods, you can ensure your cat stays healthy and happy.
            </p>

        </div>
    );
};

export default CatCarePage;
