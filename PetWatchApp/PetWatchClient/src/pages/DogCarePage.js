import React from 'react';
import { Box, Typography, List, ListItem, Table, TableBody, TableCell, TableHead, TableRow, Divider } from '@mui/material';
import fruitsCanEatImg from '../images/dogFruitsCanEat.jpg';
import meatCanEatImg from '../images/dogMeatCanEat.jpg';
import otherCanEatImg from '../images/dogOtherCanEat.jpg';
import eatCautiousImg from '../images/dogEatCautious.jpg';
import notToEatImg from '../images/dogNotEat.jpg';

const DogCarePage = () => {
    const vaccinations = [
        { name: 'Multivalent Vaccine - DHPP', description: 'A vaccine that contains protection against 6 contagious diseases...' },
        { name: 'Rabies Vaccinations', description: 'An obligatory vaccine for all dogs that are 3 months old...' },
        { name: 'Vaccination against Esophagus Worms/Park Worms', description: 'A preventive treatment for specific worms...' },
        { name: 'Deworming Treatment (pills)', description: 'Treatment against internal parasites...' },
        { name: 'Flea and Tick Treatment', description: 'There are various flea and tick treatment options available...' },
    ];

    const routineCare = [
        { name: 'Brushing', description: 'Regular brushing helps remove dead fur...', frequency: ['Short-haired: Once a week', 'Medium-haired: Twice a week', 'Long-haired: 3-4 times a week'] },
        { name: 'Bathing', description: 'Bathing as needed with dog shampoo.', frequency: ['Short-haired: Once a month', 'Medium-haired: Once every two weeks', 'Long-haired: As needed'] },
        { name: 'Nail trimming', description: 'Regular nail trimming prevents discomfort and injuries.', frequency: ['Once a month'] },
        { name: 'Ear cleaning', description: 'Regular ear cleaning prevents infections.', frequency: ['Once a week'] },
        { name: 'Teeth brushing', description: 'Prevents gum disease and tartar buildup.', frequency: ['3-4 times a week'] },
    ];

    const puppyVaccineSchedule = [
        { age: '6–8 Weeks', vaccines: ['DHPP - first dose', 'Deworming'] },
        { age: '10–12 Weeks', vaccines: ['DHPP - second dose', 'Deworming'] }, 
        { age: '14–16 Weeks', vaccines: ['DHPP - third dose', 'Rabies', 'Vaccination against Esophagus Worms'] }
    ];
  
    const adultDogVaccineSchedule = [
        { frequency: 'Every 3 months', vaccines: ['Vaccination against Esophagus Worms'] },
        { frequency: 'Every 6 months', vaccines: ['Deworming'] },
        { frequency: 'Every year', vaccines: ['Rabies', 'DHPP'] }
    ];

    const renderRoutineCareList = () => (
      <List>
          {routineCare.map((item, index) => (
              <ListItem key={index} sx={{ mb: 2 }}>
                  <Typography variant="h6">{item.name}</Typography>
                  <Typography variant="body2">{item.description}</Typography>
                  <Typography variant="subtitle1">Frequency:</Typography>
                  <List>
                      {item.frequency.map((freq, i) => (
                          <ListItem key={i} sx={{ pl: 2 }}>
                              {freq}
                          </ListItem>
                      ))}
                  </List>
              </ListItem>
          ))}
      </List>
    );

    const renderTable = (data, header1, header2) => (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>{header1}</TableCell>
                    <TableCell>{header2}</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{item.age || item.frequency}</TableCell>
                        <TableCell>{item.vaccines.join(', ')}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: '20px' }}>
            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>Dog Vaccinations and Routine Care</Typography>
                <List>
                    {vaccinations.map((vaccination, index) => (
                        <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6">{vaccination.name}</Typography>
                            <Typography variant="body2">{vaccination.description}</Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Divider />

            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>Puppy Vaccine Schedule</Typography>
                <Typography variant="body1" gutterBottom>
                    For puppy vaccines to provide necessary protection, they’re given every two to four weeks until a puppy is at least 16 weeks old.
                </Typography>
                {renderTable(puppyVaccineSchedule, "Age", "Vaccines")}
                
                <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>Adult Dog Vaccine Schedule</Typography>
                {renderTable(adultDogVaccineSchedule, "Frequency", "Vaccines")}

                <Typography variant="h4" sx={{ mt: 4 }} gutterBottom>Microchipping</Typography>
                <Typography variant="body1">
                    Microchipping is a safe and permanent way to identify your dog and increase the chances of being reunited if they are lost or stolen.
                </Typography>
            </Box>

            <Divider />

            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>Routine Care</Typography>
                {renderRoutineCareList()}
            </Box>

            <Divider />

            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>Feeding Your Dog</Typography>
                <Typography variant="h5" gutterBottom>What Can Dogs Eat?</Typography>
                <Typography variant="body1">Dogs can enjoy a variety of foods that provide essential nutrients:</Typography>
                <List>
                    <ListItem>
                        <Typography variant="h6">Fruit and Vegetables</Typography>
                        <Typography>Apples, bananas, strawberries, carrots, and more.</Typography>
                        <Box component="img" src={fruitsCanEatImg} alt="Fruits dogs can eat" sx={{ width: '100%', mt: 2 }} />
                    </ListItem>
                    <ListItem>
                        <Typography variant="h6">Meat & Fish</Typography>
                        <Typography>Chicken, beef, salmon, and other meats.</Typography>
                        <Box component="img" src={meatCanEatImg} alt="Meat dogs can eat" sx={{ width: '100%', mt: 2 }} />
                    </ListItem>
                    <ListItem>
                        <Typography variant="h6">Other Foods</Typography>
                        <Typography>Grains, dairy, and eggs in moderation.</Typography>
                        <Box component="img" src={otherCanEatImg} alt="Other foods dogs can eat" sx={{ width: '100%', mt: 2 }} />
                    </ListItem>
                </List>
            </Box>

            <Divider />

            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>Foods to Be Cautious About</Typography>
                <Typography>
                    While not toxic, some foods should be given in moderation.
                    <Box component="img" src={eatCautiousImg} alt="Foods to be cautious about" sx={{ width: '100%', mt: 2 }} />
                </Typography>
            </Box>

            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>What Can Dogs Not Eat?</Typography>
                <Typography>
                    Certain foods are toxic and should be avoided, including chocolate, caffeine, grapes, and some vegetables.
                    <Box component="img" src={notToEatImg} alt="Foods dogs can't eat" sx={{ width: '100%', mt: 2 }} />
                </Typography>
            </Box>
        </Box>
    );
};

export default DogCarePage;
