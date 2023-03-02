// **Import libs
import React, {useEffect, useReducer, useRef} from 'react';
import {Pressable, Text, View} from 'react-native';
import SwipeableFlatList from 'react-native-swipeable-list';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {utils} from 'xlsx';

// **Import local
import {
  getScreenWidth,
  pickAndParse,
  reducer,
  showErrorToast,
  showSuccessToast,
} from '../../utils';
import {ConfirmDialog, Customer, FormDialog} from './components';
import Actions from './components/Actions';
import {ACTION_TYPE, FS, TOAST_STATUS} from './constants';
import styles from './HomeScreen.style';

const HomeScreen = () => {
  const initState = {
    customers: [],
    loadedCustomers: [],
    history: [],
    loading: false,
    page: 1,
  };

  // State, ref
  const flatlistRef = useRef();
  const confirmDialogRef = useRef(null);
  const formDialogRef = useRef(null);
  const loadMoreRef = useRef(false);
  const timerRef = useRef();
  const [state, dispatchState] = useReducer(reducer, initState);

  // Get variables from state
  const {customers, loadedCustomers, page, history} = state;

  // Functions

  const _handleToast = (type, message) => {
    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      type === TOAST_STATUS.SUCCESS
        ? showSuccessToast(message)
        : showErrorToast(message);
    }, 0);
  };

  const _handleImportFile = async () => {
    try {
      dispatchState({loading: true});

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
        customers: newData,
        loadedCustomers: newData.slice(0, 10),
        page: 1,
        loading: false,
      });

      showSuccessToast('IMPORT SUCCESS!');
    } catch (err) {
      dispatchState({loading: false});

      if (err.code === FS.DOCUMENT_PICKER_CANCELED) {
        showErrorToast('IMPORT CANCELLED!');
        return;
      }

      showErrorToast('IMPORT FAILED!');
    }
  };

  const _handleLoadMore = () => {
    if (loadMoreRef.current === true) {
      return;
    }

    const newPage = page + 1;

    let cloneCustomers = [...customers];

    if (history.length !== 0) {
      // remap array
      const newHistory = history.map(element => {
        return element?.item;
      });

      cloneCustomers = cloneCustomers.filter((element, _index) => {
        return element !== newHistory?.[_index];
      });
    }

    let slicedArr = cloneCustomers.slice(10 * (newPage - 1), newPage * 10);

    // issue: remove duplicated item in first load
    slicedArr = slicedArr.filter(
      obj => !loadedCustomers.some(obj2 => obj2.id === obj.id),
    );

    let cloneLoadedCustomer = [...loadedCustomers];
    cloneLoadedCustomer = cloneLoadedCustomer.concat(slicedArr);

    dispatchState({
      page: newPage,
      loadedCustomers: cloneLoadedCustomer,
    });

    loadMoreRef.current = false;
  };

  const _handleUndo = () => {
    if (!history.length) {
      showErrorToast('Nothing to undo!');
      return;
    }

    const undoIndex = history.length - 1;

    confirmDialogRef.current?.showUndo('Undo', undoIndex);
  };

  const _handleDialogConfirm = ({type, index}) => {
    switch (type) {
      case ACTION_TYPE.UNDO:
        const newHistoryArr = [...history];
        const removedHistory = newHistoryArr.pop();

        let cloneLoadedCustomers = [...loadedCustomers];
        cloneLoadedCustomers.splice(
          removedHistory.index,
          0,
          removedHistory.data,
        );

        // dispatch state
        dispatchState({
          loadedCustomers: cloneLoadedCustomers,
          history: newHistoryArr,
        });

        confirmDialogRef.current?.hide();

        _handleToast(TOAST_STATUS.SUCCESS, 'Undo success!');

        break;
      case ACTION_TYPE.ARCHIVE:
        if (index === -1) {
          showErrorToast('Error occured!');

          confirmDialogRef.current.hide();

          break;
        }

        let cloneLoadedData = [...loadedCustomers];
        cloneLoadedData.splice(index, 1);

        dispatchState({
          loadedCustomers: cloneLoadedData,
          history: [...history, {data: loadedCustomers[index], index}],
        });

        confirmDialogRef.current?.hide();

        _handleToast(TOAST_STATUS.SUCCESS, 'Archive success!');

        break;
      default:
        break;
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

    switch (type) {
      case ACTION_TYPE.UPDATE:
        if (index === -1) {
          showErrorToast('Error occured');

          break;
        }

        let updateCustomerIndex = customers.findIndex(element => {
          return element.id === customer.id;
        });

        if (updateCustomerIndex === -1) {
          showErrorToast('Error occured');

          break;
        }

        let cloneCustomers = [...customers];

        if (
          JSON.stringify(customer) === JSON.stringify(cloneCustomers[index])
        ) {
          _handleToast(TOAST_STATUS.ERROR, 'Nothing to update!');

          break;
        }
        cloneCustomers[updateCustomerIndex] = customer;

        let cloneLoadedCustomers = [...loadedCustomers];
        cloneLoadedCustomers[index] = customer;

        dispatchState({
          customers: cloneCustomers,
          loadedCustomers: cloneLoadedCustomers,
        });

        _handleFormDialogClose();
        _handleToast(TOAST_STATUS.SUCCESS, 'Updated');

        break;
      case ACTION_TYPE.ADD:
        const newCustomer = {
          ...customer,
          id: Date.now(),
        };

        dispatchState({
          customers: [newCustomer].concat([...customers]),
          loadedCustomers: [newCustomer].concat([...loadedCustomers]),
        });
        _handleFormDialogClose();
        _handleToast(TOAST_STATUS.SUCCESS, 'Added');

        break;
      default:
        break;
    }
  };

  const _handleAddCustomer = () => {
    formDialogRef.current?.showCreate();
  };

  const extractItemKey = item => {
    return item.id?.toString();
  };

  const _getItemLayout = (_data, index) => ({
    length: getScreenWidth,
    offset: 120 * index,
    index,
  });

  const _renderItem = ({item}) => <Customer item={item} />;

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

  useEffect(() => {
    return () => {
      timerRef.current && clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <>
      <Actions
        handleImportFile={_handleImportFile}
        handleAddCustomer={_handleAddCustomer}
        handleUndo={_handleUndo}
        historyLength={history.length}
        style={styles.actions}
      />

      <SwipeableFlatList
        flatListRef={flatlistRef}
        keyExtractor={extractItemKey}
        data={loadedCustomers}
        renderItem={_renderItem}
        maxSwipeDistance={160}
        renderQuickActions={_quickActions}
        contentContainerStyle={styles.contentContainerStyle}
        bounceFirstRowOnMount={false}
        onEndReached={_handleLoadMore}
        getItemLayout={_getItemLayout}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        onEndReachedThreshold={0.01}
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
