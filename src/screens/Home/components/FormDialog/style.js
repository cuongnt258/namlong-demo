import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  inputContainer: {
    minWidth: '100%',
    marginTop: 16,
  },

  label: {
    fontWeight: 'bold',
  },

  input: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    height: 40,
    paddingHorizontal: 8,
  },
  confirmButton: {
    marginTop: 32,
    maxWidth: '70%',

    borderColor: '#ddd',
    backgroundColor: '#1F8A70',

    borderRadius: 12,

    paddingVertical: 16,
    paddingHorizontal: 32,
  },

  title: {
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
  },

  buttonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default styles;
