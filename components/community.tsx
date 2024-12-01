import React, { useState } from 'react';
import { FlashList } from '@shopify/flash-list';
import { View, Text, StyleSheet, RefreshControl } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { FontAwesome } from '@expo/vector-icons';
import { SearchBarBaseProps } from 'react-native-elements/dist/searchbar/SearchBar';
import PlayerSearchView from './PlayerSearchView';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '../app/context/auth';
import axiosInstance from '../services/api';

const SafeSearchBar = (SearchBar as unknown) as React.FC<SearchBarBaseProps>;

const fetchPlayers = (query: string) => {
  return useQuery({queryKey: ['players', query], queryFn: async () => {
    const searchQuery = query || '*';
    const response = await axiosInstance.get('/search/players', { params: { query: searchQuery } });
    return response.data.data.players;
  },
  enabled: true})
};


export default function CommunityPage() {
  const {user} = useAuth();

  const [query, setQuery] = useState('');

  const { data: filteredPlayers, isLoading, refetch } = fetchPlayers(query);

  const updateSearch = (text: string) => {
    setQuery(text);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
  };

  return (
    <View className="flex-1 p-4 h-full">
      <SafeSearchBar
        platform="ios"
        placeholder="Search users"
        value={query}
        onChangeText={updateSearch}
        searchIcon={<FontAwesome name="search" size={18} color="rgb(34 34 34)" />}
        clearIcon={false}
        inputContainerStyle={styles.inputContainer}
        containerStyle={styles.searchBarContainer}
        rightIconContainerStyle={styles.rightIcon}
      />
      <FlashList
        className='h-full'
        data={filteredPlayers}
        renderItem={({ item }) => {
          if (item.username !== user) {
            return <PlayerSearchView item={item} />;
          }
          return null;
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
        estimatedItemSize={50}
        keyExtractor={(item: any) => item.id.toString()}
        ListEmptyComponent={
          isLoading ? (
            <Text className="text-center mt-4 text-gray-500">Loading...</Text>
          ) : (
            <Text className="text-center mt-4 text-gray-500">No players found</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
  },
  inputContainer: {
    backgroundColor: '#EAEAEA',
    borderRadius: 20,
    height: 40,
    paddingHorizontal: 5,
    borderColor: 'rgb(34 34 34)',
    borderWidth: 2,
    borderBottomWidth: 2
  },
  rightIcon: {
    justifyContent: 'center',
  },
});