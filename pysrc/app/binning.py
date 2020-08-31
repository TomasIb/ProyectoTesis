from .events import socketio
import pandas as pd
import numpy as np

class Binning():
    
    def getAgreggatesIntensities(self,sampleBins,intensities):           
        newIntensities = np.array([intensities[sampleBins == i ].max() for i in np.unique(sampleBins)])   
        newSampleBins = np.array([sampleBins[sampleBins == i ] for i in np.unique(sampleBins)])           
        return newIntensities , newSampleBins
    
    def getClasses(self,sheets):
        ids = []
        classes = []
        for id in sheets:
            result = id.split("-")
            ids.append(result[0])
            classes.append(result[1])
        return ids,classes

    def run(self,samples,sheets,cortemin,cortemax,params):    
        bin_size = params['binSize']

        socketio.emit('message',{'message': 'Getting bins with , '+ str(bin_size)+' bin size'})  
        socketio.sleep(1)        
        
        # GET  ALL MASSES , MIX AND SORT    
        bins = np.arange(cortemin,cortemax,bin_size)                                        
        readedMasses = np.array([samples[s]['mass'].values  for s in range(0,len(sheets))])
        allMasses = np.sort([mass for sublist in readedMasses for mass in sublist])
        
        # GET MASS BINS, COLUMNS HEADERS BY MEANS OF MASSES IN SAME CONTAINER
        socketio.emit('message',{'message': 'Binning , getting mean of masses for headers'})  
        socketio.sleep(1)  
        inds = np.digitize(allMasses, bins)                               
        columnsHeaders = np.array([allMasses[inds == i ].mean() for i in np.unique(inds)])    
        columnsHeaders = np.append([cortemin],columnsHeaders)
        columnsHeaders = columnsHeaders.astype(int)        
        columnsHeaders = columnsHeaders[~np.isnan(columnsHeaders)]        
        
               
        socketio.emit('message',{'message': 'Binning , making matrix of intensities'})  
        socketio.sleep(1)     

        # CREATE MATRIX
        matrix = np.zeros((len(sheets),len(columnsHeaders+1)))                
        for index,s in enumerate(samples):                  
            sampleSheetBin = np.digitize(s['mass'].values, columnsHeaders) 
            aggregateIntensities,newSampleBins =self.getAgreggatesIntensities(sampleSheetBin,s['normIntensity'].values)                                    
            for i,value in enumerate(newSampleBins):                                
                matrix[index][value-1]=aggregateIntensities[i]
            # SET NORM COLUMN INSIDE MATRIX    matrix[index][value-1]=s['z'].values[i]

        return matrix,columnsHeaders
        


  
