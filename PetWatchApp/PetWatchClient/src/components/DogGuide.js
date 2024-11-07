import React from "react";
import { Box, Typography, Divider } from '@mui/material';

const DogGuide = () => {
  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 3, color: '#795B4A' }}>
      <Typography variant="h4" gutterBottom align="center">
        Guide for a Happy Dog
      </Typography>

      <Typography variant="body1" paragraph>
        Ensuring your dog's happiness is essential for their overall well-being and your bond with them. Here are some tips to help you keep your furry friend happy and content.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" sx={{ borderBottom: '1px solid #795B4A', width: 'fit-content', pb: 0.5 }} gutterBottom>
        Creating a Comfortable Environment
      </Typography>
      <Typography variant="body1" paragraph>
        Just like humans, dogs enjoy having a cozy and comfortable space to call their own. Provide your dog with a soft bed or blanket in a quiet corner of your home where they can relax undisturbed.
        Make sure they have access to clean water and nutritious food tailored to their age and size.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" sx={{ borderBottom: '1px solid #795B4A', width: 'fit-content', pb: 0.5 }} gutterBottom>
        Plenty of Playtime and Exercise
      </Typography>
      <Typography variant="body1" paragraph>
        Dogs thrive on regular exercise and mental stimulation. Take your dog for daily walks, play fetch in the park, or engage in interactive games at home.
        This not only keeps them physically fit but also prevents boredom and destructive behavior.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" sx={{ borderBottom: '1px solid #795B4A', width: 'fit-content', pb: 0.5 }} gutterBottom>
        Positive Reinforcement and Training
      </Typography>
      <Typography variant="body1" paragraph>
        Use positive reinforcement techniques to train your dog and reinforce good behavior. Reward them with treats, praise, and affection when they obey commands or exhibit desirable behaviors.
        Consistent training helps build a strong bond between you and your dog and enhances their confidence and obedience.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" sx={{ borderBottom: '1px solid #795B4A', width: 'fit-content', pb: 0.5 }} gutterBottom>
        Healthy Lifestyle Habits
      </Typography>
      <Typography variant="body1" paragraph>
        Maintain your dog's health by scheduling regular veterinary check-ups, vaccinations, and dental care. Provide them with a balanced diet, regular grooming sessions, and plenty of opportunities for rest and relaxation.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" sx={{ borderBottom: '1px solid #795B4A', width: 'fit-content', pb: 0.5 }} gutterBottom>
        Quality Time and Bonding
      </Typography>
      <Typography variant="body1" paragraph>
        Spend quality time with your dog by engaging in activities they enjoy, such as going for hikes, playing at the beach, or simply cuddling on the couch.
        Building a strong emotional connection with your dog through shared experiences strengthens your bond and contributes to their happiness.
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" sx={{ borderBottom: '1px solid #795B4A', width: 'fit-content', pb: 0.5 }} gutterBottom>
        Unconditional Love and Affection
      </Typography>
      <Typography variant="body1" paragraph>
        Above all, shower your dog with love, affection, and attention. Dogs thrive on human companionship and thrive when they feel loved and cherished by their owners.
        Be patient, understanding, and compassionate, and your dog will reward you with unwavering loyalty and unconditional love.
      </Typography>
    </Box>
  );
};

export default DogGuide;
