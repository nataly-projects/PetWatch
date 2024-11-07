import React from "react";
import { Box, Typography, Grid } from '@mui/material';
import InfoGridItem from "../components/InfoGridItem"; 
import petTagNameIcon from "../images/tag_name.png";
import dogVaccineIcon from "../images/dog_vaccine.png";
import catVaccineIcon from "../images/cat_vaccine.png";
import catIcon from "../images/cat.png";
import dogIcon from "../images/dog.png";
import emergencyIcon from "../images/emergency.png";

const ImportantInfoPage = () => {
  return (
    <Box sx={{ mt: 8 }}>
      <Box sx={{
          width: '100%',
          mt: 3,
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Typography variant="h4" sx={{ color: '#795B4A' }}>
          Information for pets owner
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mt: 8 }}>
        {[
          { to: "/info/dog-care", labelText: "Dogs Care Routine", imageSrc: dogVaccineIcon },
          { to: "/info/cat-care", labelText: "Cats Care Routine", imageSrc: catVaccineIcon },
          { to: "/info/pet-names", labelText: "Pet Names Idea", imageSrc: petTagNameIcon },
          { to: "/info/dog-guide", labelText: "Dog Guide", imageSrc: dogIcon },
          { to: "/info/cat-guide", labelText: "Cat Guide", imageSrc: catIcon },
          { to: "/info/emergency-guide", labelText: "Emergency Guide", imageSrc: emergencyIcon },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <InfoGridItem to={item.to} labelText={item.labelText} imageSrc={item.imageSrc} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImportantInfoPage;
