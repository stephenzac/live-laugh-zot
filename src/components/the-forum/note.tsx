interface NoteProps {
  poster: string;
  content: string;
}

export const NoteComponent: React.FC<NoteProps> = ({ poster, content }) => {
  return (
    <div className='flex flex-col'>
      <p>{poster}</p>
      <p>{content}</p>
    </div>
  );
};
