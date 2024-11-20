export default async function Chores({
  params,
}: {
  params: Promise<{ householdId: string }>;
}) {
  const householdId = (await params).householdId;

  return (
    <>
      <h1>chores for household {householdId}</h1>
    </>
  );
}
