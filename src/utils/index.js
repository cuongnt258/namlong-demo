import {Dimensions} from 'react-native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const SCREEN_WIDTH = Dimensions.get('window').width;

const showSuccessToast = message => {
  Toast.show({type: 'success', text1: message, position: 'bottom'});
};

const showErrorToast = message => {
  Toast.show({type: 'error', text1: message, position: 'bottom'});
};

export {SCREEN_WIDTH, showSuccessToast, showErrorToast};
