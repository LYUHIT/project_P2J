import React from "react";
import { View, Text } from "react-native";

const HOUR_WIDTH = 60;
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function WeekTimeBar() {
  return (
    <View style={{ height: 30, flexDirection: "row" }}>
      {HOURS.map(h => (
        <View key={h} style={{ width: HOUR_WIDTH, alignItems: "flex-start" }}>
          <Text style={{ fontWeight: "500" }}>{`${String(h).padStart(2,"0")}:00`}</Text>
        </View>
      ))}
    </View>
  );    
}