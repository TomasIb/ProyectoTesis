import { url } from '../index'
import axios from 'axios';
const api = url

export const transformColumns = async (enqueueSnackbar) => {

  try {      
    var pass = null;

    const res = await axios.get(api + 'transform?mainPath=' + localStorage.getItem('client'))       
        if (res.status === 200) {            
            pass = true            
        }
    return {pass};
    

  } catch (err) {
    return err;
  }

}


