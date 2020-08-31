import { url } from '../index'
import axios from 'axios';
const api = url

export const getEncoderAlgorithms = async (enqueueSnackbar) => {

  try {     
    var pass = null;
    var checkbox = false

    const res = await axios.get(api + 'encoder?mainPath=' + localStorage.getItem('client'))       
        
    if (res.status === 200) {
        var { question } = res.data;
        if (question !== false) {            
            return {question,pass,checkbox};     
        }
        else {
            pass = true
        }
    }
    
    
    return {question,pass,checkbox};
    

  } catch (err) {
    return err;
  }

}


