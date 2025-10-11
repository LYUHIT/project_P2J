import { ScrollView, View, Text, StyleSheet } from "react-native";
import { heightStore } from "./store/heightStore";
import { useSnapshot } from "valtio";
import { Schedule } from "@/types/schedule";
import WeekTimeBar from "./week-time-bar";
import ENUM from "@/enum/varEnum";
import { useMemo, useState } from "react";

export default function WeekTimesPart({
  scrollRef,
  schedules,
}: {
  scrollRef: React.RefObject<ScrollView>;
  schedules: Schedule[];
}) {
  const heightSnap = useSnapshot(heightStore);

  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [newSchedulePosition, setNewSchedulePosition] = useState<{dayIndex: number, hour: number} | null>(null);

  // 요일별로 묶기
  const byDay = useMemo(() => {
    // console.log('WeekCalendar - schedules:', schedules);
    const map: Record<number, Schedule[]> = {0:[],1:[],2:[],3:[],4:[],5:[],6:[]};
    schedules.forEach(s => {
      const day = s.StartTime.getDay();
      map[day]?.push(s);
    });
    return map;
  }, [schedules]);

  // ================================================
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
    <ScrollView // 횡 스크롤 (시간)
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        directionalLockEnabled
        contentContainerStyle={{}}
      >
        <View style={{ width: ENUM.HOUR_WIDTH * 24}}>
          {/* 7행(세로 스크롤 없음) */}
          <WeekTimeBar/>
          <View>
            {ENUM.DAYS.map((_, dayIndex) => (
              <View key={dayIndex} style={{ height: heightSnap.weekRowHeight, width: ENUM.HOUR_WIDTH*24, position: "relative" }}>
                {/* 바닥: 시간 격자 (세로선) */}
                <View style={[StyleSheet.absoluteFillObject, { flexDirection: "row" }]}>
                  {ENUM.HOURS.map(h => (
                    <View key={h} style={{ 
                      width: ENUM.HOUR_WIDTH, 
                      borderRightWidth: 1, 
                      borderColor: "#ddd"
                    }} />
                  ))}
                </View>
                {/* 가로 격자 (요일별 구분선) */}
                <View style={[StyleSheet.absoluteFillObject, { flexDirection: "column" }]}>
                  {Array.from({ length: 6 }, (_, i) => (
                    <View key={i} style={{ 
                      height: heightSnap.weekRowHeight,
                      borderBottomWidth: 2, 
                      borderColor: "#ddd"
                    }} />
                  ))}
                </View>
                {/* 오버레이: 일정칩 */}
                <View style={[StyleSheet.absoluteFillObject, { pointerEvents: "box-none" }]}>
                  {(byDay[dayIndex] || []).map(ev => {
                    const startTime = ev.StartTime instanceof Date ? ev.StartTime : new Date(ev.StartTime);
                    const endTime = ev.EndTime instanceof Date ? ev.EndTime : new Date(ev.EndTime);
                    
                    const startHour = startTime.getHours();
                    const startMinute = startTime.getMinutes();
                    const endHour = endTime.getHours();
                    const endMinute = endTime.getMinutes();
                    
                    const left = (startHour * 60 + startMinute) * ENUM.PPM;
                    const width = Math.max(((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) * ENUM.PPM, 16);
                    
                    console.log(`Rendering schedule "${ev.Title}" at day ${dayIndex}, left: ${left}, width: ${width}`);
                    return (
                      <View
                        key={ev.UUID}
                        style={{
                          position: "absolute",
                          left, top: 8, width, height: heightSnap.weekRowHeight - 16,
                          borderRadius: 8, paddingHorizontal: 6,
                          backgroundColor: "#eaf2ff", borderWidth: 1, borderColor: "#c7d2fe",
                          justifyContent: "center"
                        }}
                      >
                        <Text numberOfLines={1} style={{ fontWeight: "600" }}>{ev.Title}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
  );
}