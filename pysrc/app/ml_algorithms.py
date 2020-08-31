import warnings
warnings.filterwarnings("ignore")
import numpy as np
from sklearn.naive_bayes import BernoulliNB
from sklearn.linear_model import LogisticRegression
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn import svm
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline,make_pipeline
from app.gridsearch import runSVM_GridSearch,runANN_GridSearch,runADB_GridSearch,runKNN_GridSearch,runDTree_GridSearch,runRF_GridSearch



class NaiveBayes():
    def run(self,X_train, y_train, X_test):
        Naive_bayes = BernoulliNB()
        Naive_bayes.fit(X_train, y_train) 
        y_pred =  Naive_bayes.predict(X_test)
        y_prob = Naive_bayes.predict_proba(X_test)
        return y_pred,y_prob[:,1],Naive_bayes
    def get_best_params(self):
        return []

class LR():
    def run(self,X_train, y_train, X_test):
        Logistic_regression = LogisticRegression(solver='liblinear', multi_class='ovr')
        Logistic_regression.fit(X_train, y_train)
        y_pred = Logistic_regression.predict(X_test)
        y_prob = Logistic_regression.predict_proba(X_test)
        return y_pred, y_prob[:,1],Logistic_regression
    def get_best_params(self):
        return []

class SVM():
    def __init__(self):
        self.C = 0
        self.gamma = 0
        self.kernel = ''
        self.best_score_ = 0
        self.gs_time = 0
        
    def run_gridsearch(self,X,y):
        best_params_,self.best_score_,self.gs_time = runSVM_GridSearch(X,y)
        self.C = best_params_['C']
        self.gamma = best_params_['gamma']
        self.kernel = best_params_['kernel']

        
    def run(self,X_train, y_train, X_test):
        svm_ = svm.SVC(probability=True, random_state=10, C=self.C, gamma=self.gamma, kernel= self.kernel)
        svm_.fit(X_train, y_train)
        y_pred = svm_.predict(X_test)
        y_prob = svm_.predict_proba(X_test)
        return y_pred, y_prob[:,1],svm_

    def get_best_params(self):
        bestParams=[{
            "C":self.C,
            "Gamma":self.gamma,
            "Kernel":self.kernel,
            "Best Score":self.best_score_,
            "Execution Time":self.gs_time
        }]
        return bestParams


class ArtificialNeuralNetwork():
    def __init__(self):
        self.activation = None
        self.hidden_layer_sizes = 0
        self.max_iter = 0
        self.best_score_ = 0
        self.gs_time= 0
    
    def run_gridsearch(self,X,y):
        best_params_,self.best_score_,self.gs_time = runANN_GridSearch(X,y)        
        self.activation = best_params_['activation']
        self.hidden_layer_sizes = best_params_['hidden_layer_sizes']
        self.max_iter = best_params_['max_iter']

    def run(self,X_train, y_train, X_test):
        mlp = MLPClassifier(solver ='lbfgs', activation = self.activation , random_state = 10, hidden_layer_sizes = self.hidden_layer_sizes, max_iter = self.max_iter)
        mlp.fit(X_train, y_train)
        y_pred = mlp.predict(X_test)
        y_prob = mlp.predict_proba(X_test)
        return y_pred, y_prob[:,1],mlp                            

    def get_best_params(self):
        print(self.gs_time)
        bestParams=[{            
            "Activation":self.activation,
            "Hidden Layer Sizes":self.hidden_layer_sizes,
            "Max Iteration":self.max_iter,
            "Best Score":self.best_score_,
            "Execution Time":self.gs_time
        }]
        return bestParams
       
class KNN():
    def __init__(self):
        self.metric = None
        self.n_neighbors = 0
        self.best_score_ = 0
        self.gs_time = 0
        
    def run_gridsearch(self,X,y):
        best_params_,self.best_score_,self.gs_time = runKNN_GridSearch(X,y)
        self.metric = best_params_['metric']
        self.n_neighbors = best_params_['n_neighbors']

    def run(self,X_train, y_train, X_test):
        knn = KNeighborsClassifier(metric = self.metric, n_neighbors = self.n_neighbors, n_jobs = 1)
        knn.fit(X_train, y_train)
        y_pred = knn.predict(X_test)
        y_prob = knn.predict_proba(X_test)
        return y_pred, y_prob[:,1],knn
    
    def get_best_params(self):
        bestParams=[{            
            "Metric":self.metric,
            "N Neighbors":self.n_neighbors,
            "Best Score":self.best_score_,
            "Execution Time":self.gs_time          
        }]
        return bestParams

class AdaBoost():
    def __init__(self):
        self.n_estimators = 0
        self.best_score_ = 0
        self.gs_time  = 0
        
    def run_gridsearch(self,X,y):
        best_params_,self.best_score_,self.gs_time  = runADB_GridSearch(X,y)
        self.n_estimators = best_params_['n_estimators']      
    def run(self,X_train, y_train, X_test):
        adb = AdaBoostClassifier(DecisionTreeClassifier(max_depth=1),algorithm = "SAMME",n_estimators = self.n_estimators, learning_rate = 1 )
        adb.fit(X_train, y_train)
        y_pred = adb.predict(X_test)
        y_prob = adb.predict_proba(X_test)
        return y_pred, y_prob[:,1],adb

    def get_best_params(self):
        bestParams=[{            
            "N Estimators":self.n_estimators,
            "Best Score":self.best_score_,
            "Execution Time":self.gs_time            
        }]
        return bestParams

class DecisionTree():
    def __init__(self):
        self.min_samples_split = None
        self.best_score_ = 0
        self.gs_time  = 0
        
    def run_gridsearch(self,X,y):
        best_params_,self.best_score_,self.gs_time = runDTree_GridSearch(X,y)
        self.min_samples_split = best_params_['min_samples_split']

    def run(self,X_train, y_train, X_test):
        dtree = DecisionTreeClassifier(random_state=10, criterion='gini', min_samples_split = self.min_samples_split, min_samples_leaf=2)
        dtree.fit(X_train, y_train)
        y_pred = dtree.predict(X_test)
        y_prob = dtree.predict_proba(X_test)
        return y_pred, y_prob[:,1],dtree
    
    def get_best_params(self):
        bestParams=[{            
            "Min Samples Split":self.min_samples_split, 
            "Best Score":self.best_score_,
            "Execution Time":self.gs_time           
        }]
        return bestParams

class RandomForest():
    def __init__(self):
        self.max_depth = None
        self.n_estimators = None
        self.best_score_ = 0
        self.gs_time  = 0

    def run_gridsearch(self,X,y):
        best_params_,self.best_score_,self.gs_time = runRF_GridSearch(X,y)
        self.max_depth = best_params_['max_depth']
        self.n_estimators = best_params_['n_estimators']

    def run(self,X_train, y_train, X_test):
        Random_Forest = RandomForestClassifier(n_estimators=self.n_estimators, max_depth= self.max_depth, random_state=10, n_jobs=1)
        Random_Forest.fit(X_train, y_train)
        y_pred = Random_Forest.predict(X_test)
        y_prob = Random_Forest.predict_proba(X_test)
        return y_pred, y_prob[:,1],Random_Forest

    def get_best_params(self):
        bestParams=[{            
            "Max Depth":self.max_depth,  
            "N Estimators":self.n_estimators, 
            "Best Score":self.best_score_,
            "Execution Time":self.gs_time                       
        }]
        return bestParams
    




