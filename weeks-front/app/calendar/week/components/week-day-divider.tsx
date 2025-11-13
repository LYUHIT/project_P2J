import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Keyboard } from "react-native";
import ENUM from "@/enum/varEnum";
import { useSnapshot } from "valtio";
import { heightStore } from "./store/heightStore";

export default function WeekDayDivider({ dayIndex }: { dayIndex: number }) {
    const heightSnap = useSnapshot(heightStore);

    return (
        <View
            key={dayIndex}
            style={{
                height: heightSnap.weekRowHeight,
                borderBottomWidth: 2,
                borderColor: "#ddd",
                pointerEvents: "none",
            }}
        />
    );
}
