import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/auth';
import axiosInstance from '../../services/api';
import Entypo from '@expo/vector-icons/Entypo';


const getGame = (game_id: string) => {
  return useQuery({
    queryKey: ['games', game_id], queryFn: async () => {
      const response = await axiosInstance.get('/game/' + game_id);
      return response.data.data.game;  // Assuming the response data is in the correct format
    }
  })
};

interface NameCardProps {
  name: string;
}

interface NumberProps {
  topNumber: number;
  bottomNumber: number
}

function NameCard({ name }: NameCardProps) {
  return (
    <View className="rounded-md p-2 ">
      <Text className="text-lg">{name}</Text>
    </View>
  )
}

const NumberBlock = ({ topNumber, bottomNumber }: NumberProps) => {
  const topColor = topNumber > bottomNumber ? 'text-green-500' : 'text-red-500';
  const bottomColor = bottomNumber > topNumber ? 'text-green-500' : 'text-red-500';

  return (
    <View className="rounded-md justify-between h-full ">
      <Text className={`text-lg py-2 px-4  ${topColor}`}>{topNumber}</Text>
      <Text className={`text-lg py-2 px-4  ${bottomColor}`}>{bottomNumber}</Text>
    </View>
  );
};

export default function Game() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const gameId = Array.isArray(id) ? id[0] : id;
  const [showUsernames, setShowUsernames] = useState(false);


  var { data: game, isLoading, error } = getGame(gameId);
  if (isLoading) {
    return <Text>Loading...</Text>;
  }


  const toggleUsernames = () => {
    setShowUsernames((prev) => !prev);
  };


  const handleSubmit = async (confirmation: String) => {
    const data = {
      game_id: gameId,
      user_id: user?.id,
      confirmation: confirmation
    }
    console.log(data)
    try {
      const response = await axiosInstance.post('/game/confirm', data, {
        headers: {
          'Content-Type': 'application/json', // Ensure the request is in JSON format
        }
      });
      if (response.status == 200) {
        // console.log(response.statusText)
        queryClient.invalidateQueries({ queryKey: ['user_profile'] });
        router.navigate("/profile")
      }
      // You can navigate the user or display success feedback here
    } catch (error) {
      console.error('Error creating game:', error);
    }
  }


  return (
    <View className="bg-white rounded-lg shadow p-4 m-2 ">
      <View className="flex-row  justify-between p-2">
        <Text className="text-sm px-2 py-1">Created at {(new Date(game.created_at)).toDateString()}</Text>
        {game.status == 'Pending' ?
          <View className='rounded-lg bg-yellow-300 px-2 py-1 w-auto'><Text className="text-sm ">Pending Validation</Text></View> :
          game.status == 'Yes' ? <View className='rounded-lg bg-green-300 px-2 py-1 w-auto'><Text className="text-sm ">Validated</Text></View> :
            <View className='rounded-lg bg-red-300 px-2 py-1 w-auto'><Text className="text-sm ">Rejected by {game.username_2}</Text></View>}
      </View>

      <GameCard game={game} />

      {user?.id != game.reporter_user.id && game.players.includes(user?.id) && !game.total.includes(user?.id) &&
        <View className='flex-row justify-around mt-6 mb-4'>
          <TouchableOpacity onPress={() => handleSubmit("No")}>
            <View className=' bg-red-300 py-2 px-4 rounded-lg shadow-sm'><Text>Reject</Text></View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSubmit("Yes")}>
            <View className=' bg-green-300 py-2 px-4 rounded-lg shadow-sm'><Text>Accept</Text></View>
          </TouchableOpacity>
        </View>
      }


      <TouchableOpacity
        onPress={toggleUsernames}
        className="flex-row mx-auto px-4 items-center justify-center bg-[#222222] mt-4 py-2 rounded-lg"
      >
        <Entypo
          name={showUsernames ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="#F2F2F2"
        />
        <Text className="ml-2 text-center text-[#F2F2F2] font-medium">
          {showUsernames ? 'Hide Usernames' : 'Show Usernames'}
        </Text>
      </TouchableOpacity>


      {showUsernames && (
        <View className="mt-3 flex flex-row justify-between">
          <View>
            {game.team_1_users.map((player: Player) => (
              <Text key={player.id} id={player.id} className="text-sm text-gray-700">
                @{player.username}
              </Text>
            ))}
          </View>
          <View>
            {game.team_2_users.map((player: Player) => (
              <Text key={player.id} id={player.id} className="text-sm text-gray-700">
                @{player.username}
              </Text>
            ))}
          </View>

        </View>
      )}


    </View>
  );
}


