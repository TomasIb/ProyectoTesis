import os
import pickle
import uuid
from flask import current_app


def updateMainState(main,filepathSession):      
      pickle.dump(main, open(filepathSession, 'wb'))

def deleteMainState(filepathSession):     
      os.remove(filepathSession)    

def makeFolder(file):
      DIR = current_app.config['CLIENTS_FOLDER']
      analysisNumber = (len([name for name in os.listdir(DIR) if os.path.isdir(os.path.join(DIR, name))]))+1

      secure_string = str(uuid.uuid4())
      dataset_file_name =  'input-dataset-' + str(file.filename) 
      
      _clientPath = str(current_app.config['CLIENTS_FOLDER'])+'/Analysis-'+ str(analysisNumber) +'-' + os.path.splitext(str(file.filename))[0]
      count = 1
      if os.path.exists(_clientPath):
            while os.path.exists(_clientPath):
                  _clientPath += '_'+ str(count)
                  count+=1

      os.makedirs(_clientPath)

      filepath = os.path.join(_clientPath, dataset_file_name)    

      return _clientPath,filepath,secure_string