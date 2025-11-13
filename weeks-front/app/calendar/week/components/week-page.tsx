import React, { useMemo, useRef, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, Alert, TextInput } from "react-native";
import { Schedule } from "@/types/schedule";
import WeekTimeBar from "./week-time-bar";
import appDB from "@/db/database";
import { heightStore } from "./store/heightStore";
import { useSnapshot } from "valtio";
import WeekDayBar from "./week-day-bar";
import WeekTimesPart from "./week-time-part";

const HOUR_WIDTH = 60;
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["월", "화", "수", "목", "금", "토", "일"] as const;
const PPM = HOUR_WIDTH / 60;
const HOUR_MS = 1 * 60 * 60 * 1000;

export default function WeekPage({ weekStartDate, schedules = [] }: { weekStartDate: Date; schedules: Schedule[] }) {
    const scrollRef = useRef<ScrollView | null>(null);
    const heightSnap = useSnapshot(heightStore);

    // 일정 추가 상태

    // 동적으로 계산된 행 높이 (페이지 높이의 7등분).. 스토어에 셋팅
    heightStore.weekRowHeight = heightSnap.containerHeight > 0 ? (heightSnap.containerHeight - heightSnap.timeHeaderHeight) / 7 : 72;

    useEffect(() => {
        // 초기 가로 위치(예: 09:00)
        scrollRef.current?.scrollTo({ x: 9 * HOUR_WIDTH, animated: false });
    }, [weekStartDate]);

    // ================================================

    return (
        <View style={{ flexDirection: "row", height: "100%" }} onLayout={e => (heightStore.containerHeight = e.nativeEvent.layout.height)}>
            <WeekDayBar weekStartDate={weekStartDate} />
            <WeekTimesPart scrollRef={scrollRef as React.RefObject<ScrollView>} weekStartDate={weekStartDate} schedules={schedules} />
        </View>
    );
}
