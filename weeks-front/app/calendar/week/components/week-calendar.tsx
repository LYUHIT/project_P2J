import React, { useMemo, useRef, useState } from "react";
import { View, StyleSheet, Text, FlatList, ScrollView, Pressable, LayoutChangeEvent } from "react-native";
import { DayRow } from "./schedule-item";

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];
const ROW_HEIGHT = 72;              // 요일 한 행 높이
const HOUR_WIDTH = 80;              // 한 시간 폭(px)
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const PPM = HOUR_WIDTH / 60;        // px per minute

type Todo = { id: string; text: string; done?: boolean };
type Schedule = {
  id: string;
  dayIndex: number; // 0~6
  start: string;    // "HH:MM"
  end: string;      // "HH:MM"
  title: string;
  todos?: Todo[];
};

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default function WeekCalendar({
  weekStartDate,       // Date (월요일 기준)
  schedules = [],           // Schedule[]
  onPressSchedule,     // (s: Schedule) => void
}: {
  weekStartDate: Date;
  schedules: Schedule[];
  onPressSchedule?: (s: Schedule) => void;
}) {
  const leftRef = useRef<FlatList<string>>(null);
  const rightRef = useRef<FlatList<number>>(null);
  const [syncing, setSyncing] = useState<"left" | "right" | null>(null);

  // 날짜 라벨
  const dayLabels = useMemo(() => {
    const base = new Date(weekStartDate);
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const label = `${DAYS[i]} ${d.getMonth() + 1}/${d.getDate()}`;
      arr.push(label);
    }
    return arr;
  }, [weekStartDate]);

  // 요일별 스케줄 묶기
  const byDay = useMemo(() => {
    const map: Record<number, Schedule[]> = { 0:[{id:"1", dayIndex:0, start:"00:15", end:"02:15", title:"test"}],1:[],2:[],3:[],4:[],5:[],6:[] };
    schedules.forEach(s => map[s.dayIndex].push(s));
    return map;
  }, [schedules]);

  const onRightScroll = (e: any) => {
    if (syncing === "left") return; // 피드백 루프 방지
    setSyncing("right");
    const y = e.nativeEvent.contentOffset.y;
    leftRef.current?.scrollToOffset({ offset: y, animated: false });
    setSyncing(null);
  };

  const onLeftScroll = (e: any) => {
    if (syncing === "right") return;
    setSyncing("left");
    const y = e.nativeEvent.contentOffset.y;
    rightRef.current?.scrollToOffset({ offset: y, animated: false });
    setSyncing(null);
  };

  // 상단 시간 눈금(선택)
  const TimeHeader = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled={false}>
      <View style={{ width: HOUR_WIDTH * 24, flexDirection: "row" }}>
        {HOURS.map(h => (
          <View key={h} style={{ width: HOUR_WIDTH, alignItems: "flex-start" }}>
            <Text style={{ fontWeight: "600" }}>{`${h.toString().padStart(2, "0")}:00`}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

//   // 우측의 한 행(요일)의 시간 그리드 + 스케줄 블록
//   const DayRow = ({ dayIndex }: { dayIndex: number }) => {
//     const items = byDay[dayIndex] || [];
//     return (
//       <View style={{ height: ROW_HEIGHT, width: HOUR_WIDTH * 24, justifyContent: "center" }}>
//         {/* 시간 보조선 */}
//         <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, flexDirection: "row" }}>
//           {HOURS.map(h => (
//             <View
//               key={h}
//               style={{
//                 width: HOUR_WIDTH,
//                 borderRightWidth: 1,
//                 borderColor: "#eee",
//                 height: "100%",
//               }}
//             />
//           ))}
//         </View>

//         {/* 스케줄 블록(겹침 단순 처리: zIndex 순서) */}
//         {items.map(s => {
//           const start = toMinutes(s.start);
//           const end = toMinutes(s.end);
//           const x = start * PPM;
//           const w = Math.max((end - start) * PPM, 16);
//           return (
//             <Pressable
//               key={s.id}
//               onPress={() => onPressSchedule?.(s)}
//               style={{
//                 position: "absolute",
//                 left: x,
//                 height: ROW_HEIGHT - 16,
//                 top: 8,
//                 width: w,
//                 borderRadius: 8,
//                 borderWidth: 1,
//                 borderColor: "#cbd5e1",
//                 justifyContent: "center",
//                 paddingHorizontal: 6,
//                 backgroundColor: "#f1f5f9",
//               }}
//             >
//               <Text numberOfLines={1} style={{ fontSize: 12, fontWeight: "600" }}>
//                 {s.title}
//               </Text>
//               {/* 나중에 Todo 컴포넌트를 이 안에 배치하면 됩니다 */}
//             </Pressable>
//           );
//         })}
//       </View>
//     );
//   };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* 상단 시간 헤더 (선택) */}


      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* 왼쪽 고정 요일 열 */}
        <FlatList
          ref={leftRef}
          data={dayLabels}
          keyExtractor={(v, idx) => `${idx}`}
          style={{ width: 96, borderRightWidth: 1, borderColor: "#eee" }}
          showsVerticalScrollIndicator={false}
          onScroll={onLeftScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View style={{ height: ROW_HEIGHT, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontWeight: "700" }}>{item.split(" ")[0]}</Text>
              <Text style={{ color: "#64748b" }}>{item.split(" ")[1]}</Text>
            </View>
          )}
          getItemLayout={(_, index) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index })}
        />

        {/* 우측: 가로(시간) + 세로(요일) 스크롤 그리드 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
          <View style={{ height: 32, flexDirection: "row" }}>
            <TimeHeader />
          </View>
          <FlatList
            ref={rightRef}
            data={[0,1,2,3,4,5,6]}
            keyExtractor={(v) => `${v}`}
            showsVerticalScrollIndicator={true}
            onScroll={onRightScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <DayRow items={byDay[item] || []} />
            )}
              getItemLayout={(_, index) => ({ length: ROW_HEIGHT, offset: ROW_HEIGHT * index, index })}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  featureList: {
    gap: 8,
  },
});