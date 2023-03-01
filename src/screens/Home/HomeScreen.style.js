import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  contentContainerStyle: {
    flexGrow: 1,
    marginTop: 16,
  },

  // Quick actions
  qaContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 16,
    paddingBottom: 20,
  },

  button: {
    width: 80,

    height: '100%',

    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonArchive: {
    backgroundColor: '#FD8A8A',
  },

  buttonUpdate: {
    backgroundColor: '#9EA1D4',
  },

  buttonText: {
    fontWeight: 'bold',
    opacity: 100,
  },
  button1Text: {
    color: 'white',
  },
  button2Text: {
    color: 'white',
  },
  button3Text: {
    color: 'orange',
  },
});

export default styles;
