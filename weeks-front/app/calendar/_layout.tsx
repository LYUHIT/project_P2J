import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import PillTabs from '@/components/pill-tabs';
import DayViewer from './day/week-viewer';
import WeekViewer from './week/week-viewer';
import MonthViewer from './month/month-viewer';

const tabs = [
  { key: 'day-viewer', label: 'Day' },
  { key: 'week-viewer', label: 'Week' },
  { key: 'month-viewer', label: 'Month' },
];

export default function CalendarLayout() {
  const [activeTab, setActiveTab] = useState('week-viewer');

  const renderContent = () => {
    switch (activeTab) {
      case 'day-viewer':
        return <DayViewer />;
      case 'week-viewer':
        return <WeekViewer />;
      case 'month-viewer':
        return <MonthViewer />;
      default:
        return <WeekViewer />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ThemedView style={styles.container}>
        <PillTabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabPress={setActiveTab} 
        />
        <View style={styles.content}>
          {renderContent()}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
  },
});
