import PropTypes from 'prop-types';
import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';

import styles from './styles';

const Container = ({ children, backgroundColor }) => {
  const containerStyles = [styles.container];
  if (backgroundColor) {
    containerStyles.push({
      backgroundColor,
    });
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={containerStyles}>
        {children}
      </View>
    </TouchableWithoutFeedback>

  );
};

Container.propTypes = {
  children: PropTypes.any,
};

export default Container;