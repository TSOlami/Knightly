import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import theme from '../../../src/theme';
import Button from '../../../src/components/Button';
import Card from '../../../src/components/Card';
import { useAuth } from '../../../src/context/AuthContext';

const ConvertAccountScreen = () => {
  const { user, convertGuestAccount, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const success = await convertGuestAccount(username, email, password);
      
      if (success) {
        Alert.alert(
          'Account Created',
          'Your guest account has been successfully converted to a full account!',
          [{ text: 'OK', onPress: () => router.back() }]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to convert account. Please try again.');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.back();
  };

  if (!user?.isGuest) {
    // If user is not a guest, redirect back
    router.back();
    return null;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card title="Create Your Account" style={styles.card}>
        <Text style={styles.subtitle}>
          Convert your guest account to a full account to save your progress and settings permanently.
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, errors.username && styles.inputError]}
            value={username}
            onChangeText={setUsername}
            placeholder="Choose a username"
            autoCapitalize="none"
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={[styles.input, errors.password && styles.inputError]}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            secureTextEntry
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm your password"
            secureTextEntry
          />
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Create Account"
            onPress={handleSubmit}
            style={styles.submitButton}
            disabled={loading}
          />
          {loading && <ActivityIndicator style={styles.loading} color={theme.COLORS.primary} />}
          <Button
            title="Cancel"
            onPress={handleCancel}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
  },
  contentContainer: {
    padding: theme.SPACING.md,
  },
  card: {
    marginBottom: theme.SPACING.lg,
  },
  subtitle: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.text.secondary,
    marginBottom: theme.SPACING.md,
  },
  formGroup: {
    marginBottom: theme.SPACING.md,
  },
  label: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    fontWeight: '600',
    color: theme.COLORS.text.primary,
    marginBottom: theme.SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.COLORS.border,
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.sm,
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.text.primary,
    backgroundColor: theme.COLORS.white,
  },
  inputError: {
    borderColor: theme.COLORS.danger,
  },
  errorText: {
    color: theme.COLORS.danger,
    fontSize: theme.TYPOGRAPHY.fontSize.xs,
    marginTop: theme.SPACING.xs,
  },
  buttonContainer: {
    marginTop: theme.SPACING.md,
  },
  submitButton: {
    marginBottom: theme.SPACING.sm,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.COLORS.border,
  },
  cancelButtonText: {
    color: theme.COLORS.text.primary,
  },
  loading: {
    marginVertical: theme.SPACING.sm,
  },
});

export default ConvertAccountScreen; 