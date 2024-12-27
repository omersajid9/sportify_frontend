import { Picker } from '@react-native-picker/picker';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, TouchableWithoutFeedback, Keyboard, Alert, Platform, ScrollView, Pressable } from 'react-native';
import { router, Stack } from 'expo-router';
import { useAuth } from './context/auth';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import TeamPicker from '../components/TeamPicker';
import axiosInstance from '../services/api';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';
import Entypo from '@expo/vector-icons/Entypo';

const getUpcomingSessions = (user_id: string | undefined) => useQuery({
  queryKey: ['sessions', 'to_report ', user_id],
  queryFn: async () => {
    const response = await axiosInstance.get('/search/reportable_sessions', { params: { user_id: user_id || "" } });
    return response.data.data.sessions;
  }
});

const getUsernames = (id: string | undefined) => useQuery({
  queryKey: ['rsvp', 'usernames', id],
  queryFn: async () => {
    const response = await axiosInstance.get('/session/players', { params: { session_id: id } });
    return response.data.data.players;
  },
  enabled: !!id
});

interface UserDetails {
  id: string;
  username: string;
  profile_picture: string;
}

export default function ReportScore() {
  const { user } = useAuth();

  const [team1Users, setTeam1Users] = useState<UserDetails[]>([]);
  const [team2Users, setTeam2Users] = useState<UserDetails[]>([]);

  const [session, setSession] = useState<any>(null);
  const [scores, setScores] = useState([{ team1: '', team2: '' }]);

  // ref for action sheets | for ios
  const sessionRef = useRef<ActionSheetRef>(null);

  // ref for pickers | for android
  const sessionPickerRef = useRef<any>(null);

  useEffect(() => {
    setTeam1Users([]);
    setTeam2Users([]);
    setScores([{ team1: '', team2: '' }]);
  }, [session])


  // get data about session and players for the session
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError, refetch: refetchSession } = getUpcomingSessions(user?.id);
  const { data: usernames, isLoading: usernameLoading, error: usernameError, refetch: refetchUsername } = getUsernames(session?.id);

  if (sessionsLoading || usernameLoading) {
    return <Loader />;
  }

  if (sessionsError || usernameError) {
    return <ErrorBanner message='Error loading data' refetch={() => { refetchSession(); refetchUsername(); }} />;
  }


  if (user && session && !team1Users.find((u) => u.id === user.id)) {
    team1Users.push({ id: user?.id, username: user?.username, profile_picture: user?.profile_picture })
  }



  // filter out users from team1 and team2
  const otherUsers = usernames?.filter((u: UserDetails) =>
    !team1Users.find(user => user.id === u.id) &&
    !team2Users.find(user => user.id === u.id)
  );

  const toggleTeam1 = (toggleUser: UserDetails) => {
    if (team1Users.find(user => user.id === toggleUser.id)) {
      setTeam1Users(team1Users.filter(user => user.id !== toggleUser.id));
    } else {
      setTeam1Users([...team1Users, toggleUser]);
    }
  };
  const toggleTeam2 = (toggleUser: UserDetails) => {
    if (team2Users.find(user => user.id === toggleUser.id)) {
      setTeam2Users(team2Users.filter(user => user.id !== toggleUser.id));
    } else {
      setTeam2Users([...team2Users, toggleUser]);
    }
  };

  const handleSubmit = async () => {
    if (!session) {
      Alert.alert("Error", "Please select a session to report.");
      return;
    }
    if (team2Users.length === 0) {
      Alert.alert("Error", "Please select an opponent.");
      return;
    }
    if (scores.slice(0, -1).some(score => !score.team1 || !score.team2)) {
      Alert.alert("Error", "Please report scores.");
      return;
    }

    let scoresReport = scores.slice(0, -1).map(score => [parseInt(score.team1), parseInt(score.team2)]);

    const reports = {
      session_id: session.id,
      team_1_user_ids: team1Users.map(user => user.id),
      team_2_user_ids: team2Users.map(user => user.id),
      scores: scoresReport,
    };

    const gameSubmit = {
      reporter_user_id: user?.id,
      reports: [reports],
    };

    try {
      const response = await axiosInstance.post('/game/report', gameSubmit, {
        headers: { 'Content-Type': 'application/json' },
      });
      router.dismissAll()
    } catch (error) {
      console.error('Error creating session:', error);
    }
  };

  const handleScoreChange = (index: number, field: 'team1' | 'team2', value: string) => {
    var newScores = [...scores];
    newScores[index][field] = value;

    // Add new empty score pair if the last score pair is filled
    if (newScores.every(score => score.team1 && score.team2)) {
      newScores.push({ team1: '', team2: '' });
    }

    // Remove any empty score pairs at the end
    const lastFilledIndex = newScores.findIndex(score => score.team1 === '' && score.team2 === '');
    if (lastFilledIndex > -1 && lastFilledIndex < newScores.length - 1) {
      newScores = newScores.filter((_, index) => index != lastFilledIndex);
    }

    setScores(newScores);
  };

  function onSessionPress() {
    if (Platform.OS == 'ios') {
      sessionRef.current?.show();
    } else {
      sessionPickerRef.current?.focus();
    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>

      <View className="flex-1  p-6 h-full bg-[#F2F2F2]">
        <Stack.Screen
          options={{
            headerRight: () => <Pressable className=' px-4 bg-transparent rounded-lg w-min' onPress={handleSubmit}>
              <Text className=' text-[#222222] font-bold w-min' >Report</Text>
            </Pressable>,
            headerStyle: { backgroundColor: '#F2F2F2' },
            headerShadowVisible: false,
            headerTintColor: '#222222',
          }}
        />

        <View className='flex-col gap-4'>

          <View className=' flex-col gap-2'>
            <Text className='text-lg px-2 font-semibold'>Select Session</Text>
            <View className=' flex-row px-2 justify-between shadow-sm'>
              <TouchableOpacity
                className="flex flex-row justify-between items-center bg-[#F2F2F2] border-2 border-[#222222] shadow-sm px-4 py-3 rounded-lg w-full"
                onPress={onSessionPress}
              >
                <Text className="text-center">{session ? session.session_name : "Select Session"}</Text>
                <Entypo name="chevron-down" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {Platform.OS == 'ios' ?
            <ActionSheet ref={sessionRef} containerStyle={{ height: 300, backgroundColor: 'white' }}>
              <Picker
                itemStyle={{ color: "black" }}
                selectedValue={session?.id}
                onValueChange={(sessionId: any) => {
                  const selectedSession = sessions?.find((session: any) => session.id === sessionId);
                  setSession(selectedSession);
                }}
              >
                <Picker.Item label="Select a session" value="" />
                {sessions?.map((session: any, index: number) => (
                  <Picker.Item key={index} label={session.session_name} value={session.id} />
                ))}
              </Picker>
            </ActionSheet>
            :
            <Picker
              ref={sessionPickerRef}
              selectedValue={session?.id}
              onValueChange={(sessionId: any) => {
                const selectedSession = sessions?.find((session: any) => session.id === sessionId);
                setSession(selectedSession);
              }}
              style={{ display: 'none' }} // Optional: Customize the picker style
            >
              <Picker.Item label="Select a session" value="" />
              {sessions?.map((session: any, index: number) => (
                <Picker.Item key={index} label={session.session_name} value={session.id} />
              ))}
            </Picker>}


          <View className=' flex-col gap-2'>
            <Text className='text-lg px-2 font-semibold'>Set Teams</Text>
            <View className='flex-row'>
              <TeamPicker
                remainingPlayers={otherUsers}
                selectedPlayers={team1Users}
                toggleMember={toggleTeam1}
                placeholder={"Select Friend"}
              />
              <TeamPicker
                remainingPlayers={otherUsers}
                selectedPlayers={team2Users}
                toggleMember={toggleTeam2}
                placeholder={"Select Opponent"}
              />
            </View>

          </View>
          {/* </View> */}

          <View className='flex-col gap-3'>
            <Text className='text-lg px-2 font-semibold'>Scoreboard</Text>
            <ScrollView className=' max-h-64' overScrollMode='always'>
              <View className='flex-col gap-4 w-full h-fit'>

                {scores.map((score, index) => (
                  <View key={index} className="flex-row justify-evenly items-center w-full">
                    <TextInput
                      className="bg-[#F2F2F2] rounded-lg p-1 h-16 w-16 border-2 border-[#222222] text-center  shadow-sm"
                      style={{ fontSize: 24}}
                      keyboardType="numeric"
                      value={score.team1}
                      onChangeText={value => handleScoreChange(index, 'team1', value)}
                    />
                    <TextInput
                      className="bg-[#F2F2F2] rounded-lg p-1 h-16 w-16 border-2 border-[#222222] text-center  shadow-sm"
                      style={{ fontSize: 24}}
                      keyboardType="numeric"
                      value={score.team2}
                      onChangeText={value => handleScoreChange(index, 'team2', value)}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>



          {/* <View className=' justify-center items-center p-10'>
            <Pressable className=' p-4 bg-[#222222] rounded-lg w-min' onPress={handleSubmit}>
              <Text className=' text-white font-bold w-min' >Report</Text>
            </Pressable>
          </View> */}
        </View>

      </View>
    </TouchableWithoutFeedback>
  );
}
