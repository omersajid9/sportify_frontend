import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import SportIcon from './SportIcon';

interface Player {
  id: string;
  username: string;
  profile_picture: string;
}

interface Score {
  score_1: number;
  score_2: number;
}

interface Sport {
  icon: string;
  icon_source: string;
  name: string;
}

interface GameResultViewProps {
  game: {
    id: string;
    created_at: string;
    status: string;
    team_1_users: Player[];
    team_2_users: Player[];
    scores: Score[];
    sport: Sport
  };
}

const GameResultView: React.FC<GameResultViewProps> = ({ game }) => {
  const router = useRouter();
  const [showUsernames, setShowUsernames] = useState(false);

  const getStatusStyle = () => {
    if (game.status == 'Pending') {
      return 'bg-yellow-100 text-yellow-800';
    }
    switch (game.status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Yes':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const toggleUsernames = () => {
    setShowUsernames((prev) => !prev);
  };

  const renderUserProfilePictures = (players: Player[], side: string) =>
    players.map((player, index) => (
      <Image
        key={player.id}
        source={{ uri: player.profile_picture }}
        className=' border-2 border-[#222222] rounded-full w-14 h-14 -mx-2 shadow-sm'
        style={{ zIndex: index * (side == 'left' ? -1 : 1) }}
        // style={{right: 40 * index}}
        // className={`rounded-full border-2 border-[#222222] absolute m-5 bg-green-300 ${index == (side == 'left' ? 0 : players.length - 1) ? 'w-14 h-14 ' : 'w-14 h-14 '}`}
        accessible
        accessibilityLabel={`Profile picture of ${player.username}`}
      />
    ));

  const renderScores = () => (
    <>
      <Text className="text-2xl font-bold text-black">
        {game.scores.filter((s) => s.score_1 > s.score_2).length} -{' '}
        {game.scores.filter((s) => s.score_1 < s.score_2).length}
      </Text>
      {game.scores.map((score, index) => (
        <Text key={index} className="text-sm text-neutral-500">
          {score.score_1} - {score.score_2}
        </Text>
      ))}
    </>
  );


  return (
    <View className="bg-white rounded-lg shadow-sm p-4 my-2">
      {/* Top Section */}
      <View className="flex-row justify-between items-center mb-4">

        <View className=' flex flex-row items-center'>
          <SportIcon
            sport_icon={game.sport.icon}
            size={16}
            sport_icon_source={game.sport.icon_source}
            color={'rgb(34 34 34)'} />
          <Text className="ml-2 text-base font-bold text-gray-600">{game.sport.name}</Text>

          <Text className="text-sm text-gray-500 ml-2">
            {new Date(game.created_at).toDateString()}
          </Text>
        </View>

        {game.status == 'Pending' ?
          <View className='rounded-lg bg-yellow-100 px-2 py-1 w-auto'><Text className="text-sm ">Pending</Text></View> :
          game.status == 'Yes' ? <View className='rounded-lg bg-green-100 px-2 py-1 w-auto'><Text className="text-sm ">Validated</Text></View> :
            <View className='rounded-lg bg-red-100 px-2 py-1 w-auto'><Text className="text-sm ">Rejected</Text></View>}
      </View>

      {/* <View className="flex-row items-center">
          <SportIcon
            sport_icon={game.sport.icon}
            size={16}
            sport_icon_source={game.sport.icon_source}
            color={'rgb(34 34 34)'} />
          <Text className="ml-2 text-gray-600">{game.sport.name}</Text>
        </View> */}


      {/* Game Details */}
      <TouchableOpacity
        onPress={() => router.push(`/game/${game.id}`)}
        className="rounded-lg"
      >
        <View className="flex-row justify-between items-center ">
          <View className="flex-row w-5/12  h-full justify-start px-2 items-center">{renderUserProfilePictures(game.team_1_users.slice(0, 3), 'left')}</View>
          <View className="items-center w-2/12 ">{renderScores()}</View>
          <View className="flex-row w-5/12  h-full justify-end px-2 items-center">{renderUserProfilePictures(game.team_2_users.slice(0, 3), 'right')}</View>
        </View>
      </TouchableOpacity>

      {/* Show Usernames Button */}
      <TouchableOpacity
        onPress={toggleUsernames}
        className="flex-row mx-auto px-4 items-center justify-center bg-[#F2f2f2] mt-4 py-2 rounded-lg"
      >
        <Entypo
          name={showUsernames ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#222222"
        />
        <Text className="ml-2 text-center text-[#222222] font-medium">
          {showUsernames ? 'Hide Usernames' : 'Show Usernames'}
        </Text>
      </TouchableOpacity>

      {/* Usernames */}
      {showUsernames && (
        <View className="mt-3 flex flex-row justify-between">
          <View>
            {game.team_1_users.map((player) => (
              <Text key={player.id} className="text-sm text-gray-700">
                @{player.username}
              </Text>
            ))}
          </View>
          <View>
            {game.team_2_users.map((player) => (
              <Text key={player.id} className="text-sm text-gray-700">
                @{player.username}
              </Text>
            ))}
          </View>

        </View>
      )}
    </View>
  );
};

export default GameResultView;
