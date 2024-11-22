interface HouseholdListProps {
  children?: React.ReactNode;
}

export const HouseholdList: React.FC<HouseholdListProps> = ({ children }) => {
  return (
    <ul className='max-h-48 overflow-y-auto flex flex-col items-start pl-4 mb-4'>
      {children}
    </ul>
  );
};
