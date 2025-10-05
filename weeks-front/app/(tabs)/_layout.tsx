import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />

    </Tabs>
  );
}

// 0. 대시보드
  // 목표
  // 루틴 완수 현황
  // 오늘 예정된 일정
    // 일정 / 루틴 / 지연됨
  // 기타 등등.. 표기할 사항들.
// 1. 일정
  // 일간 / 주간 / 월간
// 2. 채팅
  // 채팅방 리스트..인데, 톡방 명을 Circle / Friend / 일정 제목 / ... 이러면 톡방이 너무 헷갈리려나?
// 3. 네트워크
  // 친구 목록, 서클 목록
  // 서클 진입 시, 네이버 밴드처럼 게시글 / 앨범 / 채팅 등 
// 4. 설정
  // 프로필 수정, 알림 설정, 계정 삭제, 로그아웃, 로그인
