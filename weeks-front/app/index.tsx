import appDB from '@/db/database';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로그인 상태 확인
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    // TODO: 실제 로그인 상태 확인 로직
    // const loggedIn = await checkUserAuth();
    // setIsLoggedIn(loggedIn);
    
    // 임시로 로그인 상태를 true로 설정 (나중에 실제 로직으로 교체)
    // setIsLoggedIn(true);
    
    // 현재는 바로 로그인된 상태로 가정
    setIsLoggedIn(true);
    setIsLoading(false);
  };

  useEffect(() => {
    const initDB = async () => {
      try {
        await appDB.sp_CreateScheduleTable();
        // 기존 데이터 삭제 후 새 데이터 삽입 (개발 중에만)
        await appDB.sp_SeedDataInsert();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Database initialization failed:', error);
      }
    };
    initDB();
  }, []);

  // 로딩 화면
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#fff'
      }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }
  return <Redirect href="/(tabs)/calendar" />;
//   // 로그인 상태에 따라 다른 화면으로 리디렉션
//   if (isLoggedIn) {
//     // 로그인된 경우: explore 탭으로 이동
//     return <Redirect href="/(tabs)/week-viewer" />;
//   } else {
//     // 로그인되지 않은 경우: 로그인 화면으로 이동 (나중에 구현)
//     // return <Redirect href="/login" />;
    
//     // 임시로 explore로 이동 (로그인 화면이 없으므로)
//     return <Redirect href="/(tabs)/week-viewer" />;
//   }
}
