import { url } from '../index'
import axios from 'axios';
const api = url

export const getScalerAlgorithms = async (enqueueSnackbar) => {

  try {    
    var pass = null;

    const res = await axios.get(api + 'normalize?mainPath=' + localStorage.getItem('client'))

    if (res.status === 200) {
      var { question } = res.data;
      if (question !== false) {        
        
        return { question, pass  };
      }
      else {                
        pass = true
      }
    }    
    return { question, pass };


  } catch (err) {
    return err;
  }

}


