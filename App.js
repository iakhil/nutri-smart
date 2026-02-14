import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserProvider } from './context/UserContext';

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import CameraScreen from './screens/CameraScreen';
import ResultsScreen from './screens/ResultsScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

// Auth Navigator (Login/Signup)
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

// Main App Navigator (Protected routes)
function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#000000',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
            options={{ title: 'Aisle Scan', headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Your Profile' }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ title: 'Scan Food Label', headerShown: false }}
      />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{ title: 'Analysis Results' }}
      />
    </Stack.Navigator>
  );
}

// Root component that handles auth state
function RootNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <RootNavigator />
        </NavigationContainer>
      </UserProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
