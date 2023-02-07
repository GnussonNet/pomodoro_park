import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import RootStack from './stacks/RootStack';

function App(): JSX.Element {
  return (
    <SafeAreaView className="bg-white dark:bg-gray-900 h-full">
      <StatusBar animated={true} />
      <RootStack />
    </SafeAreaView>
  );
}

export default App;
