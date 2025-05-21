import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4CAF50' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600'
      }}
      text2Style={{
        fontSize: 14
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#FF5252' }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: '600'
      }}
      text2Style={{
        fontSize: 14
      }}
    />
  )
};

export const showToast = (type: 'success' | 'error', title: string, message?: string) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: 'bottom',
    visibilityTime: 3000,
    autoHide: true,
  });
};