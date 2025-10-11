import React, { useState, useEffect } from 'react';
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
  const [beforeActiveTab, setBeforeActiveTab] = useState('week-viewer');
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [pillTabsHeight, setPillTabsHeight] = useState(0);

  
  // PillTabs의 레이아웃이 완료된 후에 콘텐츠 렌더링
  useEffect(() => {
    if (pillTabsHeight > 0) {
      // PillTabs가 실제 높이를 가지면 레이아웃이 완료된 것으로 간주
      const timer = setTimeout(() => {
        setIsLayoutReady(true);
        console.log('PillTabs layout complete, rendering content');
      }, 50); // 추가 안정화 시간

      return () => clearTimeout(timer);
    }
  }, [pillTabsHeight]);

  const renderContent = () => {
    if (!isLayoutReady) {
      return null; // 레이아웃이 준비되지 않았으면 아무것도 렌더링하지 않음
    }

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
        <View onLayout={(e) => setPillTabsHeight(e.nativeEvent.layout.height)}>
          <PillTabs 
            tabs={tabs} 
            activeTab={activeTab} 
            onTabPress={(key) => {
              setActiveTab(key);
            }} 
          />
        </View>
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
