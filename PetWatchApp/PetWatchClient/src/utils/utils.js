import bcrypt from 'bcryptjs';
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
  

  