import os
from flask import Blueprint,current_app
from flask import jsonify,request,make_response,redirect,send_from_directory,abort
from werkzeug.utils import secure_filename
import json
import numpy as np
import pickle
import base64
import shutil
from app.analysis import Analysis
from .files import updateMainState,deleteMainState,makeFolder

app = Blueprint('main', __name__)

@app.route('/',methods=['GET'])
def home():
      return  make_response(jsonify(welcome = "welcome"),200)      

@app.route('/api/upload',methods=['POST'])
def uploadFile():
      try:
            if 'file' not in request.files:                  
                  return redirect(request.url)
            
            file = request.files['file']
            data = request.form.to_dict()
            isMassData = data['isMassData'].lower() in ['true','True']            
            if isMassData : 
                  massSpectrometryParams = json.loads(data['massSpectrometryParams'])
            else: 
                  massSpectrometryParams = None            
            
            if file:            
                  _clientPath,filepath,secure_string = makeFolder(file)

                  file.save(filepath)            
           
                  main = Analysis(_clientPath,isMassData,massSpectrometryParams)

                  main_name = secure_filename(secure_string+'main')
                  filepathSession = os.path.join(_clientPath,main_name)    
                       
                  pickle.dump(main, open(filepathSession, 'wb'))        
                  mainProcess = pickle.load(open(filepathSession, 'rb'))                   

                  if(isMassData == True):                        
                        if(mainProcess.readDatasetMassSpect(filepath, file.filename)):                            
                              encodedpath = base64.b64encode(filepathSession.encode("utf-8"))               
                              encodedpath = str(encodedpath, "utf-8")
                        
                              updateMainState(mainProcess,filepathSession)
                              return make_response(jsonify(filename = file.filename , mainPath=encodedpath ),200)     
                        else:
                              return make_response(400)   

                  else:                              
                        if(mainProcess.readDataset(filepath,file.filename)):
                        
                              encodedpath = base64.b64encode(filepathSession.encode("utf-8"))               
                              encodedpath = str(encodedpath, "utf-8")                                                                            
                              updateMainState(mainProcess,filepathSession)
                              return make_response(jsonify(filename = file.filename , mainPath=encodedpath ),200)                                    
                        else:
                              return make_response(400)                                    
            else:
                  return make_response(400)
      except:             
            return make_response(400)

      

@app.route('/api/defineTrainTestSplit',methods=['POST'])
def defineTrainTestSplit():
      if(request.method == 'POST'): 
              
                  data = request.form.to_dict()            
                  encodedMainPath = str(data['mainPath'])                      
                  mainPath = base64.b64decode(encodedMainPath)               
                  mainProcess = pickle.load(open(mainPath, 'rb'))   

            
                  option = float(data['option'])
                  

                  mainProcess.setTrainTestSplit(option)
                  updateMainState(mainProcess,mainPath)   
                  return make_response(jsonify(200))
            # except:
            #       return make_response(jsonify(400))



@app.route('/api/downloadmodel',methods=['GET'])
def download():
      encodedMainPath = str(request.args['mainPath'])            
      mainPath = base64.b64decode(encodedMainPath)         
      mainProcess = pickle.load(open(mainPath, 'rb'))     
      path = mainProcess.getClientPath()
      filename =  'best_model.sav'      
      print(path)
      return send_from_directory(directory=path, filename=filename,as_attachment=False)
      # return make_response(jsonify(filepath = filepath),200)


@app.route('/api/imputer',methods=['GET','POST'])
def imputerNullValues():  
      if(request.method == 'GET'):   
            try:   
                  encodedMainPath = str(request.args['mainPath'])            
                  mainPath = base64.b64decode(encodedMainPath)         
                  mainProcess = pickle.load(open(mainPath, 'rb'))

                  nullValuesCount,question = mainProcess.detectMissingValues() 
                  updateMainState(mainProcess,mainPath)   
                  return make_response(jsonify(nullValuesCount=nullValuesCount,question=question),200)                                                
            except:
                  # deleteMainState(mainPath)                      
                  return make_response(jsonify(400))


      if(request.method == 'POST'):
            try:
                  data = request.form.to_dict()            
                  encodedMainPath = str(data['mainPath'])             
                  mainPath = base64.b64decode(encodedMainPath)               
                  mainProcess = pickle.load(open(mainPath, 'rb'))     
                  option = str(data['option'])
                  
                  mainProcess.setMissValuesImputer(option)
                  updateMainState(mainProcess,mainPath)
                  return make_response(jsonify(option = option),200)
            except:
                  os.remove(mainProcess.getClientPath())                       
                  return make_response(jsonify(400))



