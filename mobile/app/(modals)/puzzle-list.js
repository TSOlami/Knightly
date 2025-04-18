import { useLocalSearchParams } from 'expo-router';
import PuzzleListScreen from '../../src/screens/PuzzleListScreen';

export default function PuzzleList() {
  const { categoryId, categoryName } = useLocalSearchParams();
  
  // Both categoryId and categoryName are required for the PuzzleListScreen
  return <PuzzleListScreen categoryId={categoryId} categoryName={categoryName} />;
} 