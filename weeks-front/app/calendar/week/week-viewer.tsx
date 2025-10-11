import appDB from '@/db/database';
import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Schedule } from "@/types/schedule";
import WeekPage from "./week-page";
import { FlashList, FlashListRef } from "@shopify/flash-list";

const INITIAL_WEEKS = 10000;
const INITIAL_INDEX = 5000;

function startOfWeek(d: Date, weekStartsOn = 1) { // 1=월
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // 0=월
  x.setDate(x.getDate() - day + (weekStartsOn === 1 ? 0 : 1));
  x.setHours(0,0,0,0);
  return x;
}

const addDays = (d: Date, n: number) => { 
  const x = new Date(d); 
  x.setDate(x.getDate() + n); 
  return x; 
};

const addWeeks = (d: Date, n: number) => addDays(d, n * 7);

export default function WeekViewer() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [pageH, setPageH] = useState(0);
  const [weeks, setWeeks] = useState<number[]>([]);
  
  const pagerRef = useRef<FlashListRef<number> | null>(null);
  const today = useMemo(() => new Date(), []);
  
  const anchorStart = useMemo(() => {
    return startOfWeek(today, 1);
  }, [today]);

  // 일정 로드
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        console.log('Loading schedules...');
        const userSchedules: Schedule[] = await appDB.sp_GetSchedules();
        console.log('Loaded schedules:', userSchedules);
        setSchedules(userSchedules);
      } catch (error) {
        console.error('Failed to load schedules:', error);
      }
    };
    loadSchedules();
  }, []);

  // 초기 주 배열 생성
  useEffect(() => {
    setWeeks(Array.from({ length: INITIAL_WEEKS }, (_, i) => i - INITIAL_INDEX));
  }, []);

  // 아이템 렌더링
  const renderWeekPage = ({ item: weekOffset }: { item: number }) => {
    const weekStart = addWeeks(anchorStart, weekOffset);
    const weekEnd = addDays(weekStart, 7);
    
    // 이 주에 해당하는 일정만 필터
    const items = schedules.filter(s => s.StartTime >= weekStart && s.EndTime <= weekEnd);
    
    console.log('🔍 weekpage renderItem:', {
      weekOffset,
      anchorStart: anchorStart.toISOString(),
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString()
    });
    
    return (
      <View style={{ height: pageH || '100%' }}>
        <WeekPage weekStartDate={weekStart} schedules={items} />
      </View>
    );
  };

  // ================================================
  // 로딩 상태 처리
  if (pageH === 0) {
    return (
      <View style={{ flex: 1 }} onLayout={e => setPageH(e.nativeEvent.layout.height)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }
  
  // 로딩 완료 후 페이지 처리
  return (
    <View style={{ flex: 1 }} onLayout={e => setPageH(e.nativeEvent.layout.height)}>
      <FlashList
        ref={pagerRef}
        data={weeks}
        keyExtractor={(n) => String(n)}
        initialScrollIndex={INITIAL_INDEX}
        scrollEventThrottle={100}
        pagingEnabled
        snapToInterval={pageH}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        renderItem={renderWeekPage}
      />
    </View>
  );
}
