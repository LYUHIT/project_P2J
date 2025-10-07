import React, { useMemo, useRef, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Schedule } from "./week-pager";
import WeekTimeBar from "./week-time-bar";

const HOUR_WIDTH = 60;
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["월","화","수","목","금","토","일"] as const;
const PPM = HOUR_WIDTH / 60;

const toMin = (t: string) => { const [h,m] = t.split(":").map(Number); return h*60+m; };

export default function WeekCalendar({
  weekStartDate,
  schedules = [],
}: {
  weekStartDate: Date;
  schedules: Schedule[];
}) {
  const scrollRef = useRef<ScrollView | null>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  
  // 동적으로 계산된 행 높이 (페이지 높이의 7등분)
  const timeHeaderHeight = 30; // 시간 헤더 높이 (WeekTimeBar의 실제 높이)
  const rowHeight = containerHeight > 0 ? (containerHeight - timeHeaderHeight) / 7 : 72;

  // 요일별로 묶기
  const byDay = useMemo(() => {
    const map: Record<number, Schedule[]> = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
    schedules.forEach(s => map[s.dayIndex]?.push(s));
    return map;
  }, [schedules]);

  useEffect(() => {
    // 초기 가로 위치(예: 09:00)
    scrollRef.current?.scrollTo({ x: 9 * HOUR_WIDTH, animated: false });
  }, [weekStartDate]);

  return (
    <View 
      style={{ flexDirection: "row", height: "100%" }}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      {/* 왼쪽 고정 열 (요일/날짜) */}
      <View style={{ width: 96, borderRightWidth: 1, borderColor: "#eee" }}>
        <View style={{ height: 32 }} />
        {DAYS.map((d, i) => {
          const dayDate = new Date(weekStartDate);
          dayDate.setDate(weekStartDate.getDate() + i);
          return (
            <View key={i} style={{ height: rowHeight, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontWeight: "700" }}>{d}</Text>
              <Text style={{ color: "#64748b" }}>
                {`${dayDate.getMonth()+1}/${dayDate.getDate()}`}
              </Text>
            </View>
          );
        })}
      </View>

      {/* 오른쪽: 시간 헤더 + 7행 그리드 (가로 스크롤만) */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled
        contentContainerStyle={{}}
      >
        <View style={{ width: HOUR_WIDTH * 24 }}>
          {/* 7행(세로 스크롤 없음) */}
          <WeekTimeBar/>
          <View>
            {DAYS.map((_, dayIndex) => (
              <View key={dayIndex} style={{ height: rowHeight, width: HOUR_WIDTH*24, position: "relative" }}>
                {/* 바닥: 시간 격자 (세로선) */}
                <View style={[StyleSheet.absoluteFillObject, { flexDirection: "row" }]}>
                  {HOURS.map(h => (
                    <View key={h} style={{ 
                      width: HOUR_WIDTH, 
                      borderRightWidth: 1, 
                      borderColor: "#ddd"
                    }} />
                  ))}
                </View>
                {/* 가로 격자 (요일별 구분선) */}
                <View style={[StyleSheet.absoluteFillObject, { flexDirection: "column" }]}>
                  {Array.from({ length: 6 }, (_, i) => (
                    <View key={i} style={{ 
                      height: rowHeight,
                      borderBottomWidth: 2, 
                      borderColor: "#ddd"
                    }} />
                  ))}
                </View>
                {/* 오버레이: 일정칩 */}
                <View style={[StyleSheet.absoluteFillObject, { pointerEvents: "box-none" }]}>
                  {(byDay[dayIndex] || []).map(ev => {
                    const left = toMin(ev.start) * PPM;
                    const width = Math.max((toMin(ev.end) - toMin(ev.start)) * PPM, 16);
                    return (
                      <View
                        key={ev.id}
                        style={{
                          position: "absolute",
                          left, top: 8, width, height: rowHeight - 16,
                          borderRadius: 8, paddingHorizontal: 6,
                          backgroundColor: "#eaf2ff", borderWidth: 1, borderColor: "#c7d2fe",
                          justifyContent: "center"
                        }}
                      >
                        <Text numberOfLines={1} style={{ fontWeight: "600" }}>{ev.title}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
