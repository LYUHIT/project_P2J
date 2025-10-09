import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, FlatList, NativeScrollEvent, NativeSyntheticEvent, Text } from "react-native";
import { Schedule } from "@/types/schedule";
import WeekCalendar from "./week-calendar";


const INITIAL_WEEKS = 5;
const INITIAL_INDEX = 2;
const ADD_WEEKS = 5;

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
  console.log(`📄 WeekPager render: anchorDate=${anchorDate.toDateString()}, schedules=${schedules.length}`);
  const pagerRef = useRef<FlatList<number> | null>(null); // 현재 스크롤 위치를 가지고 있는 리프
  const [pageH, setPageH] = useState(0);
  const [weeks, setWeeks] = useState<number[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 중복 스크롤 방지
  const nowWeekIndexRef = useRef(INITIAL_INDEX); // 현재 스크롤 위치

  const anchorStart = useMemo(() => {
    const result = startOfWeek(anchorDate, 1);
    return result;
  }, [anchorDate]);

  // 초기 주 배열 생성 (이번 주 만)
  useEffect(() => {
    setWeeks(Array.from({ length: INITIAL_WEEKS }, (_, i) => i - INITIAL_INDEX)); // 3주치 만 셋팅
  }, []);

  // 지난 주 추가 함수 =================================================
  const addWeeksToStart = () => {
    if (isLoadingMore) {
      return;
    }
    
    setIsLoadingMore(true);
    
    setWeeks(prev => {
      const firstWeek = prev[0];
      const newWeeks = Array.from({ length: ADD_WEEKS }, (_, i) => firstWeek - 1 - i).reverse(); // 3주 단위 로딩

      return [...newWeeks, ...prev];
    });

    // 시간을 거슬러 올라가는 경우, 현재 보고 있던 시각적 위치를 유지하기 위해 인덱스를 보정하고 즉시 오프셋 보정
    nowWeekIndexRef.current += ADD_WEEKS;
    if (pageH > 0 && pagerRef.current) {
      pagerRef.current.scrollToOffset({ offset: nowWeekIndexRef.current * pageH, animated: false });
    }

    // 로딩 상태 해제
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 100);
  };

  // 다음 주 추가 함수 =================================================
  const addWeeksToEnd = () => {
    if (isLoadingMore) {
      return;
    }
    
    setIsLoadingMore(true);

    setWeeks(prev => {
      const lastWeek = prev[prev.length - 1];
      const newWeeks = Array.from({ length: ADD_WEEKS }, (_, i) => lastWeek + 1 + i); // 3주 단위 로딩

      return [...prev, ...newWeeks];
    });

    // 로딩 상태 해제
    setTimeout(() => {
      setIsLoadingMore(false);
    }, 100);
  };

  // 스크롤 이벤트 핸들러 (중복 호출 방지) =================================================
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isLoadingMore) {
      return; // 이미 로딩 중이면 무시
    }

    // 이벤트로 변화한 현재 스크롤 위치를 가지고 페이지로 나누어서 nowWeekIndexRef.current 업데이트
    nowWeekIndexRef.current = Math.round(event.nativeEvent.contentOffset.y / pageH);

    // 시작에 가까우면 앞쪽 주 추가 
    if (nowWeekIndexRef.current < 2) {
      addWeeksToStart();
    }
      
    // 끝에 가까우면 더 많은 주 추가 
    if (nowWeekIndexRef.current == ( weeks.length - 1 ) - 2 ) {
      addWeeksToEnd();
    }
  };

  // 아이템 렌더링 =================================================
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

  // 렌더링 처리 =================================================
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
        keyExtractor={(n, index) => {
          console.log(`🔄 WeekPager render: weekOffset=${n}, index=${index}`);
          return String(n);
        }}
        renderItem={renderItem}
        initialScrollIndex={nowWeekIndexRef.current} // 초기 스크롤 위치
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={100}
        // pagingEnabled
        snapToInterval={pageH} // 한 주 페이지씩 넘기도록 셋팅
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({ length: pageH, offset: pageH * index, index })} // data의 아이템, index를 받는다. data의 각각의 아이템에 셋팅
      />
    </View>
  );
}