@app.route('/api/positive-target-class',methods=['GET','POST'])
def positiveTargetClass():
      if(request.method == 'GET'):
            try:
                  encodedMainPath = str(request.args['mainPath'])            
                  mainPath = base64.b64decode(encodedMainPath)         
                  mainProcess = pickle.load(open(mainPath, 'rb')) 
                                                
                  question = mainProcess.checkPositiveCategoricalTarget()                                                                                          
                  updateMainState(mainProcess,mainPath)  
                  return make_response(jsonify(question=question),200)                                                               
            except:
                  os.remove(mainProcess.getClientPath())                        
                  return make_response(jsonify(400))
      
      if(request.method == 'POST'):
            try:
                  data = request.form.to_dict()                 
                  encodedMainPath = str(data['mainPath'])             
                  mainPath = base64.b64decode(encodedMainPath)               
                  mainProcess = pickle.load(open(mainPath, 'rb')) 

                  option = data['option']                        
                  
                  res = mainProcess.setPositiveCategoricalTarget(option)
            
                  updateMainState(mainProcess,mainPath)  
                  return make_response(jsonify(status=200))
            except:
                  os.remove(mainProcess.getClientPath())                      
                  return make_response(jsonify(400))

        

@app.route('/api/encoder',methods=['GET','POST'])
def encoder():
      if(request.method == 'GET'):
            try:
                  encodedMainPath = str(request.args['mainPath'])            
                  mainPath = base64.b64decode(encodedMainPath)         
                  mainProcess = pickle.load(open(mainPath, 'rb')) 

                  question =  mainProcess.getEncoderAlgorithms()
                  updateMainState(mainProcess,mainPath)  
                  return make_response(jsonify(question=question,status=200))
            except:
                  os.remove(mainProcess.getClientPath())                        
                  return make_response(jsonify(400))
           
                  
      if(request.method == 'POST'):
            data = request.form.to_dict()

            data = request.form.to_dict()      
            encodedMainPath = str(data['mainPath'])             
            mainPath = base64.b64decode(encodedMainPath)               
            mainProcess = pickle.load(open(mainPath, 'rb')) 
            option = data['option']
            
            mainProcess.setEncoder(option)
            updateMainState(mainProcess,mainPath)  
            return make_response(jsonify(200))




@app.route('/api/normalize',methods=['GET','POST'])
def normalize():
      if(request.method == 'GET'):

            encodedMainPath = str(request.args['mainPath'])            
            mainPath = base64.b64decode(encodedMainPath)         
            mainProcess = pickle.load(open(mainPath, 'rb')) 

            question =  mainProcess.getNormalize()
            updateMainState(mainProcess,mainPath)  
            return make_response(jsonify(question=question,status=200))
           
                  
      if(request.method == 'POST'):
            data = request.form.to_dict()

            data = request.form.to_dict()      
            encodedMainPath = str(data['mainPath'])             
            mainPath = base64.b64decode(encodedMainPath)               
            mainProcess = pickle.load(open(mainPath, 'rb')) 
            options = data['option']

            mainProcess.setNormalize(options)
            updateMainState(mainProcess,mainPath)  
            return make_response(jsonify(200))

@app.route('/api/transform',methods=['GET','POST'])
def transform():
      if(request.method == 'GET'):

            encodedMainPath = str(request.args['mainPath'])            
            mainPath = base64.b64decode(encodedMainPath)         
            mainProcess = pickle.load(open(mainPath, 'rb')) 

            mainProcess.igniteColumnsTransformer()
            updateMainState(mainProcess,mainPath)  
            return make_response(jsonify(status=200))
           

