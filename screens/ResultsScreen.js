import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ResultsScreen({ route }) {
  const { imageUri, analysis } = route.params || {};

  const renderScoreBar = (label, score) => {
    return (
      <View style={styles.scoreItem}>
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreLabel}>{label}</Text>
          <Text style={styles.scoreValue}>{score}/10</Text>
        </View>
        <View style={styles.scoreBarContainer}>
          <View style={styles.scoreBarBackground}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={[styles.scoreBarFill, { width: `${score * 10}%` }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </View>
      </View>
    );
  };

  if (!analysis) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No analysis data available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.productImage} />
      )}
      
      <View style={styles.content}>
        <Text style={styles.productName}>{analysis.productName}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{analysis.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Scores</Text>
          {renderScoreBar('Health', analysis.scores.health)}
          {renderScoreBar('Fulfilling', analysis.scores.fulfilling)}
          {renderScoreBar('Taste', analysis.scores.taste)}
        </View>

        {analysis.pros && analysis.pros.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.prosTitle]}>✅ Pros</Text>
            {analysis.pros.map((pro, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listText}>{pro}</Text>
              </View>
            ))}
          </View>
        )}

        {analysis.cons && analysis.cons.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, styles.consTitle]}>⚠️ Cons</Text>
            {analysis.cons.map((con, index) => (
              <View key={index} style={styles.listItem}>
                <Text style={styles.listText}>{con}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  productImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  prosTitle: {
    color: '#4caf50',
  },
  consTitle: {
    color: '#f44336',
  },
  summaryText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  scoreItem: {
    marginBottom: 16,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  scoreBarContainer: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarBackground: {
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  listText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});
