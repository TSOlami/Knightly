import 'react-native-gesture-handler';
import 'react-native-reanimated';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PuzzleScreen } from '../../screens/PuzzleScreen';

export default function PuzzlePage() {
  const { id } = useLocalSearchParams();
  return <PuzzleScreen puzzleId={parseInt(id, 10)} />;
}