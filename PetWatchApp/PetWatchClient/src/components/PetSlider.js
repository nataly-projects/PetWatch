import React from 'react';
import Slider from 'react-slick';
import { Box } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import PetCard from './PetCard';

const PetSlider = ({ pets }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        '.slick-slider': { display: 'grid', width: '100%' },
        '.slick-list': {display: 'flex', gap: '10px'},
        '.slick-dots li button:before': {
          fontSize: '10px',
          color: '#ccc',
        },
        '.slick-dots li.slick-active button:before': {
          color: '#1976d2', // Active dot color
        },
        '.slick-arrow': {
          color: '#1976d2',
          '&:hover': { color: '#0d47a1' },
        },
      }}
    >
      <Slider {...settings}>
        {pets.map((pet, index) => (
          <Box key={index} sx={{ padding: '10px' }}>
            <PetCard key={pet._id} pet={pet} />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default PetSlider;
