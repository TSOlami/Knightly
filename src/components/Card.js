import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import theme from '../theme';

const Card = ({ 
  title, 
  subtitle, 
  onPress, 
  style, 
  contentStyle,
  titleStyle,
  subtitleStyle,
  children,
  variant = 'default',
  disabled = false,
  ...props
}) => {
  const getVariantStyle = () => {
    switch(variant) {
      case 'elevated':
        return {...theme.SHADOWS.medium};
      case 'outlined':
        return styles.outlined;
      case 'flat':
        return styles.flat;
      default:
        return {...theme.SHADOWS.small};
    }
  };

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[
        styles.card,
        getVariantStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={disabled ? null : onPress}
      activeOpacity={0.7}
      disabled={disabled}
      {...props}
    >
      <View style={[styles.contentContainer, contentStyle]}>
        {title && <Text style={[styles.title, titleStyle]}>{title}</Text>}
        {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
        {children}
      </View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    overflow: 'hidden',
    marginVertical: theme.SPACING.sm,
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.COLORS.board.dark,
  },
  flat: {
    elevation: 0,
    shadowOpacity: 0,
  },
  disabled: {
    opacity: 0.6,
  },
  contentContainer: {
    padding: theme.SPACING.md,
  },
  title: {
    fontSize: theme.TYPOGRAPHY.fontSize.lg,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
    marginBottom: theme.SPACING.xs,
  },
  subtitle: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.text.secondary,
    marginBottom: theme.SPACING.sm,
  },
});

export default Card; 