import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iOSBackdrop: {
    backgroundColor: '#000000',
    opacity: 0.3,
  },
  androidBackdrop: {
    backgroundColor: '#232f34',
    opacity: 0.4,
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
});

export default styles;
