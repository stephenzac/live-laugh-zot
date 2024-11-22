import OpenAI from 'openai';
// import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();
// const configuration = new Configuration({ apiKey: process.env.OPENAPI_KEY });

const apiKey = process.env.OPENAI_KEY;
const baseURL = 'https://api.openai.com/v1/chat/completions';
const api = new OpenAI({ apiKey, baseURL });

export const decideResolver = async (
  problem: string,
  people: string[],
  resolution: string
) => {
  const numPeople = people.length;
  if (resolution == 'dice' && numPeople == 2) return diceResolver(people);
  else if (resolution == 'coin' && numPeople > 2) return coinResolver(people);
  else if (resolution == 'AI') {
    const systemPrompt = `Be concise and give one solution to a conflict. Limit your answer to 
      4 sentences.The person(s) involved are: ${people.join(
        ', '
      )}. The problem at hand is: `;
    return await decideAI(problem, systemPrompt);
  }
};

export const coinResolver = (people: string[]) => {
  const winner = Math.round(Math.random());
  return `Do what ${people[winner]} says.`;
};

export const diceResolver = (people: string[]) => {
  const numPeople = people.length;
  const winner = Math.round(Math.random() * numPeople);
  for (let i = 0; i < numPeople; i++) {
    if (winner == i) return `${people[i]} is in the right.`;
  }
};

export const decideAI = async (userInput: string, systemPrompt: string) => {
  const chatResponse = await api.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userInput,
      },
    ],
  });
  return chatResponse.choices[0].message;
};
