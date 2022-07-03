// axios
import axios from 'axios';

// request and response interceptor
import { interceptor } from 'services/baseInterceptor';

// config
import config from 'assets/config';

export const ax = axios.create({
  baseURL: config.apiURL
});

export const axPROFILE = axios.create({
  baseURL: ""
});

export const axPROFILEGatsby = axios.create({
  baseURL: config.staticDataURL
});

export const axCityAutoComplete = axios.create({
  baseURL: config.cityAutoCompleteURL
});

interceptor(ax);