// **Import libs
import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

// **Import local
import styles from './style';
import {Dialog} from '../../../../shared-components';

const ConfirmDialog = ({onClose, onConfirm}, ref) => {
  const [state, setState] = useState({
    open: false,
    message: '',
    type: '',
    index: -1,
  });

  const _show = message => {
    setState({open: true, message});
  };

  const _showArchive = (message, index) => {
    setState({open: true, message, index, type: 'ARCHIVE'});
  };

  const _showUndo = (message, index) => {
    setState({open: true, message, index, type: 'UNDO'});
  };

  const _hide = () => {
    setState({open: false});
  };

  const _handleOnConfirm = () => {
    onConfirm({type: state.type, index: state.index});
  };

  useImperativeHandle(
    ref,
    () => ({
      show: _show,
      showArchive: _showArchive,
      showUndo: _showUndo,
      hide: _hide,
    }),
    [],
  );

  return (
    <Dialog visible={state.open} onClose={onClose} onConfirm={_handleOnConfirm}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Are you confirm?</Text>
        <Text style={styles.message}>{state.message}</Text>
      </View>
    </Dialog>
  );
};

export default forwardRef(ConfirmDialog);
