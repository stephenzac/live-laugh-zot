interface HouseholdListProps {
  children?: React.ReactNode;
}

export const HouseholdList: React.FC<HouseholdListProps> = ({ children }) => {
  return (
    <ul className='max-h-64 gap-1 overflow-y-auto flex flex-col items-start mb-4'>
      {children}
    </ul>
  );
};
