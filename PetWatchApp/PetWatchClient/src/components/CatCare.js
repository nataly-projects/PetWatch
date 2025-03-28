import React from 'react';
import { Box, Typography, List, ListItem, Table, TableBody, TableCell, TableHead, TableRow, Divider, Card, CardContent } from '@mui/material';
import fruitsCanEatImg from '../images/catFruitCanEat.jpg';
import meatCanEatImg from '../images/catMeatCanEat.jpg';
import otherCanEatImg from '../images/catOtherCanEat.jpg';
import eatCautiousImg from '../images/catEatCautious.jpg';
import notToEatImg from '../images/catNotEat.jpg';

const CatCarePage = () => {
    const vaccinations = [
        { name: 'FVRCP vaccine', description: 'Protects against serious and contagious viral diseases. Feline leukemia, Calicivirus, and Rhinotracheitis are included.' },
        { name: 'Rabies vaccine', description: 'Fatal disease that affects many mammals, including humans. Cats that go outdoors and are at risk should be vaccinated.' },
        { name: 'FeLV vaccine', description: 'Recommended for cats that live in areas with a high prevalence of FeLV.' },
    ];

    const vaccinationsFrequency = [
        { name: 'FVRCP (Quad/Triple)**', kittenAge: '6-8 weeks, 12-16 weeks, 16-20 weeks', adultCatAge: 'Once a year' },
        { name: 'Rabies', kittenAge: '16-20 weeks', adultCatAge: 'Once every three years' },
        { name: 'FeLV (Optional)', kittenAge: '6-8 weeks, repeat as recommended by veterinarian', adultCatAge: 'Repeat as recommended by veterinarian' },
    ];

    const routineCare = [
        { name: 'Deworming', description: 'It is recommended to give cats preventive treatment for parasites once a month.' },
        { name: 'Flea and Tick Control', description: 'Regular treatments for fleas and ticks, including the environment.' },
        { name: 'Ear Cleaning', description: 'Regular ear cleaning prevents infections.' },
        { name: 'Teeth Brushing', description: 'Daily teeth brushing helps prevent gum disease and tartar buildup.' },
    ];

    const renderVaccineScheduleTable = () => (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell sx={{ 
                        fontWeight: 'bold', 
                        textAlign: 'center' 
                    }}>Vaccine</TableCell>
                    <TableCell sx={{ 
                        fontWeight: 'bold', 
                        textAlign: 'center' 
                    }}>Kitten Age</TableCell>
                    <TableCell sx={{ 
                        fontWeight: 'bold', 
                        textAlign: 'center' 
                    }}>Adult Cat Age</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {vaccinationsFrequency.map((vaccination, index) => (
                    <TableRow key={index}>
                        <TableCell>{vaccination.name}</TableCell>
                        <TableCell>{vaccination.kittenAge}</TableCell>
                        <TableCell>{vaccination.adultCatAge}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    const renderRoutineCareList = () => (
        <List sx={{ width: '100%', mt: 2 }}>
          {routineCare.map((item, index) => (
            <Card key={index} variant="outlined" sx={{ mb: 1, p: 2 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  {item.name}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </List>
      );

    return (
        <Box sx={{ maxWidth: 800, padding: 3 }}>
            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>Cat Vaccinations and Routine Care</Typography>
                <Typography variant="body1">Below is a list of common cat vaccinations and their descriptions:</Typography>
                <List>
                    {vaccinations.map((vaccination, index) => (
                        <ListItem key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6">{vaccination.name}</Typography>
                            <Typography variant="body2">{vaccination.description}</Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Divider sx={{mb: 4}}/>

            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>Cat Vaccination Schedule:</Typography>
                {renderVaccineScheduleTable()}
            </Box>

            <Divider sx={{mb: 4}}/>

            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>Routine Care</Typography>
                {renderRoutineCareList()}

                <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>It is important to consult with a veterinarian about the vaccination program that is most appropriate for your cat.</strong>
                </Typography>
            </Box>

            <Divider sx={{mb: 4}}/>

            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom>Feeding Your Cat</Typography>
                <Typography variant="h5" gutterBottom>What Can Cats Eat?</Typography>
                <Typography variant="body1">Cats can enjoy a variety of foods that are beneficial for their health. Here are some foods that cats can eat:</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
                
                    <Box className="section" sx={{ mb: 2 }}>
                        <Typography variant="h5" gutterBottom>Fruit and Vegetables</Typography>
                        <Typography>Apples, bananas, strawberries, carrots, and more.</Typography>
                        <Box component="img" src={fruitsCanEatImg} alt="Fruits cats can eat" sx={{ width: '100%', mt: 2 }} />
                    </Box>
                    <Box className="section" sx={{ mb: 2 }}>
                    <Typography variant="h5" gutterBottom>Meat & Fish</Typography>
                        <Typography>Chicken, beef, salmon, and other meats.</Typography>
                        <Box component="img" src={meatCanEatImg} alt="Meat cats can eat" sx={{ width: '100%', mt: 2 }} />
                    </Box>
                    <Box className="section" sx={{ mb: 2 }}>
                    <Typography variant="h5" gutterBottom>Other Foods</Typography>
                        <Typography>Grains, dairy, and eggs in moderation.</Typography>
                        <Box component="img" src={otherCanEatImg} alt="Other foods cats can eat" sx={{ width: '100%', mt: 2 }} />
                    </Box>
                </Box>
            </Box>

            <Divider sx={{mb: 4}}/>

            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>Foods to Be Cautious About</Typography>
                <Typography>
                    Some foods can be given to your cat, but should be monitored closely to avoid issues.
                </Typography>
                <Box component="img" src={eatCautiousImg} alt="Foods to be cautious about giving your cat" sx={{ width: '100%', mt: 2 }} />
            </Box>

            <Divider />

            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>What Can Cats Not Eat?</Typography>
                <Typography>
                    Certain foods are toxic to cats and should be avoided. Here are some examples:
                </Typography>
                <List>
                    <ListItem><strong><span style={{ marginRight: '5px' }}>Chocolate:</span></strong> Contains theobromine and caffeine, which are toxic to cats.</ListItem>
                    <ListItem><strong><span style={{ marginRight: '5px' }}>Onions and Garlic:</span></strong> Can cause damage to a cat's red blood cells.</ListItem>
                    <ListItem><strong><span style={{ marginRight: '5px' }}>Grapes and Raisins:</span></strong> Can cause kidney failure in cats.</ListItem>
                </List>
                <Box component="img" src={notToEatImg} alt="Foods cats can't eat" sx={{ width: '100%', mt: 2 }} />
            </Box>

            <Box className="section" sx={{ mb: 4 }}>
                <Typography variant="h5" gutterBottom>Summary</Typography>
                <Typography variant="body1">
                    Understanding what cats can and can't eat is crucial for their health. By providing a balanced diet and avoiding harmful foods, you can ensure your cat stays healthy and happy.
                </Typography>
            </Box>
        </Box>
    );
};

export default CatCarePage;
