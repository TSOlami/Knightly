import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';

export default function Index() {
  const { authenticated } = useAuth();
  
  // Redirect based on authentication status
  return <Redirect href={authenticated ? '/(tabs)' : '/(auth)/login'} />;
} 