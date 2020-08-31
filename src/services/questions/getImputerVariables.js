import { url } from '../index'
import axios from 'axios';




const api = url

export const getImputerVariables = async (enqueueSnackbar) => {

  try {    
    var pass = false;
    var checkbox = false

    const res = await axios.get(api + 'imputer?mainPath=' + localStorage.getItem('client'))
    if (res.status === 200) {
      const { question, nullValuesCount } = res.data;

      if (question !== false) {
        enqueueSnackbar('Found ' + nullValuesCount + ' Null values', { variant: 'warning' })
        return {question,pass,checkbox};
      } else {
        enqueueSnackbar('No null values Found', { variant: 'info' })        
        pass = true
      }

      return {question,pass,checkbox};
    }

  } catch (err) {
    return err;
  }

}