interface Player {
  id: string
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
    players: string[];
    accepted: string[];
    total: string[];
    reporter_username: string;
  };
}

interface ProfileCardProps {
  player: Player;
  isRightSide?: boolean;
}

// function ProfileCard({ player, isRightSide = false }: ProfileCardProps) {
//   const containerClass = isRightSide ? "flex-row-reverse" : "flex-row";
//   const marginClass = isRightSide ? "ml-2" : "mr-2";

//   return (
//     <View className={`${containerClass} items-center mb-4`}>
//       <View className={` w-8 h-8 rounded-full overflow-hidden ${marginClass}`}>
//         <Image
//           source={{ uri: player.profile_picture }}
//           className=" w-full h-full rounded-full border-2 border-[#222222] mr-4"
//         />
//       </View>
//       <Text className="text-base">{player.username}</Text>
//     </View>
//   );
// }

// function Score(score: any) {
//   const topColor = score[0] > score[1] ? 'text-green-500' : 'text-red-500';
//   const bottomColor = score[1] > score[0] ? 'text-green-500' : 'text-red-500';
//   return (
//     <View className="w-14 h-14 rounded-lg items-center justify-center">
//       <Text className={`text-lg  ${topColor}`}>{score[0]}</Text>
//       <Text className={`text-lg  ${bottomColor}`}>{score[1]}</Text>
//     </View>
//   );
// }

// function ScoreGrid({ scores }: { scores: Score[] }) {
//   const gridScores = scores.map(score => [score.score_1, score.score_2]);
//   return (
//     <View className="justify-center">
//       {gridScores.map((row, rowIndex) => (
//         <View key={rowIndex} className='flex-row '>
//           {row.map((score, colIndex) => (
//             <View
//               key={`${rowIndex}-${colIndex}`}
//               className="w-14 h-14 rounded-lg items-center justify-center"
//             >
//               <Text className="text-xl font-medium">{score}</Text>
//             </View>
//           ))}
//         </View>
//       ))}
//     </View>
//   );
// }

function GameCard({ game }: GameResultViewProps) {

  console.log(game)

  const renderUserProfilePictures = (players: Player[], side: string) =>
    players.map((player, index) => (
          <Image
            key={player.id}
            source={{ uri: player.profile_picture }}
            className=' border-2 border-[#222222] rounded-full w-14 h-14 -mx-2 shadow-sm'
            style={{zIndex: index * (side == 'left' ? -1: 1)}}
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
    <View className="">
      <View className="flex-row justify-between items-center">

        <View className="flex-row justify-between items-center">
        <View className="flex-row w-5/12  h-full justify-start px-2 items-center">{renderUserProfilePictures(game.team_1_users.slice(0, 3), 'left')}</View>
          <View className="items-center w-2/12 ">{renderScores()}</View>
          <View className="flex-row w-5/12  h-full justify-end px-2 items-center">{renderUserProfilePictures(game.team_2_users.slice(0, 3), 'right')}</View>
        </View>




      </View>
    </View>
  );
}


// {game.team_1_users.map((player, index) => (
//   <ProfileCard
//     key={`team1-${index}`}
//     player={player}
//   />
// ))}
// </View>

// <View className='w-1/3'>
// <ScoreGrid scores={game.scores} />

// </View>

// <View className="w-1/3">
// {game.team_2_users.map((player, index) => (
//   <ProfileCard
//     key={`team2-${index}`}
//     player={player}
//     isRightSide={true}
//   />
// ))}
