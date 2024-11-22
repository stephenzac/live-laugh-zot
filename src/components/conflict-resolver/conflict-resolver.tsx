import {
  decideAI,
  decideResolver,
} from '@/lib/conflict-resolver/conflict-resolver-functions';

export const ConflictResolver: React.FC = () => {
  const getChatResponse = async () => {
    const response = await decideResolver(
      'what do I eat today?',
      ['Stephen'],
      'AI'
    );
    console.log(response);
  };

  return (
    <div className='bg-white rounded-md p-4'>
      <h2>conflict resolver</h2>

      <p onClick={getChatResponse}>Get Chat Response</p>

      {/* <form>
        <select>
          <option>Genie</option>
          <option>Dice Roll</option>
        </select>

        <input placeholder='Describe your conflict:' />
      </form> */}
    </div>
  );
};
