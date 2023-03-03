// **Import libs
import React, { useEffect, useReducer, useRef } from 'react';
import { FlatList, LayoutAnimation } from 'react-native';
import { utils } from 'xlsx';

// **Import local
import {
  compareObj,
  pickAndParse,
  reducer,
  showErrorToast,
  showSuccessToast,
} from '../../utils';
import { ConfirmDialog, Customer, FormDialog } from './components';
import Actions from './components/Actions';
import { ACTION_TYPE, FS, TOAST_STATUS } from './constants';
import styles from './HomeScreen.style';

const HomeScreen = () => {
  const initState = {
    customers: [],
    history: [],
  };

  // State, ref
  const flatlistRef = useRef();
  const confirmDialogRef = useRef(null);
  const formDialogRef = useRef(null);
  const timerRef = useRef();
  const [state, dispatchState] = useReducer(reducer, initState);

  // Get variables from state
  const { customers, history } = state;

  // Functions
  const _scrollToIndex = index => {
    flatlistRef?.current?.scrollToIndex({
      animated: true,
      index,
    });
  };

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
      /* select and parse file */
      const wb = await pickAndParse();

      /* convert first worksheet to AOA */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = utils.sheet_to_json(ws, { header: 1 });

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
      });

      showSuccessToast('Import success!');
    } catch (err) {
      if (err.code === FS.DOCUMENT_PICKER_CANCELED) {
        showErrorToast('Import cancelled!');
        return;
      }

      showErrorToast('Import failed!');
    }
  };

  const _handleUndo = () => {
    if (!history.length) {
      showErrorToast('Nothing to undo!');

      return;
    }

    const undoElement = history[history.length - 1];

    confirmDialogRef.current?.showUndo(
      'Press confirm to undo archived customer',
      undoElement.index,
    );
  };

  const _handleDialogConfirm = ({ type, index }) => {
    switch (type) {
      case ACTION_TYPE.UNDO:
        const newHistoryArr = [...history];
        const removedHistory = newHistoryArr.pop();

        let cloneCustomers = [...customers];
        cloneCustomers.splice(removedHistory.index, 0, removedHistory.data);

        dispatchState({
          loadedCustomers: cloneCustomers,
          history: newHistoryArr,
        });

        confirmDialogRef.current?.hide();
        _handleToast(TOAST_STATUS.SUCCESS, 'Undo success!');
        _scrollToIndex(removedHistory.index);

        break;
      case ACTION_TYPE.ARCHIVE:
        if (index === -1) {
          showErrorToast('Error occured!');
          confirmDialogRef.current.hide();

          return;
        }

        let cloneCustomers2 = [...customers];
        cloneCustomers2.splice(index, 1);

        dispatchState({
          customers: cloneCustomers2,
          history: [
            ...history,
            {
              data: customers[index],
              index,
            },
          ],
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
      _handleToast(TOAST_STATUS.ERROR, 'Missing field(s)');

      return;
    }

    switch (type) {
      case ACTION_TYPE.UPDATE:
        if (index === -1) {
          showErrorToast('Error occured');

          return;
        }

        let cloneCustomers = [...customers];
        if (compareObj(customer, cloneCustomers[index])) {
          showErrorToast('Nothing to update!');

          return;
        }
        cloneCustomers[index] = customer;

        dispatchState({
          customers: cloneCustomers,
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
        });

        _handleFormDialogClose();
        _handleToast(TOAST_STATUS.SUCCESS, 'Added');
        _scrollToIndex(0);

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
    length: 120,
    offset: 120 * index,
    index,
  });

  const _renderItem = ({ item, index }) => {
    const onUpdate = () => {
      formDialogRef.current?.showUpdate(item, index);
    };

    const onArchive = () => {
      confirmDialogRef.current?.showArchive(
        'Do you want to archive this customer?',
        index,
      );
    };

    return (
      <Customer
        first_name={item.first_name}
        last_name={item.last_name}
        gender={item.gender}
        address={item.address}
        email={item.email}
        onArchive={onArchive}
        onUpdate={onUpdate}
      />
    );
  };

  useEffect(() => {
    return () => {
      timerRef.current && clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    console.log(history);
  }, [history]);

  return (
    <>
      <Actions
        handleImportFile={_handleImportFile}
        handleAddCustomer={_handleAddCustomer}
        handleUndo={_handleUndo}
        historyLength={history.length}
        style={styles.actions}
      />

      <FlatList
        ref={flatlistRef}
        keyExtractor={extractItemKey}
        data={customers}
        renderItem={_renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        getItemLayout={_getItemLayout}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        removeClippedSubViews={true}
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
