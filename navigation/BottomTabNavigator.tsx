import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '~/constants/Colors';
import useColorScheme from '~/hooks/useColorScheme';
import TabMapScreen from '~/screens/TabMapScreen';
import TabBarsScreen from '~/screens/TabBarsScreen';
import TabBarScreen from '~/screens/TabBarScreen';

import {
  BottomTabParamList,
  TabMapParamList,
  TabBarsParamList,
} from '../types';
import { Icon } from 'react-native-elements';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Map"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Map"
        component={TabMapNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="map-outline" type="ionicon" color={color} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Bars"
        component={TabBarsNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="beer-outline" type="ionicon" color={color} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
}) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabMapStack = createStackNavigator<TabMapParamList>();

function TabMapNavigator() {
  return (
    <TabMapStack.Navigator screenOptions={{ headerShown: false }}>
      <TabMapStack.Screen name="TabMapScreen" component={TabMapScreen} />
      <TabBarsStack.Screen name="Bar" component={TabBarScreen} />
    </TabMapStack.Navigator>
  );
}

const TabBarsStack = createStackNavigator<TabBarsParamList>();

function TabBarsNavigator() {
  return (
    <TabBarsStack.Navigator screenOptions={{ headerShown: false }}>
      <TabBarsStack.Screen name="TabBarsScreen" component={TabBarsScreen} />
      <TabBarsStack.Screen name="Bar" component={TabBarScreen} />
    </TabBarsStack.Navigator>
  );
}
