import { GoogleGenerativeAI } from '@google/generative-ai';

const api = new GoogleGenerativeAI(`${process.env.NEXT_PUBLIC_API_KEY}`);
const model = api.getGenerativeModel({ model: 'gemini-1.5-flash' });

export const decideResolver = async (
  problem: string,
  people: string[],
  resolution: string
) => {
  if (resolution == 'randomizer') return { message: randomResolver(people) };
  else if (resolution == 'AI') {
    const systemPrompt = `Be concise and give one solution to a conflict. Limit your answer to 
      4 sentences.The person(s) involved are: ${people.join(
        ', '
      )}. The problem at hand is: `;
    const message = await decideAI(problem, systemPrompt);
    return { message };
  }
};

export const randomResolver = (people: string[]) => {
  const numPeople = people.length;
  const winner = Math.round(Math.random() * numPeople);
  for (let i = 0; i < numPeople; i++) {
    if (winner == i) return `Go with what ${people[i]} says.`;
  }
};

export const decideAI = async (userInput: string, systemPrompt: string) => {
  const result = await model.generateContent(
    `${systemPrompt} \nThe problem at hand is: ${userInput}`
  );
  return result.response.text();
};
