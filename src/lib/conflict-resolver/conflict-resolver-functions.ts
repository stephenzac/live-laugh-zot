import OpenAI from 'openai';

const baseURL = 'https://api.aimlapi.com/v1';
const apiKey = process.env.OPENAI_KEY;

const api = new OpenAI({ apiKey, baseURL });

export const decideResolver = (
  problem: string,
  people: string[],
  resolution: string
) => {
  const numPeople = people.length;
  if (resolution == 'dice' && numPeople == 2) return diceResolver(people);
  else if (resolution == 'coin' && numPeople > 2) return coinResolver(people);
  else if (resolution == 'AI') {
    const systemPrompt = `You are resolving a conflict. The person(s) involved are: 
      ${people.join(', ')}. Be descriptive and give a decisive solution.`;
    return decideAI(problem, systemPrompt);
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
  const completion = await api.chat.completions.create({
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
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
    temperature: 0.7,
    max_tokens: 256,
  });

  const chatResponse = completion.choices[0].message.content;

  return chatResponse;
};
