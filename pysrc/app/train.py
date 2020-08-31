from .events import socketio
import time
import pandas as pd
from sklearn.model_selection import KFold 
from sklearn import metrics
from app.ml_algorithms import NaiveBayes,LR,SVM,ArtificialNeuralNetwork,KNN,AdaBoost,DecisionTree,RandomForest
import warnings
warnings.filterwarnings("ignore", "(?s).*MATPLOTLIBDATA.*", category=UserWarning)
warnings.filterwarnings("ignore")
warnings.simplefilter(action='ignore', category=FutureWarning)
def warn(*args, **kwargs):
    pass
import warnings
warnings.warn = warn

class Train:                        
    def set_algorithms(self,steps,options,X_train,y_train):        
        algorithms_dict = []
        algorithms_real_name = []
        algorithms_obj = []        
        selected_algorithms=[]

        self.selections = []
        for i,s in enumerate(steps):
            self.selections.append(options[i][s])
            if(s == 'algorithms'):
                selected_algorithms = options[i][s]        

        for name in selected_algorithms:               
            if(name == 'Naive Bayes'):                    
                socketio.sleep(1)
                socketio.emit('message',{'message': 'Setting Naive Bayes'})                     
                socketio.sleep(1)
                naive_bayes = NaiveBayes()
                algorithms_obj.append(naive_bayes)
                algorithms_dict.append('NB')
                algorithms_real_name.append(name)    
                                                                
            elif( name  == 'Logistic Regression'):
                socketio.sleep(1)
                socketio.emit('message',{'message': 'Setting Logistic Regression'}) 
                socketio.sleep(1)
                logistic_regression = LR()
                algorithms_obj.append(logistic_regression)
                algorithms_dict.append('LR')
                algorithms_real_name.append(name)
                
            elif( name  == 'Suport Vector Machine'):
                socketio.sleep(1)
                socketio.emit('message',{'message': 'Grid Search on Suport Vector Machine'})
                socketio.sleep(1)
                svm = SVM()                                
                svm.run_gridsearch(X_train,y_train)
                algorithms_obj.append(svm)
                algorithms_dict.append('SVM')
                algorithms_real_name.append(name)
            elif( name == 'Artificial Neural Network'):                
                socketio.sleep(1)
                socketio.emit('message',{'message': 'Grid Search on Artificial Neural Network'}) 
                socketio.sleep(1)
                ann = ArtificialNeuralNetwork()
                ann.run_gridsearch(X_train,y_train)
                algorithms_obj.append(ann)
                algorithms_dict.append('ANN')
                algorithms_real_name.append(name)
            elif( name  == 'K-Nearest Neighbors'):  
                socketio.sleep(1)              
                socketio.emit('message',{'message': 'Grid Search on K-Nearest Neighbors'}) 
                socketio.sleep(1)
                knn = KNN()
                knn.run_gridsearch(X_train,y_train)
                algorithms_obj.append(knn)
                algorithms_dict.append('KNN')
                algorithms_real_name.append(name)
            elif( name  == 'AdaBoost'):
                socketio.sleep(1)              
                socketio.emit('message',{'message': 'Grid Search on Adabost'}) 
                socketio.sleep(1)
                adb = AdaBoost()            
                adb.run_gridsearch(X_train,y_train)
                algorithms_obj.append(adb)
                algorithms_dict.append('ADB')
                algorithms_real_name.append(name)
            elif( name  == 'Decision Tree'):
                socketio.sleep(1)              
                socketio.emit('message',{'message': 'Grid Search on Decision Tree'}) 
                socketio.sleep(1)
                dt = DecisionTree()                
                dt.run_gridsearch(X_train,y_train)
                algorithms_obj.append(dt)
                algorithms_dict.append('DTREE')
                algorithms_real_name.append(name)
            elif( name  == 'Random Forest'):
                socketio.sleep(1)              
                socketio.emit('message',{'message': 'Grid Search on Random Forest'}) 
                socketio.sleep(1)
                rf = RandomForest()                
                rf.run_gridsearch(X_train,y_train)
                algorithms_obj.append(rf)
                algorithms_dict.append('RF')
                algorithms_real_name.append(name)
        return algorithms_dict,algorithms_real_name,algorithms_obj    
 
      
      
              
    def  train(self,train_dataset,X_train,y_train,algorithms_obj,algorithms_dict,splits,folds):            
        kf = KFold(n_splits=splits, random_state=7, shuffle=True)
        accuracy = pd.DataFrame(None, columns=folds,index=algorithms_dict, dtype='float64')                       
        contFold=0
        socketio.emit('message',{'message': 'Cross Validation Fold '+str(contFold)})
        socketio.sleep(0.2)
        train_algorithm = []

        for train_index, test_index in kf.split(X_train):
            Fold_X_train, Fold_X_test = X_train[train_index], X_train[test_index]
            Fold_y_train, Fold_y_test = y_train[train_index], y_train[test_index]
            for i,obj in enumerate(algorithms_obj):                                
                pred_value, prob_value, t_a = obj.run(Fold_X_train, Fold_y_train, Fold_X_test)
                train_algorithm.append(t_a)
                train_dataset.loc[train_dataset.index[test_index],algorithms_dict[i]] = pred_value
                train_dataset.loc[train_dataset.index[test_index],algorithms_dict[i]+' PROB'] = prob_value
                accuracy.loc[algorithms_dict[i]][folds[contFold]] = metrics.accuracy_score(Fold_y_test, pred_value)                
            contFold+=1                                    
            socketio.emit('message',{'message': 'Cross Validation Fold '+str(contFold)})
            socketio.sleep(0.3)                
        return train_algorithm