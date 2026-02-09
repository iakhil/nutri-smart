import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../context/UserContext';
import { analyzeFoodLabel } from '../services/geminiService';

export default function CameraScreen() {
  const navigation = useNavigation();
  const { userProfile } = useUser();
  const [permission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        setIsProcessing(true);
        const photo = await cameraRef.current.takePictureAsync();
        setImageUri(photo.uri);
        setIsProcessing(false);
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture');
        setIsProcessing(false);
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const analyzeFood = async () => {
    if (!imageUri) {
      Alert.alert('No Image', 'Please take or select a photo first');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call Gemini API to analyze the food label
      const analysis = await analyzeFoodLabel(imageUri, userProfile);
      
      setIsProcessing(false);
      
      // Navigate to results with real analysis data
      navigation.navigate('Results', {
        imageUri,
        analysis,
      });
    } catch (error) {
      setIsProcessing(false);
      console.error('Analysis error:', error);
      Alert.alert(
        'Analysis Failed',
        error.message || 'Failed to analyze food label. Please make sure your API key is set correctly and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  if (imageUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.preview} />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() => setImageUri(null)}
          >
            <Text style={styles.buttonTextSecondary}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={analyzeFood}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Analyze Food</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      >
        <View style={styles.overlay}>
          <View style={styles.frame} />
          <Text style={styles.instruction}>
            Position the food label within the frame
          </Text>
        </View>
      </CameraView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={pickImage}>
          <Text style={styles.buttonTextSecondary}>Choose from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={takePicture}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Take Photo</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: '80%',
    height: '60%',
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 10,
    borderStyle: 'dashed',
  },
  instruction: {
    color: '#fff',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 8,
  },
  preview: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#000',
  },
  button: {
    backgroundColor: '#667eea',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#333',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonTextSecondary: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});
