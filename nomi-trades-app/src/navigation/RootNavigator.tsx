import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CustomTabBar } from './CustomTabBar';
import { AccountsScreen } from '../screens/AccountsScreen';
import { MarketsScreen } from '../screens/MarketsScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { PerformanceScreen } from '../screens/PerformanceScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

export type RootTabParamList = {
  Accounts: undefined;
  Markets: undefined;
  Insights: undefined;
  Performance: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Accounts" component={AccountsScreen} />
      <Tab.Screen name="Markets" component={MarketsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Performance" component={PerformanceScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
