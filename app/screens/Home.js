import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { KeyboardAvoidingView, StatusBar } from 'react-native';

import { Container } from '../components/Container';
import { Logo } from '../components/Logo';
import { InputWithButton } from '../components/TextInput';
import { ClearButton } from '../components/Button';
import { LastConverted } from '../components/Text';
import { Header } from '../components/Header';
import {
  changeCurrencyAmount,
  getInitialConversion,
  swapCurrency,
} from '../actions/currencies';
import { connectAlert } from '../components/Alert';

class Home extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func,
    baseCurrency: PropTypes.string,
    quoteCurrency: PropTypes.string,
    amount: PropTypes.number,
    quotePrice: PropTypes.number,
    conversionRate: PropTypes.number,
    lastConverted: PropTypes.object,
    isFetching: PropTypes.bool,
    primaryColor: PropTypes.string,
    alertWithType: PropTypes.func,
    currencyError: PropTypes.string,
  };

  componentWillMount() {
    this.props.dispatch(getInitialConversion());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currencyError &&
      nextProps.currencyError !== this.props.currencyError) {
      this.props.alertWithType('error', 'Error!', nextProps.currencyError);
    }
  }

  handleChangeText = (amount) => {
    this.props.dispatch(changeCurrencyAmount(amount));
  };

  handlePressBaseCurrency = () => {
    this.props.navigation.navigate('CurrencyList', {
      title: 'Base Currency',
      type: 'base',
    });
  };

  handlePressQuoteCurrency = () => {
    this.props.navigation.navigate('CurrencyList', {
      title: 'Quote Currency',
      type: 'quote',
    });
  };

  handleSwapCurrency = () => {
    this.props.dispatch(swapCurrency());
  };

  handleOptionsPress = () => {
    this.props.navigation.navigate('Options');
  };

  render() {
    const quotePrice = this.props.isFetching
      ? '...'
      : this.props.quotePrice.toFixed(2);

    return (
      <Container backgroundColor={this.props.primaryColor}>
        <StatusBar backgroundColor="blue" barStyle="light-content" />
        <Header onPress={this.handleOptionsPress} />
        <KeyboardAvoidingView behavior="padding">
          <Logo tintColor={this.props.primaryColor} />
          <InputWithButton
            buttonText={this.props.baseCurrency}
            onPress={this.handlePressBaseCurrency}
            defaultValue={this.props.amount.toString()}
            keyboardType="numeric"
            onChangeText={this.handleChangeText}
            textColor={this.props.primaryColor}
          />
          <InputWithButton
            editable={false}
            buttonText={this.props.quoteCurrency}
            onPress={this.handlePressQuoteCurrency}
            value={quotePrice}
            textColor={this.props.primaryColor}
          />
          <LastConverted
            date={this.props.lastConverted}
            base={this.props.baseCurrency}
            quote={this.props.quoteCurrency}
            conversionRate={this.props.conversionRate}
          />
          <ClearButton
            onPress={this.handleSwapCurrency}
            text="Reverse Currencies"
          />
        </KeyboardAvoidingView>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    baseCurrency,
    quoteCurrency,
    amount,
    conversions,
  } = state.currencies;
  const conversionData = conversions[baseCurrency] || {};
  const rates = conversionData.rates || {};
  const conversionRate = rates[quoteCurrency] || 0;
  const quotePrice = amount * conversionRate;
  const lastConverted = conversionData.date
    ? new Date(conversionData.date)
    : new Date();

  return {
    baseCurrency,
    quoteCurrency,
    amount,
    quotePrice,
    conversionRate,
    lastConverted,
    isFetching: conversionData.isFetching || false,
    primaryColor: state.theme.primaryColor,
    currencyError: state.currencies.error,
  };
};

export default connect(mapStateToProps)(connectAlert(Home));
