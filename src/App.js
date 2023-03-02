// **Import libs
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

// **Import local
import {HomeScreen} from './screens';

const App = () => {
  return (
    <>
      <SafeAreaView style={styles.flex}>
        <View style={styles.container}>
          <HomeScreen />
        </View>
      </SafeAreaView>
      <Toast />
    </>
  );
};
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
  },
});

export default App;
