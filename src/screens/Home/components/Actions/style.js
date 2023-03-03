import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#B5D5C5',
    marginHorizontal: 8,
  },
  buttonText: {
    color: 'black',

    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonImport: {},
  buttonAdd: {},
  buttonUndo: {},
  buttonDisable: {},
});

export default styles;
