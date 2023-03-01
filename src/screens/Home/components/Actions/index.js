// **Import libs
import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';

// **Import locals
import styles from './style';

const Actions = props => {
  const {handleImportFile, handleUndo, handleAddCustomer, historyLength} =
    props;

  const undoButtonStyle = () => {
    if (historyLength === 0) return styles.buttonDisable;

    return;
  };
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={[styles.button, styles.buttonImport]}
        onPress={handleImportFile}>
        <Text style={styles.buttonText}>Import</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonAdd]}
        onPress={handleAddCustomer}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.undoStyle, undoButtonStyle]}
        onPress={handleUndo}
        disabled={historyLength === 0}>
        <Text style={styles.buttonText}>Undo</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Actions;