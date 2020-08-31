import { url } from './index'
import axios from 'axios';


const api = url

export const apiService = {

  post: async function (action, object) {
    try {
      const res = await axios.post(api + action, object, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*'
        }
      });
      return res;
    } catch (err) {
      return err;
    }

  },
  get: async function (action) {
    try {
      const res = await axios.get(api + action + '?mainPath=' + localStorage.getItem('client'))
      return res;
    } catch (err) {
      return err;
    }
  }
}


