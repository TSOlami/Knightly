import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import theme from '../theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  ...props 
}) => {
  // Determine button styles based on variant
  const getVariantStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryButton;
      case 'outline':
        return styles.outlineButton;
      case 'text':
        return styles.textButton;
      case 'danger':
        return styles.dangerButton;
      case 'success':
        return styles.successButton;
      default:
        return styles.primaryButton;
    }
  };

  // Determine text color based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
      case 'text':
        return styles.darkText;
      case 'secondary':
        return styles.darkText;
      default:
        return styles.lightText;
    }
  };

  // Determine button size
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  // Determine text size
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        disabled && styles.disabledButton,
        fullWidth && styles.fullWidth,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'text' || variant === 'secondary' 
            ? theme.COLORS.primary 
            : theme.COLORS.white} 
        />
      ) : (
        <Text 
          style={[
            styles.text, 
            getTextStyle(), 
            getTextSizeStyle(),
            disabled && styles.disabledText,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.SHADOWS.small,
  },
  primaryButton: {
    backgroundColor: theme.COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: theme.COLORS.background,
    borderWidth: 1,
    borderColor: theme.COLORS.primary,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.COLORS.primary,
  },
  textButton: {
    backgroundColor: 'transparent',
    ...theme.SHADOWS.small,
    shadowOpacity: 0,
    elevation: 0,
  },
  dangerButton: {
    backgroundColor: theme.COLORS.error,
  },
  successButton: {
    backgroundColor: theme.COLORS.success,
  },
  disabledButton: {
    backgroundColor: theme.COLORS.background,
    borderColor: theme.COLORS.text.secondary,
    borderWidth: 1,
    opacity: 0.7,
  },
  fullWidth: {
    width: '100%',
  },
  smallButton: {
    paddingVertical: theme.SPACING.xs,
    paddingHorizontal: theme.SPACING.md,
    minWidth: 80,
  },
  mediumButton: {
    paddingVertical: theme.SPACING.sm,
    paddingHorizontal: theme.SPACING.lg,
    minWidth: 120,
  },
  largeButton: {
    paddingVertical: theme.SPACING.md,
    paddingHorizontal: theme.SPACING.xl,
    minWidth: 160,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  lightText: {
    color: theme.COLORS.white,
  },
  darkText: {
    color: theme.COLORS.primary,
  },
  disabledText: {
    color: theme.COLORS.text.secondary,
  },
  smallText: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
  },
  mediumText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
  },
  largeText: {
    fontSize: theme.TYPOGRAPHY.fontSize.lg,
  },
});

export default Button; 