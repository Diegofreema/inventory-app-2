/* eslint-disable prettier/prettier */

import { StyleSheet } from 'react-native';
export const colors = {
  green: '#009B50',
  gray: '#8D8D8D',
  black: '#1A1A1A',
  grey: '#565656',
  white: '#FFFFFF',
  lightGray: '#ccc',
};

export const shadow = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
});
