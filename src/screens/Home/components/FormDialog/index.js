// **Import libs
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Text, TextInput, View } from 'react-native';

// **Import local
import Dialog from '../../../../shared-components/dialog';
import { ACTION_TYPE } from '../../constants';
import styles from './style';

const FormDialog = ({ onClose, onConfirm }, ref) => {
  const [state, setState] = useState({
    open: false,
    type: ACTION_TYPE.ADD,
    index: -1,
    id: -1,
  });

  const firstNameValueRef = useRef('');
  const lastNameValueRef = useRef('');
  const addressValueRef = useRef('');
  const genderValueRef = useRef('');
  const emailValueRef = useRef('');

  const dataRef = useRef();

  const firstNameInputRef = useRef('');
  const lastNameInputRef = useRef('');
  const addressInputRef = useRef('');
  const genderInputRef = useRef('');
  const emailInputRef = useRef('');

  const { type, index, id } = state;

  const _showUpdate = (itemValue, itemIndex) => {
    dataRef.current = itemValue;

    setState({
      open: true,
      index: itemIndex,
      type: ACTION_TYPE.UPDATE,
      id: itemValue.id,
    });
  };

  const _showCreate = () => {
    setState({
      ...state,
      open: true,
      type: ACTION_TYPE.ADD,
    });
  };

  const _hide = callback => {
    setState({
      ...state,
      open: false,
      id: -1,
      index: -1,
    });

    firstNameValueRef.current = '';
    firstNameValueRef.current = '';
    genderValueRef.current = '';
    emailValueRef.current = '';
    addressValueRef.current = '';

    dataRef.current = null;
  };

  const _handleOnConfirm = () => {
    const customer = {
      id,
      first_name: firstNameValueRef.current,
      last_name: lastNameValueRef.current,
      email: emailValueRef.current,
      gender: genderValueRef.current,
      address: addressValueRef.current,
    };

    onConfirm(type, customer, index);
  };

  const _onChangeTextFirstName = value => {
    firstNameValueRef.current = value;
  };

  const _onChangeTextLastName = value => {
    lastNameValueRef.current = value;
  };

  const _onChangeTextEmail = value => {
    emailValueRef.current = value;
  };

  const _onChangeTextAddress = value => {
    addressValueRef.current = value;
  };

  const _onChangeTextGender = value => {
    genderValueRef.current = value;
  };

  useImperativeHandle(
    ref,
    () => ({
      showUpdate: _showUpdate,
      showCreate: _showCreate,
      hide: _hide,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const title =
    type === ACTION_TYPE.ADD ? 'Add new customer' : `Update customer ${id}`;

  const _onShow = () => {
    switch (type) {
      case ACTION_TYPE.UPDATE:
        const { address, first_name, last_name, gender, email } =
          dataRef.current || {};

        firstNameInputRef.current?.setNativeProps({
          text: first_name,
        });

        lastNameInputRef.current?.setNativeProps({ text: last_name });
        addressInputRef.current?.setNativeProps({ text: address });
        genderInputRef.current?.setNativeProps({ text: gender });
        emailInputRef.current?.setNativeProps({ text: email });

        firstNameValueRef.current = first_name;
        lastNameValueRef.current = last_name;
        addressValueRef.current = address;
        genderValueRef.current = gender;
        emailValueRef.current = email;

        break;

      default:
        break;
    }
  };

  const InputField = forwardRef(
    ({ label, onChangeText, placeholder }, inputRef) => {
      return (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            ref={inputRef}
            placeholder={placeholder}
            style={styles.input}
            onChangeText={onChangeText}
          />
        </View>
      );
    },
  );

  return (
    <>
      <Dialog
        visible={state.open}
        onClose={onClose}
        onConfirm={_handleOnConfirm}
        onShow={_onShow}>
        <Text style={styles.title}>{title}</Text>
        <InputField
          label="First Name"
          ref={firstNameInputRef}
          onChangeText={_onChangeTextFirstName}
          placeholder="Please enter first name"
        />
        <InputField
          label="Last Name"
          ref={lastNameInputRef}
          onChangeText={_onChangeTextLastName}
          placeholder="Please enter last name"
        />
        <InputField
          label="Address"
          ref={addressInputRef}
          onChangeText={_onChangeTextAddress}
          placeholder="Please enter address"
        />
        <InputField
          label="Gender"
          ref={genderInputRef}
          onChangeText={_onChangeTextGender}
          placeholder="Please enter gender"
        />
        <InputField
          label="Email"
          ref={emailInputRef}
          onChangeText={_onChangeTextEmail}
          placeholder="Please enter email"
        />
      </Dialog>
    </>
  );
};

export default forwardRef(FormDialog);
