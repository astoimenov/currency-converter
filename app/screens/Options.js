import React, { Component } from 'react';
import { Linking, ScrollView, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { ListItem, Separator } from '../components/List';
import { connectAlert } from '../components/Alert';

class Options extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    alertWithType: PropTypes.func,
  };

  handlePressThemes = () => {
    this.props.navigation.navigate('Themes');
  };

  handlePressSite = () => {
    Linking.openURL('https://fixer.io/').catch(() => this.props.alertWithType('error', 'Sorry!', 'An error occured.'));
  };

  render() {
    return (
      <ScrollView>
        <StatusBar translucent={false} barStyle="default" />
        <ListItem
          text="Themes"
          onPress={this.handlePressThemes}
        />
        <Separator />
        <ListItem
          text="Fixer.io"
          onPress={this.handlePressSite}
        />
        <Separator />
      </ScrollView>
    );
  }
}

export default connectAlert(Options);
