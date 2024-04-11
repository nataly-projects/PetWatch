import bcrypt from 'bcryptjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyringe, faHeartbeat, faMoneyBillAlt, faStickyNote, faAllergies, faPills, faHospital, 
  faMicroscope, faUtensils, faDog, faShower, faScissors, faWeightHanging, faCapsules, faShoppingBasket, faHome, 
  faEllipsisH, faTeeth, faBrush, faEarListen, faPaw, faSoccerBall } from '@fortawesome/free-solid-svg-icons';

const saltRounds = 10; 

export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailRegex.test(email);
};

export const isValidPassword = (password) => {
    //TODO - need to create a validation for password
};

export const hashPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Hashed Password Length:', hashedPassword.length);
    return hashedPassword;
  };


export const isValidPhoneNumber = async (phoneNumber) => {

  // Check if the cleaned phone number is a valid length 
  return phoneNumber.length >= 10 && phoneNumber.length <= 15;
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  // const formattedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} - ${date.getHours()}:${date.getMinutes()}`;
  const formattedDate = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
  return formattedDate;
};


export const petNameIdeas = [
  { letter: 'A', names: ['Amigo', 'Apollo', 'Archie', 'Amber', 'Athena', 'Angel', 'Ace', 'Alfie', 'Annie', 'Atlas', 'Autumn'] },
  { letter: 'B', names: ['Beeri', 'Buddy', 'Bailey', 'Bella', 'Bruno', 'Bear', 'Biscuit', 'Blue', 'Baxter', 'Bonnie', 'Bandit'] },
  { letter: 'C', names: ['Charlie', 'Cooper', 'Coco', 'Chloe', 'Cleo', 'Chester', 'Cookie', 'Cody', 'Cali', 'Chance'] },
  { letter: 'D', names: ['Diablo', 'Daisy', 'Duke', 'Dexter', 'Dixie', 'Diesel', 'Daisy', 'Dolly', 'Duke', 'Dallas', 'Dobby'] },
  { letter: 'E', names: ['Echo', 'Ella', 'Ember', 'Elvis', 'Eli', 'Emma', 'Eddie', 'Evie', 'Eva', 'Ezra'] },
  { letter: 'F', names: ['Finn', 'Freddie', 'Fiona', 'Frankie', 'Fluffy', 'Fletcher', 'Fern', 'Felix', 'Fawn', 'Fox'] },
  { letter: 'G', names: ['Gizmo', 'Gus', 'Ginger', 'George', 'Gracie', 'Gizmo', 'Gabby', 'Gemma', 'Gage', 'Gertie'] },
  { letter: 'H', names: ['Harley', 'Hazel', 'Henry', 'Honey', 'Hank', 'Hunter', 'Hope', 'Hudson', 'Holly', 'Hercules'] },
  { letter: 'I', names: ['Ivy', 'Isaac', 'Indie', 'Isla', 'Igor', 'Isabelle', 'Inky', 'Iggy', 'Iris', 'Ivan'] },
  { letter: 'J', names: ['Jack', 'Jasper', 'Juno', 'Jake', 'Jasmine', 'Jax', 'Jessie', 'Josie', 'Joey', 'Jett'] },
  { letter: 'K', names: ['Koda', 'Katie', 'King', 'Kiki', 'Kobe', 'Kona', 'Kitty', 'Keira', 'Klaus', 'Kiki'] },
  { letter: 'L', names: ['Linda', 'Luna', 'Leo', 'Lola', 'Lucy', 'Loki', 'Lucky', 'Lilly', 'Logan', 'Lexi', 'Lenny'] },
  { letter: 'M', names: ['Mishi', 'Mello', 'Micky', 'Max', 'Molly', 'Milo', 'Mia', 'Mocha', 'Marley', 'Maggie', 'Moose', 'Misty', 'Maverick'] },
  { letter: 'N', names: ['Nala', 'Nova', 'Nico', 'Nellie', 'Nugget', 'Nina', 'Noodle', 'Nyx', 'Norton', 'Nikki'] },
  { letter: 'O', names: ['Oscar', 'Oliver', 'Olive', 'Otis', 'Oreo', 'Ollie', 'Opal', 'Odin', 'Oakley', 'Olive'] },
  { letter: 'P', names: ['Poppy', 'Penny', 'Peanut', 'Piper', 'Pablo', 'Princess', 'Peach', 'Paisley', 'Percy', 'Panda'] },
  { letter: 'Q', names: ['Quinn', 'Queenie', 'Quincy', 'Quest', 'Quasar', 'Quiver', 'Quill', 'Quokka', 'Quartz', 'Quincy'] },
  { letter: 'R', names: ['Rocky', 'Rosie', 'Riley', 'Rusty', 'Ruby', 'Rex', 'Roxy', 'Remi', 'Rufus', 'Raven'] },
  { letter: 'S', names: ['Sam', 'Sophie', 'Sadie', 'Shadow', 'Sasha', 'Scout', 'Simba', 'Sunny', 'Snickers', 'Spike'] },
  { letter: 'T', names: ['Teddy', 'Toby', 'Tucker', 'Trixie', 'Tiger', 'Thor', 'Tilly', 'Tank', 'Tessa', 'Truffle'] },
  { letter: 'U', names: ['Ulysses', 'Umberto', 'Ursula', 'Uno', 'Uri', 'Uma', 'Ugo', 'Ursa', 'Usher', 'Unity'] },
  { letter: 'V', names: ['Violet', 'Vinnie', 'Vinny', 'Vixen', 'Vladimir', 'Valentina', 'Victor', 'Vera', 'Vega', 'Vinnie'] },
  { letter: 'W', names: ['Willow', 'Winston', 'Winnie', 'Wally', 'Waldo', 'Walter', 'Whiskers', 'Wanda', 'Wade', 'Wesley'] },
  { letter: 'X', names: ['Xena', 'Xander', 'Xanthe', 'Xerxes', 'Xavi', 'Xyla', 'Xeroph', 'Ximena', 'Xylon', 'Xabier'] },
  { letter: 'Y', names: ['Yogi', 'Yoda', 'Yara', 'Yasmin', 'Yoshi', 'Yvette', 'Yvonne', 'Yara', 'Yasmine', 'Yael'] },
  { letter: 'Z', names: ['Zeus', 'Ziggy', 'Zara', 'Zelda', 'Zorro', 'Zoe', 'Zane', 'Zephyr', 'Zig', 'Zola'] }
];

