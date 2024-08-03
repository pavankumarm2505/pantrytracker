
import axios from 'axios';



const OPENAI_API_KEY =process.env.NEXT_PUBLIC_OPENAI_API_KEY;
export const getRecipeSuggestions = async (inventory) => {
  const prompt = `I have the following ingredients: ${inventory.join(', ')}. Can you suggest some recipes based on these ingredients? Please give it in bullet points for each recipe`;

  try {
    const response = await axios.post('https://api.openai.com/v1/completions', {
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 500,
      n: 1,
      stop: null,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error getting recipe suggestions:", error);
    throw error;
  }

};