import warnings
warnings.filterwarnings("ignore", "(?s).*MATPLOTLIBDATA.*", category=UserWarning)
warnings.filterwarnings("ignore")

import os
import pandas as pd
import numpy as np
import csv as lector
import matplotlib.pyplot as plt
from .binning import Binning
from .alignment import Alignment
from .events import socketio


class MassEspectrometry():
    def __init__(self,params):    
        self.masas = []
        self.masasPromedio = []
        self.dataReduce = params['dataReduce']        
        self.dataReduceParams = params['values']
        self.massType = params['ionTechnique']
        self.cortemin = 3000 
        self.cortemax = 15000                 
        self.clientPath=''    
        self.filePath=''
        self.error = None
  
    def main(self,filePath,clientPath):             
        # try:
            file = pd.ExcelFile(filePath)
            self.filePath = filePath 
            self.clientPath = clientPath        
                    
            denoisedOutput = self.noiseReduction(file)        
            if(self.dataReduce['name'] =='Binning'):
                reducer = Binning()
                matrix,headers = reducer.run(denoisedOutput,file.sheet_names,self.cortemin,self.cortemax,self.dataReduceParams)
            elif(self.dataReduce['name'] =='Alignment'):            
                reducer = Alignment()
                matrix,headers = reducer.run(denoisedOutput,file.sheet_names,self.dataReduceParams,self.massType)
                pass
            # self.makeChart(matrix,headers)
            self.generateOutputDataset(matrix,file.sheet_names,headers)
            return True
        # except:
        #     return False
    
    def MinMaxMassCut(self,paso2):        
        x,y,z= [],[],[]
        for i in range( len(paso2) ):
            # if(paso2['z'][i] < self.error):
            #     print(paso2['z'][i])
            # if((self.cortemax > paso2['x'][i] and paso2['x'][i] > self.cortemin ) and paso2['z'][i] > self.error):  #DUDA SELF:ERROR
            if((self.cortemax > paso2['mass'][i] and paso2['mass'][i] > self.cortemin )):  #DUDA SELF:ERROR
                x.append(paso2['mass'][i])
                y.append(paso2['intensity'][i])
                z.append(paso2['normIntensity'][i])        
        return pd.DataFrame({'mass' : x,'intensity':y,'normIntensity':z})
        
    def noiseReduction(self,file):        
        normCutOutputs = []                
        for index,sheetName in enumerate(file.sheet_names):             
            socketio.sleep(1)      
            socketio.emit('message',{'message': 'Reading,normalizing and dimensionality reduction of sample '+str(index+1)}) 
            socketio.sleep(1)       
            # Read Sheet
            sheet = pd.read_excel(self.filePath,sheet_name=sheetName,skiprows=2)
            sheet.to_csv(self.clientPath+'/hoja'+str(sheetName)+'.csv',index=False)                        
            massIntensityData = pd.concat([sheet['masa'].reset_index(drop=True), sheet['Intens.']], axis=1)                        
            
            normalizedIntensities = self.normalizeIntensities(massIntensityData)                        
            
            cuttedMasses = self.MinMaxMassCut(normalizedIntensities)
            cuttedMasses.to_csv(self.clientPath+"/OK-"+str(sheetName)+".csv",index=False)                    

            normCutOutputs.append(cuttedMasses)                                                       
        return normCutOutputs
    
    def normalizeIntensities(self,sheet):
        #APLICAR OTRO METODO DE NORMALIZACIÓN   
        sheet = np.round(sheet,decimals=3)
        maxIntensity = sheet['Intens.'].max()     
        masses = []
        intensities = []
        normIntensities = []
        for i in range(len(sheet['Intens.'])):            
            masses.append(sheet['masa'][i])
            intensities.append(sheet['Intens.'][i])
            newValue = (sheet['Intens.'][i]*100)/maxIntensity
            normIntensities.append(np.round(newValue,decimals=3))            
        return pd.DataFrame({'mass' : masses,'intensity':intensities,'normIntensity':normIntensities})
        
    def generateOutputDataset(self,matrix,sheets,headers):
        socketio.emit('message',{'message': 'Generating output dataset, adding Classes'})  
        socketio.sleep(1)    
        #GENERATE CSV AND ADD CLASSES
        ids,classes = self.getClasses(sheets)
        parsedDataset = pd.DataFrame(matrix, index=ids, columns=headers)       
        parsedDataset['class'] = classes            
        loopingFakeData = parsedDataset
        for i in range(0,15):
            loopingFakeData = pd.concat([parsedDataset,loopingFakeData])
        
        socketio.emit('message',{'message': 'Dataset generated !'})  
        socketio.sleep(2)    

        loopingFakeData.to_csv(self.clientPath+'/FinalMassSpectrometryDatasetParsed.csv',index=False)
    
    def getClasses(self,sheets):
        ids = []
        classes = []
        for id in sheets:
            result = id.split("-")
            ids.append(result[0])
            classes.append(result[1])
        return ids,classes
      
    def makeChart(self,intensities,masses):         
        # allIntensities = np.sort([intensity for sample in intensities for intensity in sample])
        plt.figure(figsize=(6.25,7.25))
        plt.title("Magnitude Spectrum")
        plt.ylabel('Intensities')
        plt.xlabel('M/Z charge')
        for i in range(0,intensities.shape[0]):
            plt.magnitude_spectrum(intensities[i][:], Fs=masses)        

        plt.savefig('TESTMASS.png', dpi=300, facecolor='w', edgecolor='w',
                orientation='portrait', papertype=None, format=None,
                transparent=False, bbox_inches=None, pad_inches=0.1) 



      