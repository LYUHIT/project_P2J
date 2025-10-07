import React, { useMemo, useRef, useState } from "react";
import { View, FlatList, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import WeekCalendar from "./week-calendar";

const WEEKS_WINDOW = 401;                    // 앞뒤 200주 버퍼
const INITIAL_INDEX = Math.floor(WEEKS_WINDOW / 2);

function startOfWeek(d: Date, weekStartsOn = 1) { // 1=월
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7; // 0=월
  x.setDate(x.getDate() - day + (weekStartsOn === 1 ? 0 : 1));
  x.setHours(0,0,0,0);
  return x;
}
const addDays  = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };
const addWeeks = (d: Date, n: number) => addDays(d, n*7);

export type Schedule = { id: string; dayIndex: number; start: string; end: string; title: string };

export default function WeekPager({
  anchorDate = new Date(),
  schedules,
}: {
  anchorDate?: Date;            // 기준 주(보통 오늘)
  schedules: Schedule[];
}) {
  const pagerRef = useRef<FlatList<number> | null>(null);
  const [pageH, setPageH] = useState(0);
  const anchorStart = useMemo(() => startOfWeek(anchorDate, 1), [anchorDate]);

  // -200주 … +200주 오프셋 목록
  const offsets = useMemo(() => Array.from({ length: WEEKS_WINDOW }, (_, i) => i - INITIAL_INDEX), []);

  const renderItem = ({ item: weekOffset }: { item: number }) => {
    const weekStart = addWeeks(anchorStart, weekOffset);
    const weekEnd   = addDays(weekStart, 7);
    // 이 주에 해당하는 일정만 필터 (예시)
    const items = schedules.filter(s => s.dayIndex >= 0 && s.dayIndex < 7);
    return (
      <View style={{ height: pageH || '100%' }}>
        <WeekCalendar weekStartDate={weekStart} schedules={items} />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }} onLayout={e => setPageH(e.nativeEvent.layout.height)}>
      <FlatList
        ref={pagerRef}
        data={offsets}
        keyExtractor={(n) => String(n)}
        renderItem={renderItem}
        initialScrollIndex={INITIAL_INDEX} // 현재 주부터 시작
        pagingEnabled          // 한 페이지씩 스냅
        snapToInterval={pageH > 0 ? pageH : undefined} // pageH가 0일 때는 undefined
        snapToAlignment="start" // 스냅을 시작점으로 정렬
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        getItemLayout={pageH > 0 ? (_, index) => ({ length: pageH, offset: pageH * index, index }) : undefined}
      />
    </View>
  );
}
