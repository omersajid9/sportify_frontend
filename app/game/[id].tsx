import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../context/auth';
import { BASE_URL } from '../../app.config';


const getGame = (game_id: string) => {
    return useQuery({
        queryKey: ['games', game_id], queryFn: async () => {
            const response = await axios.get(BASE_URL + '/game/' + game_id);
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
    var { data: game, isLoading, error } = getGame(gameId);
    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    const handleSubmit = async (confirmation: String) => {
        const data = {
            game_id: gameId,
            username: user,
            confirmation: confirmation
        }
        try {
            const response = await axios.post(BASE_URL + '/game/confirm', data, {
                headers: {
                    'Content-Type': 'application/json', // Ensure the request is in JSON format
                }
            });
            queryClient.invalidateQueries({ queryKey: ['user_profile'] });
            router.navigate("/profile")
            // You can navigate the user or display success feedback here
        } catch (error) {
            console.error('Error creating game:', error);
        }
    }

    return (
        <View className="bg-white rounded-lg shadow p-4 my-2">
            <View className="flex-row  justify-between pt-2 px-2">
                <Text className="text-sm px-2 py-1">Created at {(new Date(game.created_at)).toDateString()}</Text>
                {game.status == 'Pending' ?
                 <View className='rounded-lg bg-yellow-300 px-2 py-1 w-auto'><Text className="text-sm ">Pending Validation</Text></View> : 
                 game.status == 'Yes' ? <View className='rounded-lg bg-green-300 px-2 py-1 w-auto'><Text className="text-sm ">Validated</Text></View> : 
                 <View className='rounded-lg bg-red-300 px-2 py-1 w-auto'><Text className="text-sm ">Rejected by {game.username_2}</Text></View>}
            </View>

            <GameCard game={game} />

            {user != game.reporter_username && game.players.includes(user) && !game.total.includes(user) &&
            <View className='flex-row justify-around my-2'>
                <TouchableOpacity onPress={() => handleSubmit("No")}>
                    {/* <View className=' bg-red-300 py-2 px-4 rounded-lg'><Text>Reject</Text></View> */}
                    <View className=' bg-red-300 py-2 px-4 rounded-lg'><Text>Reject</Text></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSubmit("Yes")}>
                    <View className=' bg-green-300 py-2 px-4 rounded-lg'><Text>Accept</Text></View>
                </TouchableOpacity>
            </View>
            }
        </View>
    );
}

// function GameCard({ game }: any) {
//     return (
//         <View className="flex-row justify-between rounded-lg h-24">
//             <View className="h-full justify-between rounded-md">
//                 <NameCard name={game.username_1} />
//                 <NameCard name={game.username_2} />
//             </View>

//             <View className="flex-row">
//                 {game.scores.map((score: any, index: number) => (
//                     <NumberBlock key={index} topNumber={score.score_1} bottomNumber={score.score_2} />
//                 ))}
//             </View>
//         </View>

//     )
// }



interface Player {
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
      team_1_usernames: Player[];
      team_2_usernames: Player[];
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
  
  function ProfileCard({ player, isRightSide = false }: ProfileCardProps) {
    const containerClass = isRightSide ? "flex-row-reverse" : "flex-row";
    const marginClass = isRightSide ? "ml-2" : "mr-2";
  
    return (
      <View className={`${containerClass} items-center mb-4`}>
        <View className={` w-8 h-8 rounded-full overflow-hidden ${marginClass}`}>
          <Image
            source={{ uri: player.profile_picture }}
            className=" w-full h-full rounded-full border-2 border-blue-900 mr-4"
          />
        </View>
        <Text className="text-base">{player.username}</Text>
      </View>
    );
  }
  
  function Score(score: any) {
    const topColor = score[0] > score[1] ? 'text-green-500' : 'text-red-500';
    const bottomColor = score[1] > score[0] ? 'text-green-500' : 'text-red-500';
    return (
      <View className="w-14 h-14 rounded-lg items-center justify-center">
        <Text className={`text-lg  ${topColor}`}>{score[0]}</Text>
        <Text className={`text-lg  ${bottomColor}`}>{score[1]}</Text>
      </View>
    );
  }
  
  function ScoreGrid({ scores }: { scores: Score[] }) {
    const gridScores = scores.map(score => [score.score_1, score.score_2]);
    return (
      <View className="justify-center">
        {gridScores.map((row, rowIndex) => (
          <View key={rowIndex}  className='flex-row '>
            {row.map((score, colIndex) => (
              <View
                key={`${rowIndex}-${colIndex}`}
                className="w-14 h-14 rounded-lg items-center justify-center"
              >
                <Text className="text-xl font-medium">{score}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  }
  
  function GameCard({ game }: GameResultViewProps) {
    return (
      <View className="">
        <View className="flex-row justify-between items-center">
          <View className="w-1/3">
            {game.team_1_usernames.map((player, index) => (
              <ProfileCard
                key={`team1-${index}`}
                player={player}
              />
            ))}
          </View>
  
          <View className='w-1/3'>
            <ScoreGrid scores={game.scores} />
  
          </View>
  
          <View className="w-1/3">
            {game.team_2_usernames.map((player, index) => (
              <ProfileCard
                key={`team2-${index}`}
                player={player}
                isRightSide={true}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }
  