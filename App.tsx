import * as React from 'react';
import { Text, View } from 'react-native';
import HomeScreen from './component/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

interface AppProps {}

const Stack = createNativeStackNavigator();
const App = (props: AppProps) => {
  return (
    <NavigationContainer>
       <Stack.Navigator >
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;