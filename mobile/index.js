import 'react-native-reanimated';
import { registerRootComponent } from 'expo';
import { AppRegistry } from 'react-native';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// Also add a direct AppRegistry registration to ensure it's properly registered
AppRegistry.registerComponent('Knightly', () => App);
