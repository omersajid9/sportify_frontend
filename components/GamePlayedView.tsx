import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';

interface Player {
  id: string;
  username: string;
  profile_picture: string;
}

interface Score {
  score_1: number;
  score_2: number;
}

interface GameResultViewProps {
  game: {
    id: string;
    created_at: string;
    status: string;
    team_1_users: Player[];
    team_2_users: Player[];
    scores: Score[];
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
      <View
      key={player.id}
      className={`rounded-full  absolute  bg-white`}
      style={{right: 40 * index}}
      >
          <Image
            key={player.id}
            source={{ uri: player.profile_picture }}
            className='flex-1 border-2 border-[#222222] rounded-full w-14 h-14 m-1'
            // style={{right: 40 * index}}
            // className={`rounded-full border-2 border-[#222222] absolute m-5 bg-green-300 ${index == (side == 'left' ? 0 : players.length - 1) ? 'w-14 h-14 ' : 'w-14 h-14 '}`}
            accessible
            accessibilityLabel={`Profile picture of ${player.username}`}
          />
      </View>
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
        <Text className="text-sm text-gray-500">
          {new Date(game.created_at).toDateString()}
        </Text>
        <View className={`rounded-lg px-3 py-1 ${getStatusStyle()}`}>
          <Text className="text-sm font-medium capitalize">
            {game.status === 'Yes' ? 'Validated' : game.status}
          </Text>
        </View>
      </View>

      {/* Game Details */}
      <TouchableOpacity
        onPress={() => router.push(`/game/${game.id}`)}
        className="rounded-lg"
      >
        <View className="flex-row justify-between items-center border-2">
          <View className="flex-row flex-wrap w-1/3  border-2 h-full">{renderUserProfilePictures(game.team_1_users.slice(0, 4), 'left')}</View>
          <View className="items-center w-1/3 py-10">{renderScores()}</View>
          <View className="flex-row flex-wrap w-1/3  border-2 h-full">{renderUserProfilePictures(game.team_2_users.slice(0, 4), 'right')}</View>
        </View>
      </TouchableOpacity>

      {/* Show Usernames Button */}
      <TouchableOpacity
        onPress={toggleUsernames}
        className="flex-row items-center justify-center bg-neutral-200 mt-4 py-2 rounded-lg"
      >
        <Entypo
          name={showUsernames ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="black"
        />
        <Text className="ml-2 text-center text-black font-medium">
          {showUsernames ? 'Hide Usernames' : 'Show Usernames'}
        </Text>
      </TouchableOpacity>

      {/* Usernames */}
      {showUsernames && (
        <View className="mt-3 flex flex-row justify-between">
          <View>
            {game.team_1_users.map((player) => (
              <Text key={player.id} className="text-sm text-gray-700">
                {player.username}
              </Text>
            ))}
          </View>
          <View>
            {game.team_2_users.map((player) => (
              <Text key={player.id} className="text-sm text-gray-700">
                {player.username}
              </Text>
            ))}
          </View>

        </View>
      )}
    </View>
  );
};

export default GameResultView;
