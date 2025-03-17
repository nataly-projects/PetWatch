import React from "react";
import { Box, Typography, Divider, List, ListItem } from '@mui/material';

const DogGuide = () => {

  const sections = [
    {
      title: "Creating a Comfortable Environment",
      content: "Just like humans, dogs enjoy having a cozy and comfortable space to call their own. Provide your dog with a soft bed or blanket in a quiet corner of your home where they can relax undisturbed. Make sure they have access to clean water and nutritious food tailored to their age and size."
    },
    {
      title: "Plenty of Playtime and Exercise",
      content: "Dogs thrive on regular exercise and mental stimulation. Take your dog for daily walks, play fetch in the park, or engage in interactive games at home. This not only keeps them physically fit but also prevents boredom and destructive behavior."
    },
    {
      title: "Positive Reinforcement and Training",
      content: "Use positive reinforcement techniques to train your dog and reinforce good behavior. Reward them with treats, praise, and affection when they obey commands or exhibit desirable behaviors. Consistent training helps build a strong bond between you and your dog and enhances their confidence and obedience."
    },
    {
      title: "Healthy Lifestyle Habits",
      content: "Maintain your dog's health by scheduling regular veterinary check-ups, vaccinations, and dental care. Provide them with a balanced diet, regular grooming sessions, and plenty of opportunities for rest and relaxation."
    },
    {
      title: "Quality Time and Bonding",
      content: "Spend quality time with your dog by engaging in activities they enjoy, such as going for hikes, playing at the beach, or simply cuddling on the couch. Building a strong emotional connection with your dog through shared experiences strengthens your bond and contributes to their happiness."
    },
    {
      title: "Unconditional Love and Affection",
      content: "Above all, shower your dog with love, affection, and attention. Dogs thrive on human companionship and thrive when they feel loved and cherished by their owners. Be patient, understanding, and compassionate, and your dog will reward you with unwavering loyalty and unconditional love."
    },
    {
      title: "Signs of Health Issues in Dogs",
      content: "Watch out for warning signs such as loss of appetite, unusual behavior, lethargy, vomiting, or changes in bowel movements. If you notice any of these symptoms, consult a veterinarian promptly."
    },
    {
      title: "Essential Items for a New Dog",
      content: (
        <List>
          <ListItem>Leash and collar with an ID tag</ListItem>
          <ListItem>Food and water bowls</ListItem>
          <ListItem>Comfortable bed or crate</ListItem>
          <ListItem>Chew toys and interactive play items</ListItem>
          <ListItem>Grooming tools (brush, shampoo, nail clippers)</ListItem>
        </List>
      )
    }
  ];

  return (
    <Box sx={{ maxWidth: 800, padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Guide for a Happy Dog
      </Typography>

      <Typography variant="body1" paragraph>
        Ensuring your dog's happiness is essential for their overall well-being and your bond with them. Here are some tips to help you keep your furry friend happy and content.
      </Typography>

      <Divider sx={{ my: 3 }} />
      {sections.map((section, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              borderBottom: '1px solid #795B4A', 
              width: 'fit-content', 
              pb: 0.5, 
              mb: 2
            }}
          >
            {section.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {section.content}
          </Typography>
          <Divider sx={{ my: 3 }} />
        </Box>
      ))}
    
    </Box>
  );
};

export default DogGuide;
