import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  FlatList, 
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Import LinearGradient with a fallback mechanism
let LinearGradient;
try {
  LinearGradient = require('react-native-linear-gradient').LinearGradient;
} catch (e) {
  // If LinearGradient fails to load, create a fallback component
  LinearGradient = ({ colors, style, children, ...props }) => (
    <View style={[style, { backgroundColor: colors[0] }]} {...props}>
      {children}
    </View>
  );
}

import CategoryCard from '../components/CategoryCard';
import PuzzleCard from '../components/PuzzleCard';
import { CATEGORIES, getPuzzlesByCategory } from '../puzzles';
import { COLORS, SIZES, SHADOWS } from '../theme';

export default function HomeScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('checkmate-in-1');
  const puzzles = getPuzzlesByCategory(selectedCategory);

  const handleCategoryPress = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handlePuzzlePress = (puzzleId) => {
    router.push(`/puzzle/${puzzleId}`);
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.appTitle}>Knightly</Text>
            </View>
            
            <View style={styles.logoContainer}>
              <Icon name="chess-knight" size={28} color="#fff" />
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollView}
        >
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onPress={() => handleCategoryPress(category.id)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.puzzlesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Puzzles'}
          </Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="chevron-right" size={12} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No puzzles available in this category</Text>
    </View>
  );

  const renderPuzzleItem = ({ item }) => (
    <PuzzleCard 
      puzzle={item} 
      onPress={() => handlePuzzlePress(item.id)}
      style={styles.puzzleCard} 
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <FlatList
        data={puzzles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPuzzleItem}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    paddingBottom: SIZES.xl,
  },
  header: {
    ...SHADOWS.medium,
    borderBottomLeftRadius: SIZES.radiusLg,
    borderBottomRightRadius: SIZES.radiusLg,
    overflow: 'hidden',
    marginBottom: SIZES.l,
  },
  headerGradient: {
    paddingTop: SIZES.m,
    paddingHorizontal: SIZES.l,
    paddingBottom: SIZES.l,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: SIZES.body,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: SIZES.xs / 2,
  },
  appTitle: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    marginBottom: SIZES.l,
    paddingHorizontal: SIZES.m,
  },
  categoriesScrollView: {
    paddingLeft: SIZES.xs,
    paddingRight: SIZES.l,
    paddingVertical: SIZES.s,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.m,
    marginLeft: SIZES.xs,
  },
  puzzlesContainer: {
    paddingHorizontal: SIZES.l,
  },
  puzzleCard: {
    marginHorizontal: SIZES.l,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: SIZES.caption,
    color: COLORS.primary,
    marginRight: 4,
  },
  emptyContainer: {
    padding: SIZES.l,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusMd,
    ...SHADOWS.small,
    marginHorizontal: SIZES.l,
    marginBottom: SIZES.m,
  },
  emptyText: {
    fontSize: SIZES.body,
    color: COLORS.textLight,
    textAlign: 'center',
  },
});