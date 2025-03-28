import React from 'react';
import { Container, Box, Typography } from '@mui/material';

const AboutPage = () => {
    
  return (
  
    <Container maxWidth="md" sx={{ padding: "20px", letterSpacing: "0.5px" }}>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', marginBottom: '20px' }}>
        Welcome to Pet Watch!
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

        <Typography variant="body1" sx={{ fontSize: '18px', lineHeight: 1.5, mb: '20px' }}>
          Your comprehensive solution for managing and caring for your beloved pets! PetWatch is designed to simplify the
          process of pet management by providing users with an intuitive and user-friendly platform. Whether you're a
          seasoned pet owner or a new pet parent, PetWatch offers a range of features to meet your needs. From tracking
          essential information such as age, breed, and vaccination status to managing reminders and routine care, PetWatch
          ensures that you stay organized and informed about your furry friends. Our dashboard provides a centralized hub
          where you can access vital details about your pets at a glance, making it easy to stay on top of their well-being.
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '18px', lineHeight: 1.5, mb: '20px', "&:last-child": { mb: 0 } }}>
          Whether you're a seasoned pet owner or new to the world of pet parenthood, PetWatch is your go-to solution for
          ensuring that your furry friends receive the love, care, and attention they deserve. Join PetWatch today, and
          embark on a journey of pet ownership with confidence, knowing that all the tools and resources you need are right
          at your fingertips! Register now to get started.
        </Typography>
    </Box>
    </Container>

  );
};

export default AboutPage;