import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface TabItem {
  key: string;
  label: string;
}

interface PillTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
}

export default function PillTabs({ tabs, activeTab, onTabPress }: PillTabsProps) {
  console.log('PillTabs rendered with tabs:', tabs, 'activeTab:', activeTab);
  
  const handleTabPress = (key: string) => {
    console.log('Tab pressed:', key);
    onTabPress(key);
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          console.log(`Tab ${tab.key} isActive:`, isActive);
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.pill,
                isActive && styles.activePill
              ]}
              onPress={() => handleTabPress(tab.key)}
            >
              <ThemedText
                style={[
                  styles.pillText,
                  isActive && styles.activePillText
                ]}
              >
                {tab.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'transparent',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 25,
    padding: 4,
    gap: 4,
  },
  pill: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  activePill: {
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activePillText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
