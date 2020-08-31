from .events import socketio
import pandas as pd
import numpy as np


class Alignment():

    def run(self, samples, sheets, params,massType):
        socketio.emit('message',{'message': 'Alignment of masses , building headers'})  
        socketio.sleep(1)    
   
        
        if(massType['name'] =='ESI'):
             s1 = s2 = s3 = int(params['sigmaLow'])
        elif(massType['name'] == 'MALDI-TOF'):
            s1 = int(params['sigmaLow'])  # s1 = 5
            s2 = int(params['sigmaMid'])  # s2 = 10
            s3 = int(params['sigmaHigh'])  # s3 = 15
        
        
        readedMasses = np.array([samples[s]['mass'].values for s in range(0, len(sheets))])
        masses = np.sort([mass for sublist in readedMasses for mass in sublist])

        headers = []
        siguienteSet = True

        suma = 0
        j = 0

        for m in masses:
            if(m > 10000):
                currentError = s3
            elif(m < 10000 and m > 7000):
                currentError = s2
            elif(m > 5000):
                currentError = s1

            SderrorLLenado = currentError - (currentError*0.2)
            if(siguienteSet):
                valorMax = m + SderrorLLenado
                valorMin = m - SderrorLLenado
                siguienteSet = False

            if (m <= valorMax):
                if m >= valorMin:
                    suma = suma + m
                    j = j + 1
            else:
                if(j != 0):
                    suma = suma / j
                    headers.append(suma)
                suma = 0
                j = 0
                siguienteSet = True

        headers = np.around(np.array(headers), 3)        
        matrix = self.generarMatriz(samples, sheets, headers, s1, s2, s3)

        return matrix,headers

    def generarMatriz(self, samples, sheets, headers, s1, s2, s3):  
        socketio.sleep(1)      
        socketio.emit('message',{'message': 'Alignment of masses , adding intensities to matrix'})  
        socketio.sleep(1)           
        matrix = np.zeros((len(samples),len(headers)))                    
        for sampleIndex,s in enumerate(samples):
            for headerIndex,h in enumerate(headers):            
                if(h <= 10000):
                    currentError = s1
                elif(h <= 10000 and h >= 7000):
                    currentError = s2
                elif(h >= 5000):
                    currentError = s3
                errorPercent = currentError - (currentError*0.2)

                highLimit = h + errorPercent
                valormenos = h - errorPercent
        
                for massIndex,m in enumerate(s['mass']):                                        
                    if(m >= valormenos and m <=highLimit):
                        matrix[sampleIndex][headerIndex] = float(s['normIntensity'][massIndex])

        return matrix                
                
