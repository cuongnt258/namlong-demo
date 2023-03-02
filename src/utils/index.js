import {Dimensions} from 'react-native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {pickSingle} from 'react-native-document-picker';
import {readFile} from 'react-native-fs';
import {read} from 'xlsx';

const getScreenWidth = Dimensions.get('window').width;

const showSuccessToast = message => {
  Toast.show({type: 'success', text1: message, position: 'bottom'});
};

const showErrorToast = message => {
  Toast.show({type: 'error', text1: message, position: 'bottom'});
};

const reducer = (prevState, newState) => {
  if (typeof newState === 'object') {
    return {...prevState, ...newState};
  }

  if (typeof newState === 'function') {
    return prevState(newState);
  }

  return {};
};

const pickAndParse = async () => {
  /* react-native-fs needs a copy */
  const f = await pickSingle({
    allowMultiSelection: false,
    copyTo: 'cachesDirectory',
    mode: 'open',
  });

  const bstr = await readFile(f.fileCopyUri, 'ascii');
  return read(bstr, {type: 'binary'});
};

export {
  getScreenWidth,
  showSuccessToast,
  showErrorToast,
  reducer,
  pickAndParse,
};
