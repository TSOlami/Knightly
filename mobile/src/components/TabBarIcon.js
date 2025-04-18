import React from 'react';
import { Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import theme from '../theme';

/**
 * TabBarIcon component to display icons consistently across the app
 * @param {string} name - The name of the icon
 * @param {string} color - The color of the icon
 * @param {number} size - The size of the icon
 */
const TabBarIcon = ({ name, color = theme.COLORS.primary, size = 24 }) => {
  // Map custom icon names to Expo vector icon names
  const iconMap = {
    'home': { component: Ionicons, name: 'home' },
    'grid': { component: Ionicons, name: 'grid' },
    'user': { component: Ionicons, name: 'person' },
    'settings': { component: Ionicons, name: 'settings' },
    'puzzle': { component: MaterialCommunityIcons, name: 'puzzle' },
    'chess': { component: MaterialCommunityIcons, name: 'chess-queen' },
    'crown': { component: MaterialCommunityIcons, name: 'crown' },
    'search': { component: Ionicons, name: 'search' },
    'x-circle': { component: Ionicons, name: 'close-circle' },
    'check-circle': { component: Ionicons, name: 'checkmark-circle' },
    'chevron-right': { component: Ionicons, name: 'chevron-forward' },
    'rotate': { component: Ionicons, name: 'refresh' },
    'arrow-undo': { component: Ionicons, name: 'arrow-undo' },
    'lightbulb': { component: Ionicons, name: 'bulb' },
    'alert-circle': { component: Ionicons, name: 'alert-circle' },
    'circle': { component: Entypo, name: 'circle' },
    'circle-fill': { component: Entypo, name: 'circle' }
  };

  // Special case for filled circle
  if (name === 'circle-fill') {
    return <Entypo name="circle" size={size} color={color} />;
  }

  // Find the mapped icon or use fallback
  const icon = iconMap[name] || { component: Ionicons, name: 'help-circle' };
  const IconComponent = icon.component;

  return <IconComponent name={icon.name} size={size} color={color} />;
};

export default TabBarIcon;