import React from 'react';
import { View } from 'react-native';
import WeekPager from './components/week-pager';
import { Schedule } from './components/week-pager';

export default function WeekViewer() {
  return (
    <View style={{ flex: 1 }}>
        <WeekPager 
            anchorDate={new Date()}
            schedules={testItems}
        />
    </View>
  );
}


const testItems : Schedule[] = [
  { id: '1', title: 'Meeting', start: '09:00', end: '12:00', dayIndex: 0   },
  { id: '2', title: 'Presentation', start: '13:30', end: '15:30', dayIndex: 0 },
  { id: '3', title: 'Lunch', start: '12:00', end: '13:30', dayIndex: 1 },
  { id: '4', title: 'Conference', start: '14:00', end: '16:00', dayIndex: 3 },
  { id: '5', title: 'Dinner', start: '18:00', end: '21:00', dayIndex: 4 },
];