interface HouseholdListItemProps {
  //   children?: React.ReactNode;
  item: string;
  selectedItems: string[];
  onItemSelect: (item: string) => void;
}

export const HouseholdListItem: React.FC<HouseholdListItemProps> = ({
  item,
  selectedItems,
  onItemSelect,
}) => {
  return (
    <li>
      <div className='flex items-center gap-2'>
        <input
          type='checkbox'
          onChange={() => onItemSelect(item)}
          checked={selectedItems.includes(item)}
          className='accent-green-500'
        />
        {item}
      </div>
    </li>
  );
};