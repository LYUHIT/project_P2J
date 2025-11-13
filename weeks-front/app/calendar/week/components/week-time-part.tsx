import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Keyboard } from "react-native";
import { heightStore } from "./store/heightStore";
import { useSnapshot } from "valtio";
import { Schedule } from "@/types/schedule";
import WeekTimeBar from "./week-time-bar";
import ENUM from "@/enum/varEnum";
import { useMemo, useState, useRef, useEffect } from "react";
import appDB from "@/db/database";
import WeekDayContainer from "./week-day-container";
import WeekDayDivider from "./week-day-divider";

export default function WeekTimesPart({ scrollRef, weekStartDate, schedules }: { scrollRef: React.RefObject<ScrollView>; weekStartDate: Date; schedules: Schedule[] }) {
    const heightSnap = useSnapshot(heightStore);

    // 요일별로 묶기
    const byDay = useMemo(() => {
        // console.log('WeekCalendar - schedules:', schedules);
        const map: Record<number, Schedule[]> = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
        schedules.forEach(s => {
            const day = s.StartTime.getDay();
            map[day]?.push(s);
        });
        return map;
    }, [schedules]);

    // ================================================

    return (
        <ScrollView // 횡 스크롤 (시간)
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            directionalLockEnabled
            contentContainerStyle={{}}>
            <View style={{ width: ENUM.HOUR_WIDTH * 24 }}>
                <WeekTimeBar />
                <View style={{ position: "relative" }} />
                {ENUM.DAYS.map((d, i) => {
                    const dayDate = new Date(weekStartDate);
                    dayDate.setDate(weekStartDate.getDate() + i);
                    return (
                        <View key={i} style={{ position: "relative" }}>
                            <WeekDayContainer date={dayDate} dayIndex={i} />
                            <WeekDayDivider dayIndex={i} />
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}