@app.route('/api/feature-selector',methods=['GET','POST'])     
def featureSelector():  
      if(request.method == 'GET'):      
            encodedMainPath = str(request.args['mainPath'])            
            mainPath = base64.b64decode(encodedMainPath)         
            mainProcess = pickle.load(open(mainPath, 'rb'))

            question =  mainProcess.getFeatureSelectorAlgorithms()  
            updateMainState(mainProcess,mainPath)                             
            return make_response(jsonify(question=question,status=200))            
      
      if(request.method == 'POST'):

            data = request.form.to_dict()            
            encodedMainPath = str(data['mainPath'])             
            mainPath = base64.b64decode(encodedMainPath)               
            mainProcess = pickle.load(open(mainPath, 'rb'))     

            option = str(data['option'])
            param = str(data['parameter'])
            features = mainProcess.setFeatureSelector(option,param)
            updateMainState(mainProcess,mainPath)
            
            return make_response(jsonify(features=features,status=200))   




@app.route('/api/balance',methods=['GET','POST'])
def isBalanced():
      if(request.method == 'GET'):

            encodedMainPath = str(request.args['mainPath'])            
            mainPath = base64.b64decode(encodedMainPath)         
            mainProcess = pickle.load(open(mainPath, 'rb')) 

            question = mainProcess.isBalanced()
            updateMainState(mainProcess,mainPath)  
            return make_response(jsonify(question=question),200)

      if(request.method == 'POST'):

            data = request.form.to_dict()            
            encodedMainPath = str(data['mainPath'])             
            mainPath = base64.b64decode(encodedMainPath)               
            mainProcess = pickle.load(open(mainPath, 'rb'))     

            option = str(data['option'])
           
            balanced = mainProcess.balance(option)
            updateMainState(mainProcess,mainPath)
            
            return make_response(jsonify(balanced=balanced),200)


@app.route('/api/mlAlgorithms',methods=['GET','POST'])
def getMlAlgorithmsSelection():  
      if(request.method == 'GET'):

            encodedMainPath = str(request.args['mainPath'])            
            mainPath = base64.b64decode(encodedMainPath)         
            mainProcess = pickle.load(open(mainPath, 'rb')) 

            question = mainProcess.getAlgorithmsQuestions()            
      
            updateMainState(mainProcess,mainPath)  
            return make_response(jsonify(question=question),200)

      
      if(request.method == 'POST'):

            data = request.form.to_dict()      
            encodedMainPath = str(data['mainPath'])             
            mainPath = base64.b64decode(encodedMainPath)               
            mainProcess = pickle.load(open(mainPath, 'rb')) 
            options = data['option']
            options= options.split(',')            
            
            
            execution_time = mainProcess.mlAlgorithmsChoices(options)    
            
            updateMainState(mainProcess,mainPath)  
            
            
            return make_response(jsonify(execution_time = execution_time),200)

@app.route('/api/metrics',methods=['GET'])
def GetMetrics():  
      if(request.method == 'GET'):
            # try:
                  encodedMainPath = str(request.args['mainPath'])    
                  
                  mainPath = base64.b64decode(encodedMainPath)         
                  mainProcess = pickle.load(open(mainPath, 'rb')) 
                  
                  metrics = mainProcess.getMetrics()
                  datasetType =  mainProcess.getDatasetType()
                  path = mainProcess.getClientPath()

                  updateMainState(mainProcess,mainPath) 

                  
                  response = make_response(jsonify(metrics = metrics,datasetType=datasetType),200)          
                  result = {"client": encodedMainPath ,"metrics":{"data":response.get_json(),"status":response.status_code}}                  
                  with open(path+'/results.json', 'w') as f:
                        json.dump(result, f)
                  os.remove(mainPath)
                  return response
            # except:

            #       return abort(400)

@app.route('/api/reset',methods=['GET'])
def resetPipeline():                                                      
      try:
            encodedMainPath = str(request.args['mainPath'])                      
            mainPath = base64.b64decode(encodedMainPath)         
            mainProcess = pickle.load(open(mainPath, 'rb')) 
            path = mainProcess.getClientPath()
            shutil.rmtree(path)
            return make_response(jsonify(message = 'Pipeline deleted with success!'),200)             
      except OSError as e:
            print("Error: %s : %s" % (dir_path, e.strerror))
            return abort(400)

