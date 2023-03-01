import React from 'react';
import {Modal, Pressable, View} from 'react-native';

// **Import local
import styles from './style';

const Dialog = props => {
  const {style, visible, onClose, children} = props;

  return (
    <Modal
      {...props}
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.container}>
        <Pressable
          style={[styles.iOSBackdrop, styles.backdrop]}
          onPress={onClose}
        />
        <View style={[styles.content, style]}>{children}</View>
      </View>
    </Modal>
  );
};

export default Dialog;
