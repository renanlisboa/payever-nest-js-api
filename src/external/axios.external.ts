import axios from 'axios';

export const axiosHttp = axios.create({
  baseURL: 'https://reqres.in/api/',
});
