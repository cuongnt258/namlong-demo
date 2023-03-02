import React from 'react';
import {Text, View} from 'react-native';

// Import local files
import styles from './style';

const Customer = ({first_name, last_name, email, gender, address}) => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {`${first_name} ${last_name}`}
        </Text>

        <Text numberOfLines={1}>{email} </Text>
        <Text numberOfLines={1}>{address}</Text>
      </View>
      <Text numberOfLines={2} style={styles.gender}>
        {gender}
      </Text>
    </View>
  );
};

export default Customer;
