import { View, Text, Pressable, StyleSheet } from "react-native";

const ROW_HEIGHT = 72;
const HOUR_WIDTH = 80;
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const PPM = HOUR_WIDTH / 60; // px per minute

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export default function DayRow({ items }: { items: Array<{id:string; title:string; start:string; end:string}> }) {
  return (
    <View style={{ height: ROW_HEIGHT, width: HOUR_WIDTH*24, position: "relative" }}>
      {/* 바닥: 시간 격자 */}
      <View style={[StyleSheet.absoluteFillObject, { flexDirection: "row" }]}>
        {HOURS.map(h => (
          <View key={h} style={{ width: HOUR_WIDTH, borderRightWidth: 1, borderColor: "#eee" }} />
        ))}
      </View>

      {/* 오버레이: 일정칩 (스크롤과 함께 이동) */}
      <View style={[StyleSheet.absoluteFillObject, { pointerEvents: "box-none", zIndex: 10 }]}>
        {items.map(ev => {
          const left = toMin(ev.start) * PPM;
          const width = Math.max((toMin(ev.end) - toMin(ev.start)) * PPM, 16);
          return (
            <Pressable
              key={ev.id}
              style={{
                position: "absolute",
                left, top: 8, width, height: ROW_HEIGHT - 16,
                borderRadius: 8, backgroundColor: "#eaf2ff",
                borderWidth: 1, borderColor: "#c7d2fe", justifyContent: "center", paddingHorizontal: 6
              }}
              onPress={() => {/* 상세/투두 편집 */}}
            >
              <Text numberOfLines={1} style={{ fontWeight: "600" }}>{ev.title}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export { DayRow };
