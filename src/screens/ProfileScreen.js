import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import theme from '../theme';
import Button from '../components/Button';
import Card from '../components/Card';

const ProfileScreen = () => {
  // This would normally be fetched from a user state/context
  const userStats = {
    puzzlesSolved: 42,
    streak: 7,
    rating: 1250,
    joined: 'April 2025',
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.profileInitial}>U</Text>
          </View>
        </View>
        <Text style={styles.username}>User123</Text>
        <Text style={styles.memberSince}>Member since {userStats.joined}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userStats.puzzlesSolved}</Text>
          <Text style={styles.statLabel}>Puzzles Solved</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userStats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{userStats.rating}</Text>
          <Text style={styles.statLabel}>Puzzle Rating</Text>
        </View>
      </View>
      
      <Card title="Recent Activity" style={styles.activityCard}>
        <Text style={styles.placeholderText}>
          Your recent activity will appear here. Start solving puzzles to see your progress!
        </Text>
      </Card>
      
      <Card title="Achievements" style={styles.achievementsCard}>
        <Text style={styles.placeholderText}>
          Complete puzzles to unlock achievements and track your progress.
        </Text>
        
        <Button
          title="View All Achievements"
          variant="outline"
          size="small"
          style={styles.achievementsButton}
        />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.background,
    padding: theme.SPACING.md,
  },
  header: {
    alignItems: 'center',
    marginVertical: theme.SPACING.lg,
  },
  profileImageContainer: {
    marginBottom: theme.SPACING.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
    color: theme.COLORS.white,
  },
  username: {
    fontSize: theme.TYPOGRAPHY.fontSize.xl,
    fontWeight: 'bold',
    color: theme.COLORS.text.primary,
    marginBottom: theme.SPACING.xs,
  },
  memberSince: {
    fontSize: theme.TYPOGRAPHY.fontSize.sm,
    color: theme.COLORS.text.secondary,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.SPACING.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
    borderRadius: theme.BORDER_RADIUS.md,
    padding: theme.SPACING.md,
    marginHorizontal: theme.SPACING.xs,
    alignItems: 'center',
    ...theme.SHADOWS.small,
  },
  statValue: {
    fontSize: theme.TYPOGRAPHY.fontSize.xxl,
    fontWeight: 'bold',
    color: theme.COLORS.primary,
    marginBottom: theme.SPACING.xs,
  },
  statLabel: {
    fontSize: theme.TYPOGRAPHY.fontSize.xs,
    color: theme.COLORS.text.secondary,
    textAlign: 'center',
  },
  activityCard: {
    marginBottom: theme.SPACING.md,
  },
  achievementsCard: {
    marginBottom: theme.SPACING.md,
  },
  placeholderText: {
    fontSize: theme.TYPOGRAPHY.fontSize.md,
    color: theme.COLORS.text.secondary,
    marginBottom: theme.SPACING.md,
    textAlign: 'center',
  },
  achievementsButton: {
    alignSelf: 'center',
  },
});

export default ProfileScreen; 