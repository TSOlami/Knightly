import { useLocalSearchParams } from 'expo-router';
import PuzzleListScreen from '../../src/screens/PuzzleListScreen';

export default function PuzzleList() {
  const { categoryName } = useLocalSearchParams();
  
  return <PuzzleListScreen categoryName={categoryName} />;
} 