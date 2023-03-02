import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -10000,
  },

  iOSBackdrop: {
    backgroundColor: '#000000',
    opacity: 0.3,
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

  content: {
    alignItems: 'center',
    backgroundColor: 'white',
    minHeight: 100,
    width: '90%',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 7,
    elevation: 10,
    paddingHorizontal: 16,
    paddingVertical: 32,
  },

  textContainer: {
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
  },

  message: {
    fontSize: 16,
    marginTop: 32,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginHorizontal: 16,
    marginTop: 32,
  },
  button: {
    flex: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 8,
    backgroundColor: 'lightgrey',
  },
  buttonCancel: {
    backgroundColor: '#FD8A8A',
  },
  buttonConfirm: {
    backgroundColor: '#1F8A70',
  },
  confirmButtonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  buttonOK: {
    width: '40%',
    backgroundColor: '#1F8A70',
    borderColor: '#ddd',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 8,
  },
});

export default styles;
