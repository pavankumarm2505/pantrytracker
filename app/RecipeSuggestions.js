import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { getRecipeSuggestions } from './openai';

const RecipeSuggestions = ({ inventory }) => {
  const [recipes, setRecipes] = useState('');

  const handleGetRecipes = async () => {
    const recipeText = await getRecipeSuggestions(inventory.map(item => item.name));
    setRecipes(recipeText);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={2} mt={4}>
      <Button variant="contained" color="primary" onClick={handleGetRecipes}>
        Get Recipe Suggestions
      </Button>
      {recipes && (
        <Typography variant="body1" component="pre" mt={2}>
          {recipes}
        </Typography>
      )}
    </Box>
  );
};

export default RecipeSuggestions;