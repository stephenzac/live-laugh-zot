export default async function HouseHoldIdPage({
  params,
}: {
  params: Promise<{ householdId: string }>;
}) {
  const householdId = (await params).householdId;

  return <h1 className='text-3xl font-bold'>Welcome to {householdId}!</h1>;
}
