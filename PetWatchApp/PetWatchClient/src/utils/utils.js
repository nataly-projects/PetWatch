import bcrypt from 'bcryptjs';
import { faSyringe, faHeartbeat, faMoneyBillAlt, faStickyNote, faAllergies, faPills, faHospital, 
  faUtensils, faDog, faShower, faScissors, faWeightHanging, faCapsules, faShoppingBasket, faHome, 
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
  return hashedPassword;
};


export const isValidPhoneNumber = async (phoneNumber) => {
  // Check if the phone number is a valid length 
  return phoneNumber.length >= 10 && phoneNumber.length <= 15;
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDate = `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
  return formattedDate;
};

export const formatDateUniversal = (date) => {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

export const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - (offset * 60000));
  return localDate.toISOString().slice(0, 16);
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
  { name: 'OTHER', icon: faEllipsisH, value: 'Other' }
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
  { name: 'VACCINATION', icon: faSyringe, value: 'Vaccination' },
  { name: 'VET_VISIT', icon: faHospital, value: 'Vet Visit' },
  { name: 'INSURANCE', icon: faMoneyBillAlt, value: 'Insurance' },
  { name: 'ROUTINE_CARE', icon: faHeartbeat, value: 'Routine Care' },
  { name: 'TOYS', icon: faSoccerBall, value: 'Toys' },
  { name: 'RELATED_PRODUCTS', icon: faShoppingBasket, value: 'Related Products' },
  { name: 'HOME_PRODUCTS', icon: faHome, value: 'Home Products' },
  { name: 'TRAINING', icon: faDog, value: 'Training' },
  { name: 'OTHER', icon: faEllipsisH, value: 'Other' }
];

export const ActivityTypeObject = [
  { name: 'VACCINE_RECORD', icon: faSyringe, value: 'Vaccine Record', items: true },
  { name: 'ROUTINE_CARE', icon: faHeartbeat, value: 'Routine Care', items: true },
  { name: 'EXPENSE', icon: faMoneyBillAlt, value: 'Expense', items: true },
  { name: 'NOTE', icon: faStickyNote, value: 'Note', items: false },
  { name: 'ALLERGY', icon: faAllergies, value: 'Allergy', items: false },
  { name: 'MEDICATION', icon: faPills, value: 'Medication', items: false },
  { name: 'VET_VISIT', icon: faHospital, value: 'Vet Visit', items: false },
  { name: 'MEDICAL_CONDITION', icon: faHospital, value: 'Medical Condition', items: false },
  { name: 'OTHER', icon: faEllipsisH, value: 'Other', items: false }
];

export const ExpensesType = {
  FOOD:'Food',
  MEDICATION:'Medication',
  VACCINATION:'Vaccination',
  INSURANCE:'Insurance',
  ROUTINE_CARE:'Routine Care',
  VET_VISIT:'Vet Visit',
  TOYS:'Toys',
  HOME_PRODUCTS: 'Home Products',
  RELATED_PRODUCTS: 'Related Products',
  TRAINING: 'Training',
  OTHER: 'Other'
};

export const ActivityType = {
  VACCINE_RECORD:'Vaccine Record',
  ROUTINE_CARE:'Routine Care',
  EXPENSE:'Expense',
  ALLERGY:'Allergy',
  MEDICATION:'Medication',
  VET_VISIT:'Vet Visit',
  NOTE:'Note',
  WEIGHT: 'Weight',
  MEDICAL_CONDITION: 'Medical Condition',
  TASK: 'Task'
};



export const Currency = {
  USD: { name: 'USD - United States Dollar', value:'USD', sign: '$' },
  EUR: { name: 'EUR - Euro', value:'EUR', sign: '€' },
  GBP: { name: 'GBP - British Pound Sterling', value:'GBP', sign: '£' },
  JPY: { name: 'JPY - Japanese Yen', value:'JPY', sign: '¥' },
  CAD: { name: 'CAD - Canadian Dollar', value:'CAD', sign: '$' },
  AUD: { name: 'AUD - Australian Dollar', value:'AUD', sign: '$' },
  CHF: { name: 'CHF - Swiss Franc', value:'CHF', sign: 'CHF' },
  CNY: { name: 'CNY - Chinese Yuan', value:'CNY', sign: '¥' },
  SEK: { name: 'SEK - Swedish Krona', value:'SEK', sign: 'kr' },
  NZD: { name: 'NZD - New Zealand Dollar', value:'NZD', sign: '$' },
  SGD: { name: 'SGD - Singapore Dollar', value:'SGD', sign: '$' },
  HKD: { name: 'HKD - Hong Kong Dollar', value:'HKD', sign: '$' },
  NOK: { name: 'NOK - Norwegian Krone', value:'NOK', sign: 'kr' },
  KRW: { name: 'KRW - South Korean Won', value:'KRW', sign: '₩' },
  INR: { name: 'INR - Indian Rupee', value:'INR', sign: '₹' },
  RUB: { name: 'RUB - Russian Ruble', value:'RUB', sign: '₽' },
  BRL: { name: 'BRL - Brazilian Real', value:'BRL', sign: 'R$' },
  ZAR: { name: 'ZAR - South African Rand', value:'ZAR', sign: 'R' },
  MXN: { name: 'MXN - Mexican Peso', value:'MXN', sign: '$' },
  TRY: { name: 'TRY - Turkish Lira', value:'TRY', sign: '₺' },
  AED: { name: 'AED - United Arab Emirates Dirham', value:'AED', sign: 'د.إ' },
  SAR: { name: 'SAR - Saudi Riyal', value:'SAR', sign: '﷼' },
  PLN: { name: 'PLN - Polish Zloty', value:'PLN', sign: 'zł' },
  THB: { name: 'THB - Thai Baht', value:'THB', sign: '฿' },
  DKK: { name: 'DKK - Danish Krone', value:'DKK', sign: 'kr' },
  IDR: { name: 'IDR - Indonesian Rupiah', value:'IDR', sign: 'Rp' },
  MYR: { name: 'MYR - Malaysian Ringgit', value:'MYR', sign: 'RM' },
  HUF: { name: 'HUF - Hungarian Forint', value:'HUF', sign: 'Ft' },
  CZK: { name: 'CZK - Czech Koruna', value:'CZK', sign: 'Kč' },
  CLP: { name: 'CLP - Chilean Peso', value:'CLP', sign: '$' },
  PHP: { name: 'PHP - Philippine Peso', value:'PHP', sign: '₱' },
  ILS: { name: 'ILS - Israeli New Shekel', value:'ILS', sign: '₪' },
  PKR: { name: 'PKR - Pakistani Rupee', value:'PKR', sign: '₨' },
  EGP: { name: 'EGP - Egyptian Pound', value:'EGP', sign: 'E£' },
  KWD: { name: 'KWD - Kuwaiti Dinar', value:'KWD', sign: 'د.ك' },
  QAR: { name: 'QAR - Qatari Riyal', value:'QAR', sign: '﷼' },
  VND: { name: 'VND - Vietnamese Dong', value:'VND', sign: '₫' },
};


export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
}


  