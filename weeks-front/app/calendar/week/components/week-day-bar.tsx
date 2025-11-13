import { View, Text } from "react-native";
import { useSnapshot } from "valtio";
import { heightStore } from "./store/heightStore";
import ENUM from "@/enum/varEnum";

const WeekDayBar = ({ weekStartDate }: { weekStartDate: Date }) => {
    const heightSnap = useSnapshot(heightStore);
    return (
        <View style={{ width: ENUM.HOUR_WIDTH }}>
            <View style={{ height: heightSnap.timeHeaderHeight, backgroundColor: "#dfdfdf" }} />
            {ENUM.DAYS.map((d, i) => {
                const dayDate = new Date(weekStartDate);
                dayDate.setDate(weekStartDate.getDate() + i);
                return (
                    <View key={i} style={{ height: heightSnap.weekRowHeight, justifyContent: "center", alignItems: "center", backgroundColor: "#dfdfdf" }}>
                        <Text style={{ fontWeight: "700" }}>{d}</Text>
                        <Text style={{ color: "#64748b" }}>{`${dayDate.getMonth() + 1}/${dayDate.getDate()}`}</Text>
                    </View>
                );
            })}
        </View>
    );
};

export default WeekDayBar;
