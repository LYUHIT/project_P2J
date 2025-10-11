import React, { useMemo, useRef, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, Alert, TextInput } from "react-native";
import { Schedule } from "@/types/schedule";
import WeekTimeBar from "./components/week-time-bar";
import appDB from "@/db/database";
import { heightStore } from "./components/store/heightStore";
import { useSnapshot } from "valtio";
import WeekDaysPart from "./components/week-days-part";
import WeekTimesPart from "./components/week-times-part";

const HOUR_WIDTH = 60;
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["월","화","수","목","금","토","일"] as const;
const PPM = HOUR_WIDTH / 60;
const HOUR_MS = 1 * 60 * 60 * 1000;

export default function WeekPage({
  weekStartDate,
  schedules = [],
}: {
  weekStartDate: Date;
  schedules: Schedule[];
}) {
  const scrollRef = useRef<ScrollView | null>(null);
  const heightSnap = useSnapshot(heightStore);
  
  // 일정 추가 상태
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [newSchedulePosition, setNewSchedulePosition] = useState<{dayIndex: number, hour: number} | null>(null);
  
  // 동적으로 계산된 행 높이 (페이지 높이의 7등분).. 스토어에 셋팅
  heightStore.weekRowHeight = heightSnap.containerHeight > 0 ? (heightSnap.containerHeight - heightSnap.timeHeaderHeight) / 7 : 72;


  useEffect(() => {
    // 초기 가로 위치(예: 09:00)
    scrollRef.current?.scrollTo({ x: 9 * HOUR_WIDTH, animated: false });
  }, [weekStartDate]);


  // 시간대별 long press 핸들러
  const handleTimeSlotLongPress = (dayIndex: number, hour: number) => {
    setIsAddingSchedule(true);
    setNewSchedulePosition({ dayIndex, hour });
  };

  // 일정 추가 취소
  const handleScheduleCancel = () => {
    setIsAddingSchedule(false);
    setNewSchedulePosition(null);
  };

  // ================================================

  return (
    <View 
      style={{ flexDirection: "row", height: "100%" }}
      onLayout={(e) => heightStore.containerHeight = e.nativeEvent.layout.height}
    >
      <WeekDaysPart weekStartDate={weekStartDate} />
      <WeekTimesPart scrollRef={scrollRef as React.RefObject<ScrollView>} schedules={schedules} />
    </View>
  );
}
