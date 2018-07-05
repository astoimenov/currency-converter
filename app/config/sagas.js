import { call, put, select, takeEvery } from 'redux-saga/effects';
import {
  CHANGE_BASE_CURRENCY,
  CONVERSION_ERROR,
  CONVERSION_RESULT,
  GET_INITIAL_CONVERSION,
  SWAP_CURRENCY,
} from '../actions/currencies';

const API_URL = 'https://fixer.handlebarlabs.com';
const getLatestRate = currency => fetch(`${API_URL}/latest?base=${currency}`);

function* fetchLatestConversionRates(action) {
  try {
    let { currency } = action;
    if (currency === undefined) {
      currency = yield select(state => state.currencies.baseCurrency);
    }

    const response = yield call(getLatestRate, currency);
    const result = yield response.json();
    if (result.error) {
      yield put({
        type: CONVERSION_ERROR,
        error: result.error,
      });
    } else {
      yield put({
        type: CONVERSION_RESULT,
        result,
      });
    }
  } catch (e) {
    yield put({
      type: CONVERSION_ERROR,
      error: e.message,
    });
  }
}

export default function* rootSaga() {
  yield takeEvery(GET_INITIAL_CONVERSION, fetchLatestConversionRates);
  yield takeEvery(SWAP_CURRENCY, fetchLatestConversionRates);
  yield takeEvery(CHANGE_BASE_CURRENCY, fetchLatestConversionRates);
}
