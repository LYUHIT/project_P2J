import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function DayViewer() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Day View
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Your daily schedule and events
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.content}>
        <ThemedText type="default" style={styles.description}>
          This is the Day View within Week Viewer. Here you can:
        </ThemedText>
        <ThemedView style={styles.featureList}>
          <ThemedText type="default">• View daily schedule</ThemedText>
          <ThemedText type="default">• Add daily events</ThemedText>
          <ThemedText type="default">• Track daily progress</ThemedText>
          <ThemedText type="default">• Set daily reminders</ThemedText>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  featureList: {
    gap: 8,
  },
});
