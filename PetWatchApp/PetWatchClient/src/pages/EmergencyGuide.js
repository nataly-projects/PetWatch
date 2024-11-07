import React from 'react';
import { Box, Typography, List, ListItem, Divider } from '@mui/material';

const EmergencyGuide = () => {
  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Emergency Care for Pets
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#333', mb: 2 }}>
          Important Information
        </Typography>
        <List sx={{ listStyleType: 'disc', pl: 2 }}>
          <ListItem sx={{ display: 'list-item' }}>Know your veterinarian's contact information and emergency clinic's hours and location.</ListItem>
          <ListItem sx={{ display: 'list-item' }}>Keep a pet first aid kit with essentials like bandages, gauze, antiseptic, and a thermometer.</ListItem>
          <ListItem sx={{ display: 'list-item' }}>Know your pet's normal vital signs and behavior to recognize abnormalities.</ListItem>
          <ListItem sx={{ display: 'list-item' }}>Learn pet CPR and first aid techniques.</ListItem>
        </List>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#333', mb: 2 }}>
          Basic Emergency Care
        </Typography>
        <Typography variant="body1" paragraph>
          In case of emergency, it's important to remain calm and take immediate action to ensure the safety and well-being of your pet. Here are some basic steps to follow:
        </Typography>
        <List sx={{ listStyleType: 'disc', pl: 2 }}>
          <ListItem sx={{ display: 'list-item' }}>Assess the situation and ensure your own safety first.</ListItem>
          <ListItem sx={{ display: 'list-item' }}>Stay calm and assess the situation.</ListItem>
          <ListItem sx={{ display: 'list-item' }}>Secure your pet to prevent further injury.</ListItem>
          <ListItem sx={{ display: 'list-item' }}>Administer basic first aid if necessary.</ListItem>
          <ListItem sx={{ display: 'list-item' }}>Contact your veterinarian or emergency clinic immediately.</ListItem>
          <ListItem sx={{ display: 'list-item' }}>Transport your pet to the nearest veterinary clinic or emergency facility as quickly as possible.</ListItem>
        </List>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#333', mb: 2 }}>
          CPR for Pets
        </Typography>
        <Typography variant="body1" paragraph>
          CPR (Cardiopulmonary Resuscitation) may be necessary if your pet is not breathing or does not have a heartbeat. Here's how to perform CPR on pets:
        </Typography>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Basic steps for pet CPR:
        </Typography>
        <List sx={{ listStyleType: 'decimal', pl: 2}}>
          <ListItem sx={{ display: 'list-item' }}>Check for responsiveness.</ListItem>
          <ListItem sx={{ display: 'list-item' }}>Place your pet on a flat surface.</ListItem>
          <ListItem sx={{ display: 'list-item' }}>Clear the airway and check breathing.</ListItem>
          <ListItem sx={{ display: 'list-item' }}>Perform chest compressions and rescue breaths.</ListItem>
          <ListItem sx={{ display: 'list-item' }}>Continue until your pet regains consciousness or until you reach the veterinarian.</ListItem>
        </List>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ color: '#333', mb: 2 }}>
          CPR for Dogs and Cats
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Locating the Heart:</strong> For both dogs and cats, the heart is located in the chest cavity, just behind the front legs. You can feel the heartbeat by placing your hand on the left side of the chest, behind the elbow.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Performing Chest Compressions:</strong> Before starting CPR, assess responsiveness. Ensure the airway is clear and check for breathing. <br />
          <span style={{ textDecoration: 'underline' }}>For dogs -</span> lay them on their right side and place the heel of one hand over the widest part of the chest. <br />
          <span style={{ textDecoration: 'underline' }}>For cats -</span> lay them on their right side and cup your hands over the widest part of the chest. Perform chest compressions to the rhythm of "Stayin' Alive" by the Bee Gees.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Performing Rescue Breaths:</strong> After every 30 chest compressions, give two rescue breaths. <br />
          <span style={{ textDecoration: 'underline' }}>For dogs -</span> close the mouth and breathe into the nose. <br />
          <span style={{ textDecoration: 'underline' }}>For cats -</span> cover the mouth and nose with your mouth and give short, sharp breaths.
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Note: Proper training in pet CPR and first aid is essential. Consult with your veterinarian or local animal hospital for training opportunities.
        </Typography>
      </Box>
    </Box>
  );
};

export default EmergencyGuide;
