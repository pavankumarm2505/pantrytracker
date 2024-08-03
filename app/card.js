import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const cardStyle = {
  minWidth: 275,
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  transition: '0.3s',
  '&:hover': {
    boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
  },
//   transform: 'translateZ(0)',
  perspective: '1000px',
  borderRadius: '10px',
};

const cards = [
  {
    title: 'Manual Addition',
    description: 'Easily add stock with manual entry. Quick and efficient for all items.',
  },
  {
    title: 'Camera Addition',
    description: "Scan items with your camera. Let the app do the work for you effortlessly.",
  },
  {
    title: 'AI Recipes',
    description: "Discover recipes with AI. Turn your pantry items into delicious meals.",
  },
];

export default function OutlinedCard() {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={4}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card variant="outlined" sx={cardStyle}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                  {card.title}
                </Typography>
                {/* <Typography variant="h5" component="div">
                  {bull}{card.title.split(' ').join(bull)}
                </Typography> */}
                {/* <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Feature
                </Typography> */}
                <Typography variant="body2">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