export const VaccineRecordType = [
  { name: 'DHPP', icon: faSyringe, value: 'DHPP' },
  { name: 'RABIES', icon: faSyringe, value: 'Rabies' },
  { name: 'VACCINATION_AGAINST_ESOPHAGUS_WORMS', icon: faSyringe, value: 'Vaccination against Esophagus Worms' },
  { name: 'FLEA_AND_TICK', icon: faSyringe, value: 'Flea and Tick Treatment' },
  { name: 'DEWORMING', icon: faSyringe, value: 'Deworming' },
  { name: 'FVRCP', icon: faSyringe, value: 'FVRCP' },
  { name: 'FELV', icon: faSyringe, value: 'FeLV' },
  { name: 'OTHER', icon: faSyringe, value: 'OTHER' }
];

export const RoutineCareActivityItems = [
  { name: 'FEEDING', icon: faUtensils, value: 'Feeding' },
  { name: 'TRAINING', icon: faDog, value: 'Training' },
  { name: 'BRUSHING', icon: faBrush, value: 'Brushing' },
  { name: 'BATHING', icon: faShower, value: 'Bathing' },
  { name: 'NAIL_TRIMMING', icon: faPaw, value: 'Nail Trimming' },
  { name: 'EAR_CLEANING', icon: faEarListen, value: 'Ear Cleaning' },
  { name: 'HAIRֹֹֹCUT', icon: faScissors, value: 'Haircut' },
  { name: 'TEETH_BRUSHING', icon: faTeeth, value: 'Teeth Brushing' },
  { name: 'WEIGHING', icon: faWeightHanging, value: 'Weighing' },
  { name: 'OTHER', icon: faEllipsisH, value: 'Other' }
];

export const ExpenseCategory = [
  { name: 'FOOD', icon: faUtensils, value: 'Food' },
  { name: 'MEDICATION', icon: faCapsules, value: 'Medication' },
  { name: 'VACCINATION', icon: faSyringe, value: 'Vaccinations' },
  { name: 'VET_VISIT', icon: faHospital, value: 'Vet Visit' },
  { name: 'INSURANCE', icon: faMoneyBillAlt, value: 'Insurance' },
  { name: 'ROUTINE_CARE', icon: faHeartbeat, value: 'Routine Care' },
  { name: 'TOYS', icon: faSoccerBall, value: 'Toys' },
  { name: 'RELATED_PRODUCTS', icon: faShoppingBasket, value: 'Related Products' },
  { name: 'HOME_PRODUCTS', icon: faHome, value: 'Home Products' },
  { name: 'TRAINING', icon: faDog, value: 'Training' },
  { name: 'OTHER', icon: faEllipsisH, value: 'Other' }
];

export const ActivityType = [
  { name: 'VACCINE_RECORD', icon: faSyringe, value: 'Vaccine Record', items: true },
  { name: 'ROUTINE_CARE', icon: faHeartbeat, value: 'Routine Care', items: true },
  { name: 'EXPENSE', icon: faMoneyBillAlt, value: 'Expense', items: true },
  { name: 'NOTE', icon: faStickyNote, value: 'Note', items: false },
  { name: 'ALLERGY', icon: faAllergies, value: 'Allergy', items: false },
  { name: 'MEDICATION', icon: faPills, value: 'Medication', items: false },
  { name: 'VET_VISIT', icon: faHospital, value: 'Vet Visit', items: false },
  { name: 'EXAMINATION', icon: faMicroscope, value: 'Examination', items: false },
  { name: 'OTHER', icon: faEllipsisH, value: 'Other', items: false }
];


  