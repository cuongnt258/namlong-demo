// **Import libs
import React, {useCallback, useReducer, useRef} from 'react';
import {FlatList, Pressable, Text, View} from 'react-native';
import {pickSingle} from 'react-native-document-picker';
import {readFile} from 'react-native-fs';
import SwipeableFlatList from 'react-native-swipeable-list';
import {read, utils} from 'xlsx';

// **Import local
import {SCREEN_WIDTH, showErrorToast, showSuccessToast} from '../../utils';
import {ConfirmDialog, Customer, FormDialog} from './components';
import Actions from './components/Actions';
import {ACTION_TYPE, FS} from './constants';
import styles from './HomeScreen.style';

const HomeScreen = () => {
  // Define variables & functions
  const initState = {
    type: '',
    customers: [],
    loadedCustomers: [],
    history: [],
    loading: false,
    page: 1,
  };

  const reducer = (prevState, newState) => {
    if (typeof newState === 'object') {
      return {...prevState, ...newState};
    }

    if (typeof newState === 'function') {
      return prevState(newState);
    }

    return initState;
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

  // State, ref
  const flatlistRef = useRef();
  const confirmDialogRef = useRef(null);
  const formDialogRef = useRef(null);
  const [state, dispatchState] = useReducer(reducer, initState);

  const {customers, loadedCustomers, page, history} = state;

  // Functions
  const _handleImportFile = useCallback(async () => {
    try {
      dispatchState({type: ACTION_TYPE.LOADING, loading: true});

      /* select and parse file */
      const wb = await pickAndParse();

      /* convert first worksheet to AOA */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = utils.sheet_to_json(ws, {header: 1});

      /* update state */
      // remove first array, reduce into array objects
      const newData = data.slice(1).reduce((array, curr) => {
        const obj = {};

        data[0].forEach((key, i) => (obj[key] = curr[i]));
        array.push(obj);

        return array;
      }, []);

      // dispatch
      dispatchState({
        type: 'IMPORT',
        customers: newData,
        loadedCustomers: newData.slice(0, 10),
        page: 1,
        loading: false,
      });

      showSuccessToast('IMPORT SUCCESS!');
    } catch (err) {
      dispatchState({type: ACTION_TYPE.LOADING, loading: false});

      if (err.code === FS.DOCUMENT_PICKER_CANCELED) {
        showErrorToast('IMPORT CANCELLED!');
        return;
      }

      showErrorToast('IMPORT FAILED!');
    }
  }, []);

  const _handleLoadMore = () => {
    const newPage = page + 1;

    let cloneCustomers = [...customers];

    if (history.length !== 0) {
      // remap array
      let newHistory = history.reduce(element => {
        return element?.item;
      });

      console.log('>new history', newHistory);

      cloneCustomers = cloneCustomers.filter((element, _index) => {
        return element !== newHistory?.[_index];
      });

      console.log('>Clone CUstomers', cloneCustomers);
    }

    let slicedArr = cloneCustomers.slice(10 * (newPage - 1), newPage * 10);

    // issue: remove duplicated item in first load
    slicedArr = slicedArr.filter(
      obj => !loadedCustomers.some(obj2 => obj2.id === obj.id),
    );

    let cloneLoadedCustomer = [...loadedCustomers];
    cloneLoadedCustomer = cloneLoadedCustomer.concat(slicedArr);

    dispatchState({
      type: 'LOAD_MORE',
      page: newPage,
      loadedCustomers: cloneLoadedCustomer,
    });
  };

  const _handleUndo = useCallback(() => {
    if (!history || history.length === 0) {
      showErrorToast('Nothing to undo!');
      return;
    }

    const undoIndex = history.length - 1;

    confirmDialogRef.current?.showUndo('Undo', undoIndex);
  }, [history]);

  const _renderItem = useCallback(({item}) => <Customer item={item} />, []);

  const _getItemLayout = (_data, index) => ({
    length: SCREEN_WIDTH,
    offset: 100 * index,
    index,
  });

  const extractItemKey = item => {
    return item?.id?.toString();
  };

  // Render
  const _quickActions = ({index, item}) => {
    const _onUpdatePress = () => {
      formDialogRef.current?.showUpdate(item, index);
    };

    const _onArchivePress = () => {
      confirmDialogRef.current?.showArchive(
        'Do you want to archive this customer?',
        index,
      );
    };

    return (
      <View style={styles.qaContainer}>
        <Pressable
          style={[styles.button, styles.buttonUpdate]}
          onPress={_onUpdatePress}>
          <Text style={[styles.buttonText, styles.button1Text]}>Update</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.buttonArchive]}
          onPress={_onArchivePress}>
          <Text style={[styles.buttonText, styles.button2Text]}>Archive</Text>
        </Pressable>
      </View>
    );
  };

  const _handleDialogConfirm = ({type, index}) => {
    if (type === ACTION_TYPE.UNDO) {
      const lastestHistoryItem = history[history.length - 1];

      let newLoadedCustomers = [...loadedCustomers];

      newLoadedCustomers.splice(
        lastestHistoryItem.index,
        0,
        lastestHistoryItem.data,
      );

      let newHistoryArr = [...history];
      newHistoryArr.pop();

      // dispatch state
      dispatchState({
        type: ACTION_TYPE.UNDO,
        loadedCustomers: newLoadedCustomers,
        history: newHistoryArr,
      });

      confirmDialogRef.current?.hide();

      showSuccessToast('UNDO SUCCESS!');
    }

    if (type === ACTION_TYPE.ARCHIVE) {
      if (index === -1) {
        showErrorToast('Error occured!');

        confirmDialogRef.current.hide();

        return;
      }

      let cloneArr = [...loadedCustomers];
      cloneArr = cloneArr
        .slice(0, index)
        .concat(cloneArr.slice(index + 1, cloneArr.length - 1));

      dispatchState({
        type: ACTION_TYPE.ARCHIVE,
        loadedCustomers: cloneArr,
        history: [...history, {data: loadedCustomers[index], index}],
      });

      confirmDialogRef.current?.hide();

      showSuccessToast('ARCHIVE SUCCESS!');
    }
  };

  const _handleDialogClose = () => {
    confirmDialogRef.current?.hide();
  };

  const _handleFormDialogClose = () => {
    formDialogRef.current?.hide();
  };

  const _handleFormDialogConfirm = (type, customer, index) => {
    if (
      !customer.first_name ||
      !customer.last_name ||
      !customer.address ||
      !customer.gender ||
      !customer.email
    ) {
      showErrorToast('Missing field(s)');
      return;
    }

    if (type === ACTION_TYPE.UPDATE) {
      // Handle update
      if (index === -1) {
        showErrorToast('Error occured');
        return;
      }

      // Update customerslist
      let updateCustomerIndex = customers.findIndex(element => {
        return element.id === customer.id;
      });

      if (updateCustomerIndex === -1) {
        showErrorToast('Error occured');
        return;
      }

      let cloneCustomers = [...customers];
      cloneCustomers[updateCustomerIndex] = customer;

      // Update loaded customers list
      let cloneLoadedCustomers = [...loadedCustomers];
      cloneLoadedCustomers[index] = customer;

      dispatchState({
        type: ACTION_TYPE.UPDATE,
        customers: cloneCustomers,
        loadedCustomers: cloneLoadedCustomers,
      });

      _handleFormDialogClose();

      showSuccessToast('Updated');
      return;
    }

    if (type === ACTION_TYPE.ADD) {
      // handle create
      let newCustomerId = -1;

      if (customers.length === 0) {
        newCustomerId = 1;
      } else {
        newCustomerId = customers.length + history.length + 1;
        // newCustomerId =
        //   Math.max(...customers.map(({id}) => id)) + history.length + 1;
      }

      const newCustomer = {...customer, id: newCustomerId};

      let newCustomers = [...customers];
      newCustomers = [newCustomer, ...newCustomers];

      let newLoadedCustomers = [...loadedCustomers];
      newLoadedCustomers = [newCustomer, ...newLoadedCustomers];

      dispatchState({
        type: ACTION_TYPE.UPDATE,
        customers: newCustomers,
        loadedCustomers: newLoadedCustomers,
      });

      _handleFormDialogClose();

      showSuccessToast('Updated');
      return;
    }
  };

  const _handleAddCustomer = () => {
    formDialogRef.current?.showCreate();
  };

  return (
    <>
      <Actions
        handleImportFile={_handleImportFile}
        handleAddCustomer={_handleAddCustomer}
        handleUndo={_handleUndo}
        historyLength={history.length}
      />

      <SwipeableFlatList
        _flatListRef={flatlistRef}
        keyExtractor={extractItemKey}
        data={loadedCustomers}
        renderItem={_renderItem}
        maxSwipeDistance={160}
        renderQuickActions={_quickActions}
        contentContainerStyle={styles.contentContainerStyle}
        bounceFirstRowOnMount={false}
        onEndReached={_handleLoadMore}
        getItemLayout={_getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        onEndReachedThreshold={0.1}
      />

      <ConfirmDialog
        ref={confirmDialogRef}
        onConfirm={_handleDialogConfirm}
        onClose={_handleDialogClose}
      />

      <FormDialog
        ref={formDialogRef}
        onConfirm={_handleFormDialogConfirm}
        onClose={_handleFormDialogClose}
      />
    </>
  );
};

export default HomeScreen;
