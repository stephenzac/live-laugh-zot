export const decideResolver = (
  problem: string,
  people: string[],
  resolution: string
) => {
  if (resolution == 'dice') diceResolver(people);
  else if (resolution == 'coin') coinResolver(people);
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
