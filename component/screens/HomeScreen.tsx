import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard, 
} from 'react-native';import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { fetchLocation, fetchWeatherForcast } from '../api/weather';
import { debounce } from 'lodash';
import * as Progress from 'react-native-progress';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface HomeScreenProps { }

const HomeScreen = (props: HomeScreenProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState('')
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWeatherForcast({
          cityName: 'Korea',
          days: '7',
        });
        setWeatherData(response);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, []);
  
  const handleLocation = async (loc: any) => {
    setLocations([]);
    setLoading(true)
    
    try {
      // Fetch weather information for the selected location
      const response = await fetchWeatherForcast({
        cityName: loc.name,
        days: '7'
      });

      setWeatherData(response)
    } catch (error) {
      console.error('Error fetching weather data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (value: any) => {
    if (value.length > 2) {
      fetchLocation({ cityName: value })
        .then((data: any) => {
          setLocations(data);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLocations([]);
      setLoading(false);
    }
    Keyboard.dismiss();
  };
  
  const handleTextDebounce = React.useCallback(debounce(handleSearch, 1200), []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={false}
    >
    <View className="flex-1 relative">
      <StatusBar translucent={true} backgroundColor="transparent" barStyle={'light-content'} />
      <Image
        blurRadius={5}
        source={require('../../assets/images/rainy.jpg')}
        className="absolute h-full w-full" />
        {
          loading? (
             <View className="flex flex-1 flex-row justify-center items-center">
              <Progress.CircleSnail thickness={10} size={140} color={'#008b8b'}/>
             </View>
          ): (
      <SafeAreaView className="flex flex-1">
        {/* search section */}
        <View style={{ height: '7%', backgroundColor: showSearch ? 'rgba(255, 255, 255, 0.3)' : 'transparent' }} className="flex-row justify-end items-center rounded-full bg-white my-10 mx-5">
          {
            showSearch ?
              <TextInput
                onChangeText={handleTextDebounce}
                className="flex-1 pl-6 text-base text-gray-300"
                placeholder='Search country'
                placeholderTextColor={'lightgray'}
              /> : null
          }
          <TouchableOpacity
            onPress={() => setShowSearch(!showSearch)}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
            className="rounded-full p-3 mx-1">
            <AntDesign name="search1" size={20} color="white" />
          </TouchableOpacity>
          {/* Searchbar suggestions */}
          {
            locations.length > 0 && showSearch ? (
              <View className="absolute w-full rounded-3xl bg-white top-16">
                {
                  locations.map((loc, index) => {
                    return (
                      <TouchableOpacity
                      onPress={() => handleLocation(loc)}
                        key={index}
                        style={{ borderBottomWidth: index === locations.length - 1 ? 0 : 1 }}
                        className="p-2 flex-1 px-2 flex-row border-b-gray-500 my-2"
                      >
                        <Entypo name="location-pin" size={25} color="gray" />
                        <Text className="text-lg text-black ml-2 ">{loc?.name}, {loc?.country}</Text>
                      </TouchableOpacity>
                    )
                  })
                }
              </View>
            ) : null
          }
        </View>
        <View>
          <Text> </Text>
        </View>
        {/* Forcast section */}
        {
         weatherData? (
          <View className="flex flex-1  justify-between">
          <Text className="text-white  text-3xl text-center">
            {weatherData?.location?.name},
            <Text className="text-lg text-gray-300">{" " + weatherData?.location?.country}</Text>
          </Text>
          <View className="flex-row justify-center">
            <Image
              source={{ uri: 'https:' + weatherData?.current?.condition?.icon }}
              className="w-56 h-56 mt-5" />
          </View>
          {/* degree celcius */}
          <View className="my-10 ">
            <Text className="text-white font-bold text-6xl text-center ml-6">
              {weatherData?.current?.temp_c}&#176;
            </Text>
            <Text className="text-base text-gray-300 text-center">{weatherData?.current?.condition?.text}</Text>
          </View>
        </View>
         ): (
          <Text>Loading...</Text>
        )}
        {/* Other stats */}
        {
          weatherData? (

        <View className="flex-row justify-between mx-4 my-4">
          <View className="flex-row space-x-2 items-center">
            <Feather name="wind" size={20} color="white" />
            <Text className="text-white">{weatherData?.current?.wind_kph}km</Text>
          </View>
          <View className="flex-row space-x-2 items-center">
            <Entypo name="drop" size={20} color="white" />
            <Text className="text-white">{weatherData?.current?.humidity}%</Text>
          </View>
          <View className="flex-row space-x-2 items-center">
            <Feather name="sun" size={20} color="white" />
            <Text className="text-white">6:50 am</Text>
          </View>
        </View>
          ): null
        }
        {/* Forcast next days */}
        <View>
          <View className="flex-row item-center m-3">
            <AntDesign name="calendar" color="white" size={20} />
            <Text className="text-white ml-2 ">Daily forcast</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 15 }}>
              {
                weatherData?.forecast?.forecastday?.map((item: any, index: any) => {
                  const date = new Date(item.date);
                  const options = { weekday: 'long' };
                  const dayName = date.toLocaleDateString('en-US', options).split(',')[0];
                  return(
                    <View
                    key={index}
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                    className="flex flex-1 justify-center items-center rounded-3xl h-28 w-24 py-3 m-2">
                      <Image 
                      source={{uri: 'https:'+item?.day?.condition?.icon}}
                      className="h-14 w-14"/>
                    <Text className="text-white text-base">{dayName}</Text>
                    <Text className="text-white text-lg font-bold">
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                  )
                })
              }
          </ScrollView>
        </View>
      </SafeAreaView>

          )
        }
    </View>
    </KeyboardAwareScrollView>
  );
};

export default HomeScreen;