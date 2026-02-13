import React, { createContext, useState, useContext, useEffect } from 'react';
import { profileService } from '../services/profileService';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState({
    allergies: [],
    goals: null, // 'losing_weight', 'gaining_weight', 'building_body', 'maintaining'
    dietaryRestrictions: [], // 'vegetarian', 'vegan', 'keto', 'paleo', 'gluten_free', etc.
  });
  const [loading, setLoading] = useState(false);

  // Load profile from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    } else {
      // Reset profile when logged out
      setUserProfile({
        allergies: [],
        goals: null,
        dietaryRestrictions: [],
      });
    }
  }, [isAuthenticated]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const result = await profileService.getProfile();
      if (result.success) {
        setUserProfile({
          allergies: result.profile.allergies || [],
          goals: result.profile.goals || null,
          dietaryRestrictions: result.profile.dietary_restrictions || [],
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    console.log('updateProfile called with:', updates);
    
    // Calculate the new profile state
    const newProfile = {
      allergies: updates.allergies !== undefined ? updates.allergies : userProfile.allergies,
      goals: updates.goals !== undefined ? updates.goals : userProfile.goals,
      dietaryRestrictions: updates.dietaryRestrictions !== undefined 
        ? updates.dietaryRestrictions 
        : userProfile.dietaryRestrictions,
    };
    
    // Optimistically update local state
    setUserProfile(newProfile);

    // Sync with backend using the new values
    try {
      const result = await profileService.updateProfile({
        allergies: newProfile.allergies,
        goals: newProfile.goals,
        dietaryRestrictions: newProfile.dietaryRestrictions,
      });

      console.log('Profile update result:', result);

      if (result.success) {
        // Update with server response to ensure consistency
        setUserProfile({
          allergies: result.profile.allergies || [],
          goals: result.profile.goals || null,
          dietaryRestrictions: result.profile.dietary_restrictions || [],
        });
        console.log('Profile updated successfully');
      } else {
        console.error('Profile update failed:', result.error);
        // Revert on error
        loadProfile();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Revert on error
      loadProfile();
    }
  };

  return (
    <UserContext.Provider value={{ userProfile, updateProfile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
