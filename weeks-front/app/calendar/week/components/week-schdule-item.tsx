import { Schedule } from "@/types/schedule";
import { View, Text } from "react-native";
import { heightStore } from "./store/heightStore";
import { useSnapshot } from "valtio";

const HOUR_WIDTH = 60;
const PPM = HOUR_WIDTH / 60;

export default function WeekScheduleItem ( {
    schedule
}: {
    schedule: Schedule;
}) {
    const heightSnap = useSnapshot(heightStore);
    const startTime = schedule.StartTime instanceof Date ? schedule.StartTime : new Date(schedule.StartTime);
    const endTime = schedule.EndTime instanceof Date ? schedule.EndTime : new Date(schedule.EndTime);
    
    const startHour = startTime.getHours();
    const startMinute = startTime.getMinutes();
    const endHour = endTime.getHours();
    const endMinute = endTime.getMinutes();
    
    const left = (startHour * 60 + startMinute) * PPM;
    const width = Math.max(((endHour * 60 + endMinute) - (startHour * 60 + startMinute)) * PPM, 16);
    
    return (
      <View
        key={schedule.UUID}
        style={{
          position: "absolute",
          left, top: 8, width, height: heightSnap.weekRowHeight - 16,
          borderRadius: 8, paddingHorizontal: 6,
          backgroundColor: "#eaf2ff", borderWidth: 1, borderColor: "#c7d2fe",
          justifyContent: "center"
        }}
      >
        <Text numberOfLines={1} style={{ fontWeight: "600" }}>{schedule.Title}</Text>
      </View>
    );
}