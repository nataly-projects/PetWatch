import React, { useCallback } from "react";
import { Box, Typography, Grid, Paper } from '@mui/material';
import { petNameIdeas } from '../utils/utils';

const PetNamesIdea = () => {

  const handleLetterClick = useCallback((letter) => {
    const sectionElement = document.getElementById(`letter-section-${letter}`);
    const headerElement = document.getElementById("header");

    if (sectionElement && headerElement) {
      const headerHeight = headerElement.offsetHeight;
      const sectionTop = sectionElement.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({ top: sectionTop - headerHeight * 2, behavior: "smooth" });
    }
  }, []);

  return (
    <Box sx={{ maxWidth: 900, padding: 3 }}>
      <Box id="header" sx={{ position: 'sticky', top: 100, backgroundColor: '#fff', zIndex: 1000, mb: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Finding The Perfect Pet Name
        </Typography>
        <Box display="flex" justifyContent="center" gap={1} sx={{ mb: 2 }}>
          {petNameIdeas.map(({ letter }) => (
            <Paper
              key={letter}
              onClick={() => handleLetterClick(letter)}
              tabIndex={0}
              role="button"
              onKeyPress={(e) => e.key === "Enter" && handleLetterClick(letter)}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 40,
                height: 40,
                borderRadius: '80%',
                border: '1px solid #795B4A',
                cursor: 'pointer',
                color: '#795B4A',
                backgroundColor: '#F8F4EF',
                transition: "background-color 0.3s",
                "&:hover": { backgroundColor: "#eae0d5" },
                "&:focus": { outline: "2px solid #795B4A" },
              }}
            >
              {letter}
            </Paper>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 3}}>
        <Typography variant="body1" paragraph>
          Choosing the most suitable name for your pet is a significant yet not always simple task. A pet's name is more than just a label...
        </Typography>
        <Typography variant="body1" paragraph>
          Calling your pet by its name enhances comfort and security, making training and bonding processes easier...
        </Typography>
        <Typography variant="body1" paragraph>
          Some people base a pet's name on sex, breed, or color, while others prefer names inspired by relatives or loved ones...
        </Typography>
        <Typography variant="body1" paragraph>
          To assist you in finding the perfect name for your beloved pet, we've prepared suggestions and original ideas...
        </Typography>
      </Box>

      {petNameIdeas.map(({ letter, names }) => (
        <Box key={letter} id={`letter-section-${letter}`} sx={{ mb: 4, border: '1px solid #795B4A', borderRadius: 2, p: 2 }}>
          <Typography variant="h5" sx={{ color: '#795B4A', mb: 2 }}>
            {letter}
          </Typography>
          <Grid container spacing={2}>
            {names.map((name, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Paper
                  sx={{
                    padding: 1,
                    borderRadius: 1,
                    backgroundColor: '#F8F4EF',
                    color: '#795B4A',
                    textAlign: 'center',
                  }}
                >
                  {name}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default PetNamesIdea;
