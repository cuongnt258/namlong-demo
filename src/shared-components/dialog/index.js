import React from 'react';
import {Modal, Pressable, Text, TouchableOpacity, View} from 'react-native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

// **Import local
import styles from './style';

const Dialog = ({style, visible, onClose, onConfirm, children, ...props}) => {
  return (
    <>
      <Modal
        {...props}
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <View style={styles.container}>
          <Pressable
            style={[styles.backdrop, styles.iOSBackdrop]}
            onPress={onClose}
          />

          <View style={[styles.content, style]}>
            {children}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.button, styles.buttonCancel]}>
                <Text style={styles.confirmButtonText}>cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onConfirm}
                style={[styles.button, styles.buttonConfirm]}>
                <Text style={styles.confirmButtonText}>confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Toast />
      </Modal>
    </>
  );
};

export default Dialog;
