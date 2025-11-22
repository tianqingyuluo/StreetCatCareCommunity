import axios from 'axios-miniprogram';
// import MpAdapter from "@taro-platform/axios-taro-adapter";

// axios.defaults.adapter = MpAdapter;

export const request = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 10000,
});