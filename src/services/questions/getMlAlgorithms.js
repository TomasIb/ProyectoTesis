import { url } from '../index'
import axios from 'axios';

const api = url

export const getMlAlgorithms = async (enqueueSnackbar) => {

  try {     
    var pass = null;
    var checkbox = false; 

    const res = await axios.get(api + 'mlAlgorithms?mainPath=' + localStorage.getItem('client'))       
    if (res.status === 200) {  
        var { question } = res.data;   
        checkbox = true;                                                         
    }        
    return {question,pass,checkbox};
    

  } catch (err) {
    return err;
  }

}



