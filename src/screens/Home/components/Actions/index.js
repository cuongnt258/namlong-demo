// **Import libs
import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

// **Import locals
import styles from './style';

const Actions = ({handleImportFile, handleUndo, handleAddCustomer, style}) => {
  return (
    <View style={[styles.container, style]}>
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
        style={[styles.button, styles.undoStyle]}
        onPress={handleUndo}>
        <Text style={styles.buttonText}>Undo</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Actions;
