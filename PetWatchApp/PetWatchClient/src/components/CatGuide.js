import React from "react";
import { Box, Typography, Divider, List, ListItem } from '@mui/material';

const CatGuide = () => {
  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3, color: '#795B4A' }}>
      <Typography variant="h4" gutterBottom align="center">
        Guide for a Happy Cat
      </Typography>

      <Typography variant="body1" paragraph>
        Welcoming a new cat into your home is an exciting experience. Cats have unique needs and behaviors, and understanding them is key to building a strong bond and ensuring their happiness.
        Just like bringing a new cat home, imagine entering a space where everything is new and unfamiliar. Patience and a gentle approach are crucial in the first weeks.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" sx={{ borderBottom: '1px solid #795B4A', width: 'fit-content', pb: 0.5 }} gutterBottom>
        Essentials for Your Cat's Comfort:
      </Typography>
      <List sx={{ pl: 2 }}>
        <ListItem>Cozy and comfortable bedding</ListItem>
        <ListItem>Water and food bowls</ListItem>
        <ListItem>High-quality cat food suitable for age and health</ListItem>
        <ListItem>Collar (if desired, with identification tag)</ListItem>
        <ListItem>Litter box and cat litter</ListItem>
        <ListItem>Toys for mental and physical stimulation</ListItem>
        <ListItem>Cat scratching post or pad</ListItem>
        <ListItem>Treats for positive reinforcement</ListItem>
        <ListItem>If you've adopted a kitten, consider a litter tray and kitten-friendly toys</ListItem>
      </List>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" sx={{ borderBottom: '1px solid #795B4A', width: 'fit-content', pb: 0.5 }} gutterBottom>
        Creating a Safe and Comfortable Environment:
      </Typography>
      <Typography variant="body1" paragraph>
        Cats often need time to acclimate to their new surroundings. Create a quiet and safe space with their essentials, allowing them to explore at their own pace.
        Gradually introduce them to different areas of your home, providing hiding spots if they feel overwhelmed. Patience is key in building trust with your new feline friend.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" sx={{ borderBottom: '1px solid #795B4A', width: 'fit-content', pb: 0.5 }} gutterBottom>
        Litter Box Training and Maintenance:
      </Typography>
      <Typography variant="body1" paragraph>
        Ensure the litter box is placed in a quiet and accessible location. Most cats instinctively use a litter box, but positive reinforcement is crucial during the initial weeks.
        Keep the litter box clean, scoop it daily, and consider the type of litter your cat prefers. If issues arise, consult with your veterinarian for guidance.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" sx={{ borderBottom: '1px solid #795B4A', width: 'fit-content', pb: 0.5 }} gutterBottom>
        Interactive Play and Enrichment:
      </Typography>
      <Typography variant="body1" paragraph>
        Cats thrive on play and mental stimulation. Engage in interactive play with toys, feather wands, or laser pointers. Provide scratching posts to satisfy their natural instinct to scratch.
        Enrich their environment with climbing opportunities and cozy resting spots. Positive interactions and playtime strengthen the bond between you and your new cat.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" sx={{ borderBottom: '1px solid #795B4A', width: 'fit-content', pb: 0.5 }} gutterBottom>
        Feeding and Dietary Considerations:
      </Typography>
      <Typography variant="body1" paragraph>
        Choose high-quality cat food appropriate for their age and health. Establish a consistent feeding schedule and monitor their weight. Freshwater should always be available.
        If you have dietary concerns or specific instructions from the adoption center, consult your veterinarian for personalized guidance.
      </Typography>
    </Box>
  );
};

export default CatGuide;
