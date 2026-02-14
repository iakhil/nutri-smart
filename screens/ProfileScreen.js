import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useUser } from '../context/UserContext';

const GOALS = [
  { id: 'losing_weight', label: 'Losing Weight' },
  { id: 'gaining_weight', label: 'Gaining Weight' },
  { id: 'building_body', label: 'Building Body' },
  { id: 'maintaining', label: 'Maintaining Weight' },
];

const DIETARY_RESTRICTIONS = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'gluten_free', label: 'Gluten-Free' },
  { id: 'dairy_free', label: 'Dairy-Free' },
  { id: 'nut_free', label: 'Nut-Free' },
];

const COMMON_ALLERGIES = [
  'Peanuts', 'Tree Nuts', 'Milk', 'Eggs', 'Fish', 'Shellfish', 'Soy', 'Wheat',
  'Sesame', 'Sulfites', 'Mustard', 'Celery', 'Lupin',
];

export default function ProfileScreen() {
  const { userProfile, updateProfile } = useUser();
  const [allergyInput, setAllergyInput] = useState('');

  const toggleAllergy = (allergy) => {
    const allergies = userProfile.allergies || [];
    if (allergies.includes(allergy)) {
      updateProfile({ allergies: allergies.filter(a => a !== allergy) });
    } else {
      updateProfile({ allergies: [...allergies, allergy] });
    }
  };

  const addCustomAllergy = () => {
    if (allergyInput.trim() && !userProfile.allergies.includes(allergyInput.trim())) {
      updateProfile({ allergies: [...userProfile.allergies, allergyInput.trim()] });
      setAllergyInput('');
    }
  };

  const toggleDietaryRestriction = (restriction) => {
    const restrictions = userProfile.dietaryRestrictions || [];
    const newRestrictions = restrictions.includes(restriction)
      ? restrictions.filter(r => r !== restriction)
      : [...restrictions, restriction];
    
    console.log('Toggling restriction:', restriction);
    console.log('Current restrictions:', restrictions);
    console.log('New restrictions:', newRestrictions);
    
    updateProfile({ dietaryRestrictions: newRestrictions });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Your Profile</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Goals</Text>
          <View style={styles.optionsContainer}>
            {GOALS.map((goal) => (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.option,
                  userProfile.goals === goal.id && styles.optionSelected,
                ]}
                onPress={() => updateProfile({ goals: goal.id })}
              >
                <Text
                  style={[
                    styles.optionText,
                    userProfile.goals === goal.id && styles.optionTextSelected,
                  ]}
                >
                  {goal.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
          <View style={styles.optionsContainer}>
            {DIETARY_RESTRICTIONS.map((restriction) => (
              <TouchableOpacity
                key={restriction.id}
                style={[
                  styles.option,
                  userProfile.dietaryRestrictions?.includes(restriction.id) && styles.optionSelected,
                ]}
                onPress={() => toggleDietaryRestriction(restriction.id)}
              >
                <Text
                  style={[
                    styles.optionText,
                    userProfile.dietaryRestrictions?.includes(restriction.id) && styles.optionTextSelected,
                  ]}
                >
                  {restriction.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Food Allergies</Text>
          <View style={styles.optionsContainer}>
            {COMMON_ALLERGIES.map((allergy) => (
              <TouchableOpacity
                key={allergy}
                style={[
                  styles.option,
                  userProfile.allergies?.includes(allergy) && styles.optionSelected,
                ]}
                onPress={() => toggleAllergy(allergy)}
              >
                <Text
                  style={[
                    styles.optionText,
                    userProfile.allergies?.includes(allergy) && styles.optionTextSelected,
                  ]}
                >
                  {allergy}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add custom allergy..."
              value={allergyInput}
              onChangeText={setAllergyInput}
              onSubmitEditing={addCustomAllergy}
            />
            <TouchableOpacity style={styles.addButton} onPress={addCustomAllergy}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  optionSelected: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
