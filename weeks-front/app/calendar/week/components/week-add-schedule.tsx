import appDB from "@/db/database";
import { useState } from "react";
import { View, Text } from "react-native";


const HOUR_MS = 1 * 60 * 60 * 1000;

export default function WeekAddSchedule ( {
    weekStartDate,
    dayIndex,
    time,
    setIsAddingSchedule
}: {
    weekStartDate: Date;
    dayIndex: number;
    time: number;
    setIsAddingSchedule: (isAddingSchedule: boolean) => void; // 일정을 추가하는 상태를 종료시켜주는 콜백
}) {
    const [newScheduleText, setNewScheduleText] = useState('');

      // 일정 추가 완료
  const handleScheduleAdd = async () => {
    if (newScheduleText.trim()) { // 제목이 있을 때 추가
      const targetDate = new Date(weekStartDate);
      targetDate.setDate(weekStartDate.getDate() + dayIndex);
      targetDate.setHours(time, 0, 0, 0);
      
      await appDB.sp_CreateSchedule(0, 1, 0, newScheduleText, "", targetDate.getTime(), targetDate.getTime() + HOUR_MS);
    }
    
    setIsAddingSchedule(false);
    setNewScheduleText('');
  };


    return (
        <View>
            <Text>WeekAddSchedule</Text>
        </View>
    )
}