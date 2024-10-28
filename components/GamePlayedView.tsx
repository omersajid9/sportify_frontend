// import { router } from 'expo-router';
// import React from 'react';
// import { View, Text, Image } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';

// interface GameResultViewProps {
//   game: any;
// }

// interface UserDetails {
//   username: string;
//   profile_picture: string;
// }

// interface NameCardProps {
//   team: UserDetails[];
// }

// interface NumberProps {
//   topNumber: number;
//   bottomNumber: number
// }

// function NameCard({ team }: NameCardProps) {
//   return (
//     <View className="rounded-md p-2 ">
//       {team.map((user, index) => (
//         <View key={index} className="flex-row items-center">
//           <View className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-gray-200">
//             <Image
//               source={{ uri: user.profile_picture }}
//               className="w-full h-full"
//             />
//           </View>
//           <Text className="text-md">{user.username}</Text>
//         </View>
//       ))}
//     </View>
//   )
// }

// const NumberBlock = ({ topNumber, bottomNumber }: NumberProps) => {
//   const topColor = topNumber > bottomNumber ? 'text-green-500' : 'text-red-500';
//   const bottomColor = bottomNumber > topNumber ? 'text-green-500' : 'text-red-500';

//   return (
//     <View className="rounded-md justify-between h-full ">
//       <Text className={`text-lg py-2 px-4  ${topColor}`}>{topNumber}</Text>
//       <Text className={`text-lg py-2 px-4  ${bottomColor}`}>{bottomNumber}</Text>
//     </View>
//   );
// };

// export default function GameResultView({ game }: GameResultViewProps) {
//   return (
//     <View className="bg-white rounded-lg shadow p-4 my-2">
//       <View className="flex-row  justify-between pt-2 px-2">
//         <Text className="text-sm px-2 py-1">Created at {(new Date(game.created_at)).toDateString()}</Text>
//         {game.status == 'Pending' ?
//           <View className='rounded-lg bg-yellow-300 px-2 py-1 w-auto'><Text className="text-sm ">Pending Validation</Text></View> :
//           game.status == 'Yes' ? <View className='rounded-lg bg-green-300 px-2 py-1 w-auto'><Text className="text-sm ">Validated</Text></View> :
//             <View className='rounded-lg bg-red-300 px-2 py-1 w-auto'><Text className="text-sm ">Rejected</Text></View>}
//       </View>
//       <TouchableOpacity onPress={() => router.push("/game/" + game.id)}>
//         <GameCard game={game} />
//       </TouchableOpacity>
//     </View>
//   );
// }

// function GameCard({ game }: GameResultViewProps) {
//   console.log(game)
//   return (
//     <View className="flex-col justify-between rounded-lg ">
//       <View className=" justify-between rounded-md">
//         <NameCard team={game.team_1_usernames} />
//         <NameCard team={game.team_2_usernames} />
//       </View>

//       <View className="flex-row">
//         {game.scores.map((score: any, index: number) => (
//           <NumberBlock key={index} topNumber={score.score_1} bottomNumber={score.score_2} />
//         ))}
//       </View>
//     </View>

//   )
// }


// // import { router } from 'expo-router';
// // import React from 'react';
// // import { View, Text, Image } from 'react-native';
// // import { TouchableOpacity } from 'react-native-gesture-handler';

// // interface GameResultViewProps {
// //   game: {
// //     id: string;
// //     username_1: string;
// //     username_2: string;
// //     username_3: string;
// //     profile_picture_1: string;
// //     profile_picture_2: string;
// //     profile_picture_3: string;
// //     scores: number[][];
// //   };
// // }

// // interface ProfileCardProps {
// //   username: string;
// //   profilePicture: string;
// // }

// // function ProfileCard({ username, profilePicture }: ProfileCardProps) {
// //   return (
// //     <View className="flex-row items-center mb-4">
// //       <View className="w-12 h-12 rounded-full overflow-hidden mr-2 border border-gray-200">
// //         <Image 
// //           source={{ uri: profilePicture }}
// //           className="w-full h-full"
// //         />
// //       </View>
// //       <Text className="text-base">{username}</Text>
// //     </View>
// //   );
// // }

// // function ScoreGrid({ scores }: { scores: number[][] }) {
// //   return (
// //     <View className="flex-row flex-wrap justify-center w-32">
// //       {scores.map((row, rowIndex) => (
// //         row.map((score, colIndex) => (
// //           <View 
// //             key={`${rowIndex}-${colIndex}`}
// //             className="w-14 h-14 border border-gray-200 rounded-lg m-1 items-center justify-center"
// //           >
// //             <Text className="text-xl font-medium">{score}</Text>
// //           </View>
// //         ))
// //       ))}
// //     </View>
// //   );
// // }

// // function GameCard({ game }: GameResultViewProps) {
// //   return (
// //     <View className="p-4">
// //       <View className="flex-row justify-between items-center">
// //         <View className="w-1/3">
// //           <ProfileCard 
// //             username={game.username_1}
// //             profilePicture={game.profile_picture_1}
// //           />
// //           <ProfileCard 
// //             username={game.username_2}
// //             profilePicture={game.profile_picture_2}
// //           />
// //           <ProfileCard 
// //             username={game.username_3}
// //             profilePicture={game.profile_picture_3}
// //           />
// //         </View>

// //         <ScoreGrid scores={[[3, 2], [1, 2]]} />

// //         <View className="w-1/3 items-end">
// //           <View className="flex-row items-center mb-4">
// //             <Text className="text-base mr-2">{game.username_1}</Text>
// //             <View className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
// //               <Image 
// //                 source={{ uri: game.profile_picture_1 }}
// //                 className="w-full h-full"
// //               />
// //             </View>
// //           </View>
// //         </View>
// //       </View>
// //     </View>
// //   );
// // }

// // export default function GameResultView({ game }: GameResultViewProps) {
// //   return (
// //     <TouchableOpacity 
// //       onPress={() => router.push("/game/" + game.id)}
// //       className="bg-white rounded-lg shadow-md my-2"
// //     >
// //       <GameCard game={game} />
// //     </TouchableOpacity>
// //   );
// // }







import { router } from 'expo-router';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

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
        <View key={rowIndex} className='flex-row '>
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

export default function GameResultView({ game }: GameResultViewProps) {
  return (
    <View className="bg-white rounded-lg shadow p-4 my-2">
      <View className="flex-row  justify-between pt-2 px-2">
        <Text className="text-sm px-2 py-1">Created at {(new Date(game.created_at)).toDateString()}</Text>
        {game.status == 'Pending' ?
          <View className='rounded-lg bg-yellow-300 px-2 py-1 w-auto'><Text className="text-sm ">Pending Validation</Text></View> :
          game.status == 'Yes' ? <View className='rounded-lg bg-green-300 px-2 py-1 w-auto'><Text className="text-sm ">Validated</Text></View> :
            <View className='rounded-lg bg-red-300 px-2 py-1 w-auto'><Text className="text-sm ">Rejected</Text></View>}
      </View>

      <TouchableOpacity
        onPress={() => router.push("/game/" + game.id)}
      >
        <View
          className=" rounded-lg my-2 bg-white p-2"
        >

          <GameCard game={game} />
        </View>
      </TouchableOpacity>
    </View>
  );
}
