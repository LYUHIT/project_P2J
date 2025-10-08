import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, FlatList, NativeScrollEvent, NativeSyntheticEvent, Text } from "react-native";
import { Schedule } from "@/types/schedule";
import WeekCalendar from "./week-calendar";


const INITIAL_WEEKS = 50;                     // 초기 주 수 (앞뒤 25주)
const INITIAL_INDEX = Math.floor(INITIAL_WEEKS / 2); // 25 (중간 지점)

function startOfWeek(d: Date, weekStartsOn = 1) { // 1=월
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // 0=월
  x.setDate(x.getDate() - day + (weekStartsOn === 1 ? 0 : 1));
  x.setHours(0,0,0,0);
  return x;
}
const addDays  = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };
const addWeeks = (d: Date, n: number) => addDays(d, n*7);


export default function WeekPager({
  anchorDate = new Date(),
  schedules,
}: {
  anchorDate?: Date;            // 기준 주(보통 오늘)
  schedules: Schedule[];
}) {
  const pagerRef = useRef<FlatList<number> | null>(null);
  const [pageH, setPageH] = useState(0);
  const [weeks, setWeeks] = useState<number[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const anchorStart = useMemo(() => {
    const result = startOfWeek(anchorDate, 1);
    return result;
  }, [anchorDate]);

  // 초기 주 배열 생성 (중간이 현재 주)
  useEffect(() => {
    const initialWeeks = Array.from({ length: INITIAL_WEEKS }, (_, i) => i - INITIAL_INDEX);
    setWeeks(initialWeeks);
  }, []);


  // 동적 주 추가 함수
  const addWeeksToEnd = () => {
    setWeeks(prev => {
      const lastWeek = prev[prev.length - 1];
      const newWeeks = Array.from({ length: 10 }, (_, i) => lastWeek + i + 1);
      return [...prev, ...newWeeks];
    });
  };

  const addWeeksToStart = () => {
    setWeeks(prev => {
      const firstWeek = prev[0];
      const newWeeks = Array.from({ length: 10 }, (_, i) => firstWeek - i - 1);
      return [...newWeeks, ...prev];
    });
  };

  // 스크롤 이벤트 핸들러 (중복 호출 방지)
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isLoadingMore) return; // 이미 로딩 중이면 무시
    
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const scrollY = contentOffset.y;
    const contentHeight = contentSize.height;
    const screenHeight = layoutMeasurement.height;
    
    // 끝에 가까우면 더 많은 주 추가
    if (scrollY + screenHeight > contentHeight - screenHeight * 3) {
      setIsLoadingMore(true);
      addWeeksToEnd();
      setTimeout(() => setIsLoadingMore(false), 1000);
    }
    
    // 시작에 가까우면 앞쪽 주 추가
    if (scrollY < screenHeight * 3) {
      setIsLoadingMore(true);
      addWeeksToStart();
      setTimeout(() => setIsLoadingMore(false), 1000);
    }
  };

  const renderItem = ({ item: weekOffset }: { item: number }) => {
    const weekStart = addWeeks(anchorStart, weekOffset);
    const weekEnd   = addDays(weekStart, 7);
    // 이 주에 해당하는 일정만 필터 (예시)
    const items = schedules.filter(s => s.StartTime >= weekStart && s.EndTime <= weekEnd);
    
    return (
      <View style={{ height: pageH || '100%' }}>
        <WeekCalendar weekStartDate={weekStart} schedules={items} />
      </View>
    );
  };

  // pageH가 설정될 때까지 기다림
  if (pageH === 0) {
    return (
      <View style={{ flex: 1 }} onLayout={e => setPageH(e.nativeEvent.layout.height)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} onLayout={e => setPageH(e.nativeEvent.layout.height)}>
      <FlatList
        ref={pagerRef}
        data={weeks}
        keyExtractor={(n) => String(n)}
        renderItem={renderItem}
        initialScrollIndex={INITIAL_INDEX}
        onScroll={handleScroll}
        scrollEventThrottle={100}
        pagingEnabled
        snapToInterval={pageH}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({ length: pageH, offset: pageH * index, index })}
      />
    </View>
  );
}
