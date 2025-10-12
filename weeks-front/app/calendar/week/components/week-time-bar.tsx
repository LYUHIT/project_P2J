import React from "react";
import { View, Text } from "react-native";
import { heightStore } from "./store/heightStore";
import { useSnapshot } from "valtio";
import ENUM from "@/enum/varEnum";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function WeekTimeBar() {
  const heightSnap = useSnapshot(heightStore);
  return (
    <View style={{ height: heightSnap.timeHeaderHeight, flexDirection: "row", backgroundColor: "#555"}}>
      {HOURS.map(h => (
        <View key={h} style={{ width: ENUM.HOUR_WIDTH, alignItems: "flex-start", justifyContent: "center" }}>
          <Text style={{ fontWeight: "500", color: "white" }}>{`${String(h).padStart(2,"0")}:00`}</Text>
        </View>
      ))}
    </View>
  );    
}