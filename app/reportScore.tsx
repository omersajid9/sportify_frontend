import { Picker } from '@react-native-picker/picker';
import { useQuery } from '@tanstack/react-query';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, TouchableWithoutFeedback, Keyboard, Alert, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from './context/auth';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import TeamPicker from '../components/TeamPicker';
import axiosInstance from '../services/api';
import Loader from '../components/Loader';
import ErrorBanner from '../components/ErrorBanner';

const getUpcomingSessions = (username: string | null) => useQuery({
  queryKey: ['sessions', 'to_report ', username],
  queryFn: async () => {
    const response = await axiosInstance.get('/search/reportable_sessions', { params: { username: username || "" } });
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

export default function ReportScore() {
  const { user } = useAuth();

  const [team1Usernames, setTeam1Usernames] = useState<String[]>([]);
  const [team2Usernames, setTeam2Usernames] = useState<String[]>([]);

  const [session, setSession] = useState<any>(null);
  const [scores, setScores] = useState([{ team1: '', team2: '' }]);

  // ref for action sheets | for ios
  const sessionRef = useRef<ActionSheetRef>(null);

  // ref for pickers | for android
  const sessionPickerRef = useRef<any>(null);

  // get data about session and players for the session
  const { data: sessions, isLoading: sessionsLoading, error: sessionsError, refetch: refetchSession } = getUpcomingSessions(user);
  const { data: usernames, isLoading: usernameLoading, error: usernameError, refetch: refetchUsername } = getUsernames(session?.id);

  useEffect(() => {
    setTeam1Usernames([]);
    setTeam2Usernames([]);
    setScores([{ team1: '', team2: '' }]);
  }, [session])

  if (sessionsLoading || usernameLoading) {
    return <Loader />;
  }

  if (sessionsError || usernameError) {
    return <ErrorBanner message='Error loading data' refetch={() => { refetchSession(); refetchUsername(); }} />;
  }


  if (user && session && !team1Usernames.includes(user)) {
    team1Usernames.push(user);
  }



  // filter out users from team1 and team2
  const otherUsernames = usernames?.filter((u: any) => !team1Usernames.includes(u.username) && !team2Usernames.includes(u.username)).map((u: any) => u.username);

  const toggleTeam1 = (toggleUsername: String) => {
    if (team1Usernames.includes(toggleUsername)) {
      setTeam1Usernames(team1Usernames.filter(name => name !== toggleUsername));
    } else {
      setTeam1Usernames([...team1Usernames, toggleUsername]);
    }
  }
  const toggleTeam2 = (toggleUsername: String) => {
    if (team2Usernames.includes(toggleUsername)) {
      setTeam2Usernames(team2Usernames.filter(name => name !== toggleUsername));
    } else {
      setTeam2Usernames([...team2Usernames, toggleUsername]);
    }
  }

  const handleSubmit = async () => {
    if (!session) {
      Alert.alert("Error", "Please select a session to report.");
      return;
    }
    if (team2Usernames.length === 0) {
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
      team_1_usernames: team1Usernames,
      team_2_usernames: team2Usernames,
      scores: scoresReport
    };

    const gameSubmit = {
      reporter_username: user,
      reports: [reports]
    };

    try {
      const response = await axiosInstance.post('/game/report', gameSubmit, {
        headers: { 'Content-Type': 'application/json' }
      });
      router.navigate("/");
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
      <ScrollView>

        <View className="flex-1 items-center px-6 h-full">
          <View className="my-4 w-full">
            <Text className="text-lg font-bold">Select Session</Text>
          </View>

          <View>
            <TouchableOpacity
              className="border-blue-900 border-2 p-4 rounded-lg justify-center items-center text-center"
              onPress={onSessionPress}
            >
              <Text className="text-center">{session ? session.session_name : "Select Session"}</Text>
            </TouchableOpacity>
          </View>

          {Platform.OS == 'ios' ?
            <ActionSheet ref={sessionRef} containerStyle={{ height: 300, backgroundColor: 'white' }}>
              <Picker
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


          <View className="my-6 w-full">
            <Text className="text-lg font-bold">Game Details</Text>
          </View>

          <View className='flex-row'>
            <TeamPicker remainingPlayers={otherUsernames} selectedPlayers={team1Usernames} toggleMember={toggleTeam1} placeholder={"Select friend"} />
            <TeamPicker remainingPlayers={otherUsernames} selectedPlayers={team2Usernames} toggleMember={toggleTeam2} placeholder={"Select opponent"} />
          </View>

          <Text className="text-lg my-4 font-bold">Score</Text>
          {scores.map((score, index) => (
            <View key={index} className="flex-row justify-evenly items-center w-full mb-4">
              <TextInput
                className="border-2 border-blue-900 rounded-lg p-2 h-16 w-14 text-center text-2xl"
                keyboardType="numeric"
                value={score.team1}
                onChangeText={value => handleScoreChange(index, 'team1', value)}
              />
              <TextInput
                className="border-2 border-blue-900 rounded-lg p-2 h-16 w-14 text-center text-2xl"
                keyboardType="numeric"
                value={score.team2}
                onChangeText={value => handleScoreChange(index, 'team2', value)}
              />
            </View>
          ))}

          <View className="my-6">
            <Button title="Submit" onPress={handleSubmit} />
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}
