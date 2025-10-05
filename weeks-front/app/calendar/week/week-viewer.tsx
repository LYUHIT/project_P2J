import React from 'react';
import { View } from 'react-native';
import WeekCalendar from './components/week-calendar';

export default function WeekViewer() {
  return (
    <View style={{ flex: 1 }}>
        <WeekCalendar 
            weekStartDate={new Date()}
            schedules={[]}
            onPressSchedule={() => void 0}
        />
    </View>
  );
}