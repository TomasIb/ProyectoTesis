import { url } from '../index'
import axios from 'axios';
const api = url

export const getIsBalanced = async (enqueueSnackbar) => {

  try { 
    var pass = null;
    var checkbox = false

    const res = await axios.get(api + 'balance?mainPath=' + localStorage.getItem('client'))       
                    
    if (res.status === 200) {
        var { question } = res.data;

        if (question !== true) { // No está balanceado
          enqueueSnackbar('Unbalanced Classes', { variant: 'warning' })
          return {question,pass,checkbox};       
        }
        else {            
            pass = true
        }  
    }
                
    return {pass,checkbox};
    

  } catch (err) {
    return err;
  }

}



