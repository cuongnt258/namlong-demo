import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    marginHorizontal: 16,
    borderRadius: 16,
    elevation: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  id: {
    transform: [
      {
        rotate: '270deg',
      },
    ],
    minWidth: 30,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    marginHorizontal: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  email: {},
  gender: {},
  actions: {
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  button: {
    padding: 8,
    borderRadius: 4,
    elevation: 10,
    marginVertical: 4,
  },
  buttonArchive: {
    backgroundColor: '#FD8A8A',
  },
  buttonUpdate: {
    backgroundColor: '#9EA1D4',
  },
});

export default styles;
