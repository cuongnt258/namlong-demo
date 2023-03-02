import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import styles from './style';

const Button = ({onPress, title}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title.toUpperCase()}</Text>
    </TouchableOpacity>
  );
};
export default Button;
