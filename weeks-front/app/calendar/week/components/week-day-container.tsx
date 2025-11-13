import { ScrollView, View, Text, StyleSheet, Pressable, TextInput, Keyboard } from "react-native";
import ENUM from "@/enum/varEnum";
import { useEffect, useRef, useState } from "react";
import { useSnapshot } from "valtio";
import { heightStore } from "./store/heightStore";

export default function WeekDayContainer({ date, dayIndex }: { date: Date; dayIndex: number }) {
    const heightSnap = useSnapshot(heightStore);

    const [newSchedulePosition, setNewSchedulePosition] = useState<{ dayIndex: number; hour: number; minute: number } | null>(null);
    // useState로 schedule 타입을 만들어 두고 수정하는게 나을듯
    const [newScheduleTitle, setNewScheduleTitle] = useState("");
    const textInputRef = useRef<TextInput>(null);

    // 새 일정이 생성되면 자동으로 포커스
    useEffect(() => {
        if (newSchedulePosition) {
            // 약간의 지연 후 포커스 (렌더링 완료 후)
            setTimeout(() => {
                textInputRef.current?.focus();
            }, 100);
        }
    }, [newSchedulePosition]);
    // 시간대별 long press 핸들러
    const handleTimeSlotLongPress = (dayIndex: number, hour: number, minute: number) => {
        setNewSchedulePosition({ dayIndex, hour, minute });
    };

    // 일정 추가 취소
    const handleScheduleCancel = () => {
        setNewSchedulePosition(null);
        setNewScheduleTitle("");
        Keyboard.dismiss();
    };

    // 일정 저장
    const handleScheduleSave = async () => {
        if (!newSchedulePosition) return;
        if (newScheduleTitle.trim()) {
            console.log("일정 저장:", newScheduleTitle);
            // TODO: 실제 일정 저장 로직 구현
            // const targetDate = new Date();
            // targetDate.setDate(weekStartDate.getDate() + newSchedulePosition.dayIndex); // 화면에 보이는 주의 날짜를 알아야 함.
            // targetDate.setHours(newSchedulePosition.hour, 0, 0, 0);
            // const startTs = new Date(newSchedulePosition.hour + newSchedulePosition.minute).getTime();
            // const endTs = new Date(newSchedulePosition.hour + 2 + newSchedulePosition.minute).getTime(); //임시로 끝나는 시간은 2시간 처리
            // await appDB.sp_CreateSchedule(0, 1, 0, newScheduleTitle, "", startTs, endTs);

            // 이렇게 하는 것 보다는,, 어차피 하루하루 한줄 생성할 때마다 날짜 할당할 때, 각자 들고 있는게 나을 거 같은데 오류도 적고.
            // 일정 추가하는함수를 전체 화면으로 쓰지 않고, 각자 요일 한 줄 마다 함수를 부를 수 있도록 하는게 나을 거 같음.
            // 일정추가 함수를 만들고, 매개변수로 날짜와 터치 포인트 x축 시간을 받아서 실행하도록.
        }
        handleScheduleCancel();
    };

    return (
        <View style={[StyleSheet.absoluteFillObject, { flexDirection: "row" }]}>
            {/* 격자선 (터치 이벤트 무시) */}
            {ENUM.HOURS.map(h => (
                <View
                    key={h}
                    style={{
                        width: ENUM.HOUR_WIDTH,
                        borderRightWidth: 1,
                        borderColor: "#ddd",
                        pointerEvents: "none",
                    }}
                />
            ))}

            {/* 롱프레스 터치 영역 (가장 위에 배치) */}
            <Pressable
                style={[StyleSheet.absoluteFillObject, { zIndex: 1 }]}
                onTouchStart={e => {
                    const { locationX } = e.nativeEvent;
                    console.log(`터치 시작: x=${locationX}`);

                    // 일정 추가 중이면 취소 처리
                    if (newSchedulePosition) {
                        handleScheduleCancel();
                        return;
                    }
                }}
                onLongPress={e => {
                    const { locationX } = e.nativeEvent;

                    // 시간 계산 (dayIndex는 이미 props로 받고 있음)
                    const hour = Math.floor(locationX / ENUM.HOUR_WIDTH);
                    const minute = Math.floor((locationX % ENUM.HOUR_WIDTH) / 10) * 10; // 10분 단위로 계산

                    console.log(`롱터치 위치: x=${locationX}`);
                    console.log(`계산된 위치: ${hour}시, ${minute}분, ${ENUM.DAYS[dayIndex]}요일`);

                    handleTimeSlotLongPress(dayIndex, hour, minute);
                }}
            />

            {/* 일정 추가 동작을 담은 컴포넌트 추가*/}
            {newSchedulePosition && newSchedulePosition.dayIndex === dayIndex && (
                <View
                    style={{
                        position: "absolute",
                        top: 8,
                        height: heightSnap.weekRowHeight - 16,
                        left: newSchedulePosition.hour * ENUM.HOUR_WIDTH + newSchedulePosition.minute * ENUM.PPM,
                        width: ENUM.HOUR_WIDTH,
                        backgroundColor: "#ccc",
                        borderRadius: 8,
                        paddingHorizontal: 4,
                        paddingVertical: 2,
                        zIndex: 2,
                    }}>
                    <TextInput
                        ref={textInputRef}
                        value={newScheduleTitle}
                        onChangeText={setNewScheduleTitle}
                        placeholder="일정 제목"
                        placeholderTextColor="#666"
                        style={{
                            color: "black",
                            fontWeight: "300",
                            fontSize: 12,
                            flex: 1,
                            textAlign: "center",
                        }}
                        onSubmitEditing={handleScheduleSave}
                        onBlur={handleScheduleCancel}
                        autoFocus={true}
                        selectTextOnFocus={true}
                    />
                </View>
            )}

            {/* 오버레이: 일정 아이템들 */}
            {/* <View
                style={{
                    height: heightSnap.containerHeight,
                    width: ENUM.HOUR_WIDTH * 24,
                    position: "relative",
                }}>
                {ENUM.DAYS.map((_, dayIndex) => (
                    <View key={dayIndex} style={[StyleSheet.absoluteFillObject, { pointerEvents: "box-none" }]}>
                        {(byDay[dayIndex] || []).map(ev => {
                            const startTime = ev.StartTime instanceof Date ? ev.StartTime : new Date(ev.StartTime);
                            const endTime = ev.EndTime instanceof Date ? ev.EndTime : new Date(ev.EndTime);

                            const startHour = startTime.getHours();
                            const startMinute = startTime.getMinutes();
                            const endHour = endTime.getHours();
                            const endMinute = endTime.getMinutes();

                            const left = (startHour * 60 + startMinute) * ENUM.PPM;
                            const width = Math.max((endHour * 60 + endMinute - (startHour * 60 + startMinute)) * ENUM.PPM, ENUM.MINIMUM_TODO_WIDTH);

                            console.log(`Rendering schedule "${ev.Title}" at day ${dayIndex}, left: ${left}, width: ${width}`);
                            return (
                                <View
                                    key={ev.UUID}
                                    style={{
                                        position: "absolute",
                                        left,
                                        top: 8,
                                        width,
                                        height: heightSnap.weekRowHeight - 16,
                                        borderRadius: 8,
                                        paddingHorizontal: 6,
                                        backgroundColor: "#eaf2ff",
                                        borderWidth: 1,
                                        borderColor: "#c7d2fe",
                                        justifyContent: "center",
                                    }}>
                                    <Text numberOfLines={1} style={{ fontWeight: "600" }}>
                                        {ev.Title}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View> */}
        </View>
    );
}
