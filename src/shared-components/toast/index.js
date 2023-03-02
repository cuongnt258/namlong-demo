import React, {useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';

const colors = {
  info: 'orange',
  danger: 'red',
  success: 'green',
};

const Toast = () => {
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [timeOut, setTimeOut] = useState(1000);
  const timeOutRef = useRef(null);

  useEffect(() => {
    DeviceEventEmitter.addListener('SHOW_TOAST', onNewToast);
    return () => {
      DeviceEventEmitter.removeAllListeners();
    };
  }, []);

  const closeToast = () => {
    setMessage(null);
    setTimeOut(2000);
    clearInterval(timeOutRef.current);
  };

  useEffect(() => {
    if (message) {
      timeOutRef.current = setInterval(() => {
        if (timeOut === 0) {
          closeToast();
        } else {
          setTimeOut(prev => prev - 100);
        }
      }, 100);
    }

    return () => {
      clearInterval(timeOutRef.current);
    };
  }, [message, timeOut, timeOutRef]);

  const onNewToast = data => {
    if (Platform.OS === 'android' && data.useNativeToast) {
      return ToastAndroid.show(data.message, ToastAndroid.LONG);
    }

    if (data.duration) setTimeOut(data.duration);
    setMessage(data.message);
    setMessageType(data.type);
  };

  return (
    message && (
      <View style={[{backgroundColor: colors[messageType]}, styles.container]}>
        <TouchableOpacity onPress={closeToast}>
          <Text style={styles.text}>{message}</Text>
        </TouchableOpacity>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '4%',
    left: '4%',
    right: '4%',
    zIndex: 1000,
    elevation: 1,
  },
  text: {
    padding: 14,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Toast;
