import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import appDB from '@/db/database';
import WeekPager from './components/week-pager';
import { Schedule } from '@/types/schedule';

export default function WeekViewer() {

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        console.log('Loading schedules...');
        const userSchedules : Schedule[] = await appDB.sp_GetSchedules();
        console.log('Loaded schedules:', userSchedules);
        setSchedules(userSchedules);
      } catch (error) {
        console.error('Failed to load schedules:', error);
      }
    };
    loadSchedules();
  }, []);

  useEffect(() => {
    console.log(schedules);
  }, [schedules]);

  const today = new Date();
  
  return (
    <View style={{ flex: 1 }}>
        <WeekPager 
            anchorDate={today}
            schedules={schedules}
        />
    </View>
  );
}