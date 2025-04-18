import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import theme from '../theme';
import Button from '../components/Button';
import { SvgXml } from 'react-native-svg';

// Google icon SVG
const googleIconSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="46px" height="46px" viewBox="0 0 46 46" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Google Icon</title>
    <g id="Google-Button" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="btn_google_light_normal" transform="translate(-1.000000, -1.000000)">
            <g id="button" transform="translate(4.000000, 4.000000)">
                <g id="Google-Icon">
                    <path d="M20.64,12.2045455 C20.64,11.5181818 20.5827273,10.8636364 20.4763636,10.2272727 L10.8,10.2272727 L10.8,14.7681818 L16.4072727,14.7681818 C16.1454545,16.2681818 15.3436364,17.5418182 14.1109091,18.3963636 L14.1109091,21.3954545 L17.4109091,21.3954545 C19.3454545,19.3454545 20.64,16.0727273 20.64,12.2045455 L20.64,12.2045455 Z" id="Shape" fill="#4285F4"></path>
                    <path d="M10.8,24 C13.6363636,24 16.0181818,22.9454545 17.4109091,21.3954545 L14.1109091,18.3963636 C13.1454545,19.0372727 12.0181818,19.4181818 10.8,19.4181818 C8.14909091,19.4181818 5.92363636,17.5627273 5.32363636,15.0636364 L1.92,15.0636364 L1.92,18.1454545 C3.30545455,21.6 6.76363636,24 10.8,24 L10.8,24 Z" id="Shape" fill="#34A853"></path>
                    <path d="M5.32363636,15.0636364 C5.20909091,14.4927273 5.14363636,13.9045455 5.14363636,13.2954545 C5.14363636,12.6863636 5.22,12.0981818 5.32363636,11.5272727 L5.32363636,8.44545455 L1.92,8.44545455 C1.41818182,9.96 1.12909091,11.5890909 1.12909091,13.2954545 C1.12909091,15.0018182 1.41818182,16.6309091 1.92,18.1454545 L5.32363636,15.0636364 L5.32363636,15.0636364 Z" id="Shape" fill="#FBBC05"></path>
                    <path d="M10.8,7.17272727 C12.2063636,7.17272727 13.4727273,7.66363636 14.4654545,8.59090909 L17.3963636,5.66727273 C15.9981818,4.38 13.6363636,3.60272727 10.8,3.60272727 C6.76363636,3.60272727 3.30545455,6.00272727 1.92,9.45545455 L5.32363636,12.5372727 C5.90909091,10.0381818 8.14909091,7.17272727 10.8,7.17272727 L10.8,7.17272727 Z" id="Shape" fill="#EA4335"></path>
                </g>
            </g>
        </g>
    </g>
</svg>`;

// Ensure web redirect results close the browser
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ 
  onLogin, 
  onGuestLogin, 
  onGoogleLogin, 
  loading = false, 
  error = null 
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  // Toggle between login and register
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setValidationError('');
  };
  
  // Validate form
  const validateForm = () => {
    if (isLogin) {
      if (!email || !password) {
        setValidationError('Please enter email and password');
        return false;
      }
    } else {
      if (!username) {
        setValidationError('Please enter a username');
        return false;
      }
      
      if (!email) {
        setValidationError('Please enter an email');
        return false;
      }
      
      if (!password) {
        setValidationError('Please enter a password');
        return false;
      }
      
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters');
        return false;
      }
      
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match');
        return false;
      }
    }
    
    setValidationError('');
    return true;
  };
  
  // Handle submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        // For now, we'll just show an error as registration isn't implemented in this demo
        setValidationError('Registration is not implemented in this demo');
      }
    } catch (err) {
      console.error('Auth error:', err);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Knightly</Text>
          <Text style={styles.subtitle}>
            Master chess puzzles, one move at a time
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </Text>
          
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={theme.COLORS.greyLight}
                />
              </TouchableOpacity>
            </View>
          </View>
          
          {!isLogin && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
              />
            </View>
          )}
          
          {(validationError || error) && (
            <Text style={styles.errorText}>
              {validationError || error}
            </Text>
          )}
          
          <Button
            title={isLogin ? 'Log In' : 'Sign Up'}
            onPress={handleSubmit}
            disabled={loading}
            style={styles.submitButton}
          />
          
          <TouchableOpacity onPress={toggleAuthMode} style={styles.switchMode}>
            <Text style={styles.switchModeText}>
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Log In'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
          
          <Button
            title="Continue with Google"
            onPress={onGoogleLogin}
            style={styles.googleButton}
            textStyle={styles.googleButtonText}
            icon={
              <SvgXml xml={googleIconSvg} width={20} height={20} style={styles.googleIcon} />
            }
          />
          
          <Button
            title="Play as Guest"
            onPress={onGuestLogin}
            style={styles.guestButton}
            textStyle={styles.guestButtonText}
          />
        </View>
        
        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={theme.COLORS.primary} />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: theme.COLORS.greyDark,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: theme.COLORS.white,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme.COLORS.text,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: theme.COLORS.greyDark,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.COLORS.greyLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.COLORS.greyLight,
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  submitButton: {
    marginTop: 10,
  },
  errorText: {
    color: theme.COLORS.error,
    marginBottom: 10,
    fontSize: 14,
  },
  switchMode: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchModeText: {
    color: theme.COLORS.primary,
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.COLORS.greyLight,
  },
  dividerText: {
    marginHorizontal: 10,
    color: theme.COLORS.greyDark,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: theme.COLORS.white,
    borderWidth: 1,
    borderColor: theme.COLORS.greyLight,
    marginBottom: 12,
  },
  googleButtonText: {
    color: theme.COLORS.text,
  },
  googleIcon: {
    marginRight: 10,
  },
  guestButton: {
    backgroundColor: theme.COLORS.secondary,
  },
  guestButtonText: {
    color: theme.COLORS.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoginScreen; 