import React from 'react';
import { TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  Easing
} from 'react-native-reanimated';
import theme from '../theme';

const AnimatedBox = ({ size = 100, color = theme.COLORS.primary }) => {
  // Create a shared value to track scale
  const scale = useSharedValue(1);
  
  // Create animated style based on the scale value
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  // Function to animate the box when pressed
  const handlePress = () => {
    // Reset scale to 1
    scale.value = 1;
    
    // Animate scale with repeat
    scale.value = withRepeat(
      withTiming(1.2, { 
        duration: 500, 
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
      }),
      6, // Number of repeats
      true // Reverse animation
    );
  };
  
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View 
        style={[
          styles.box, 
          { width: size, height: size, backgroundColor: color },
          animatedStyle
        ]} 
      >
        <Text style={styles.boxText}>Tap Me</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  boxText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  }
});

export default AnimatedBox; 