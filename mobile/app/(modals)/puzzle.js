import { useLocalSearchParams } from 'expo-router';
import PuzzleScreen from '../../src/screens/PuzzleScreen';

export default function Puzzle() {
  const { puzzleName, puzzleId } = useLocalSearchParams();
  
  return <PuzzleScreen puzzleName={puzzleName} puzzleId={puzzleId} />;
} 