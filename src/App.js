// **Import libs
import React from 'react';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

// **Import local
import HomeScreen from './screens/Home/HomeScreen';

const App = () => {
  return (
    <>
      <HomeScreen />

      <Toast visibilityTime={1500} />
    </>
  );
};

export default App;
