// **Import libs
import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';

// **Import local
import Dialog from '../../../../shared-components/dialog';
import {ACTION_TYPE} from '../../constants';
import styles from './style';

export const FormDialog = forwardRef(function FormDialog(props, ref) {
  const {onClose, onConfirm} = props;

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

  const dataRef = useRef('');
  const firstNameInputRef = useRef('');
  const lastNameInputRef = useRef('');
  const addressInputRef = useRef('');
  const genderInputRef = useRef('');
  const emailInputRef = useRef('');

  const {type, index, id} = state;

  useImperativeHandle(ref, () => ({
    showUpdate(itemValue, itemIndex) {
      dataRef.current = itemValue;

      setState({
        open: true,
        index: itemIndex,
        type: ACTION_TYPE.UPDATE,
        id: itemValue.id,
      });
    },
    showCreate() {
      setState({...state, open: true, type: ACTION_TYPE.ADD});
    },
    hide() {
      setState({
        ...state,
        open: false,
        id: -1,
        index: -1,
      });

      dataRef.current = {
        first_name: '',
        last_name: '',
        gender: '',
        email: '',
        address: '',
      };
    },
  }));

  const handleOnConfirm = () => {
    onConfirm(
      type,
      {
        id,
        first_name: firstNameValueRef.current,
        last_name: firstNameValueRef.current,
        gender: genderValueRef.current,
        email: emailValueRef.current,
        address: addressValueRef.current,
      },
      index,
    );
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

  const title =
    type === ACTION_TYPE.ADD ? 'Add new customer' : `Update customer ${id}`;

  const _onShow = () => {
    const {address, first_name, last_name, gender, email} =
      dataRef.current || {};

    firstNameInputRef.current?.setNativeProps({
      text: first_name,
    });

    lastNameInputRef.current?.setNativeProps({text: last_name});
    addressInputRef.current?.setNativeProps({text: address});
    genderInputRef.current?.setNativeProps({text: gender});
    emailInputRef.current?.setNativeProps({text: email});

    if (type === ACTION_TYPE.UPDATE) {
      firstNameValueRef.current = first_name;
      lastNameValueRef.current = last_name;
      addressValueRef.current = address;
      genderValueRef.current = gender;
      emailValueRef.current = email;
    }
  };

  return (
    <Dialog visible={state.open} onClose={onClose} onShow={_onShow}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          ref={firstNameInputRef}
          placeholder="Please enter first name"
          style={styles.input}
          onChangeText={_onChangeTextFirstName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          placeholder="Please enter last name"
          ref={lastNameInputRef}
          style={styles.input}
          onChangeText={_onChangeTextLastName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Please enter email"
          ref={addressInputRef}
          style={styles.input}
          keyboardType="email-address"
          onChangeText={_onChangeTextAddress}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Gender</Text>
        <TextInput
          placeholder="Please enter gender"
          ref={genderInputRef}
          style={styles.input}
          onChangeText={_onChangeTextGender}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          placeholder="Please enter address"
          ref={emailInputRef}
          style={styles.input}
          onChangeText={_onChangeTextEmail}
        />
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        activeOpacity={0.6}
        onPress={handleOnConfirm}>
        <Text style={styles.buttonText}>SUBMIT</Text>
      </TouchableOpacity>
    </Dialog>
  );
});

export default FormDialog;
