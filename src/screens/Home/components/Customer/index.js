import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

// Import local files
import styles from './style';

const Customer = ({
  first_name,
  last_name,
  email,
  gender,
  address,
  onUpdate,
  onArchive,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {`${first_name} ${last_name}`}
        </Text>

        <Text numberOfLines={1}>{email} </Text>
        <Text numberOfLines={1}>{address}</Text>

        <Text numberOfLines={2}>{gender}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.button, styles.buttonUpdate]}
          onPress={onUpdate}>
          <Text>Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonArchive]}
          onPress={onArchive}>
          <Text>Archive</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Customer;
