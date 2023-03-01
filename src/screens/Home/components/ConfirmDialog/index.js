// **Import libs
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

// **Import local
import styles from './style';
import {Dialog} from '../../../../shared-components';

export const ConfirmDialog = forwardRef(function ConfirmDialog(props, ref) {
  const {onClose, onConfirm} = props;

  const [state, setState] = useState({
    open: false,
    message: '',
    type: '',
    index: -1,
  });

  useImperativeHandle(ref, () => ({
    show(message) {
      setState({open: true, message});
    },
    showArchive(message, index) {
      setState({open: true, message, index, type: 'ARCHIVE'});
    },
    showUndo(message, index) {
      setState({open: true, message, index, type: 'UNDO'});
    },
    hide() {
      setState({open: false});
    },
  }));

  const handleOnConfirm = () => {
    onConfirm({type: state.type, index: state.index});
  };

  return (
    <Dialog visible={state.open} onClose={onClose}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Are you confirm?</Text>
        <Text style={styles.message}>{state.message}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onClose}
          style={[styles.confirmButton, styles.buttonCancel]}>
          <Text style={styles.confirmButtonText}>ok</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleOnConfirm}
          style={[styles.confirmButton, styles.buttonConfirm]}>
          <Text style={styles.confirmButtonText}>confirm</Text>
        </TouchableOpacity>
      </View>
    </Dialog>
  );
});

export default ConfirmDialog;
