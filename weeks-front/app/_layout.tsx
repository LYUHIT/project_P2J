import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import appDB from "@/db/database";

export const unstable_settings = {
    anchor: "(tabs)",
};

export default function RootLayout() {
    const colorScheme = useColorScheme();

    // 앱 시작 시 데이터베이스 초기화
    useEffect(() => {
        const initDatabase = async () => {
            try {
                await appDB.initializeDatabase();
                console.log("✅ 데이터베이스 초기화 성공");
            } catch (error) {
                console.error("❌ 데이터베이스 초기화 실패:", error);
            }
        };

        initDatabase();
    }, []);

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
