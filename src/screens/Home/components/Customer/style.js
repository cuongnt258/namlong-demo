import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray',
    marginHorizontal: 16,
    marginBottom: 20,

    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
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
  gender: {
    minWidth: 50,
    alignSelf: 'center',
    textAlign: 'center',
  },
});

export default styles;
