import { GoogleGenerativeAI } from '@google/generative-ai';

const api = new GoogleGenerativeAI(`${process.env.API_KEY}`);
const model = api.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
  const result = await model.generateContent(
    `${systemPrompt} \nThe problem at hand is: ${userInput}`
  );
  return result.response.text();
};
