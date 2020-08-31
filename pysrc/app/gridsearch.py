from joblib import parallel_backend
from sklearn.exceptions import DataConversionWarning
import warnings
warnings.filterwarnings(action='ignore', category=DataConversionWarning)
warnings.simplefilter(action='ignore', category=FutureWarning)
warnings.filterwarnings("ignore")

from sklearn.model_selection import GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn import svm
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.neural_network import MLPClassifier
import numpy as np
import time
import sys
import multiprocessing
multiprocessing.freeze_support()



def runSVM_GridSearch(X, y):
    with parallel_backend('multiprocessing', n_jobs=-1):
        param_grid = {'C': [pow(2, i)for i in range(-7, 7)], 'gamma': [pow(2, i)for i in range(-6, -2)], 'kernel': ['rbf', 'linear']}        
        grid_search = GridSearchCV(svm.SVC(random_state=10), param_grid, iid=False, cv=5, verbose=10)        

        initial_time = time.time()
        grid_search.fit(X, y)
        final_time = time.time()                
        return grid_search.best_params_, grid_search.best_score_,(str(final_time-initial_time)+" seg")

def runANN_GridSearch(X, y):
    with parallel_backend('multiprocessing', n_jobs=-1):
        param_grid = {'max_iter': np.arange(1000, 1800, 200), 'hidden_layer_sizes': np.arange(
            5, 30), 'activation': ['tanh', 'relu', 'logistic']}
        grid_search = GridSearchCV(MLPClassifier(
            solver='lbfgs', random_state=10), param_grid, iid=False, cv=5, n_jobs=-1, verbose=10)

        initial_time = time.time()
        grid_search.fit(X, y)
        final_time = time.time()
        
        return grid_search.best_params_, grid_search.best_score_,(str(final_time-initial_time)+" seg")

def runADB_GridSearch(X, y):
    with parallel_backend('multiprocessing', n_jobs=-1):
        param_grid = {'n_estimators': np.arange(10, 500, 10)}
        grid_search = GridSearchCV(AdaBoostClassifier(DecisionTreeClassifier(
            max_depth=1), algorithm='SAMME'), param_grid, iid=False, cv=5, n_jobs=-1, verbose=10)
        
        initial_time = time.time()
        grid_search.fit(X, y)
        final_time = time.time()
        return grid_search.best_params_, grid_search.best_score_, (str(final_time-initial_time)+" seg")

def runKNN_GridSearch( X, y):
    with parallel_backend('multiprocessing', n_jobs=-1):        
        param_grid = {'n_neighbors': np.arange(5, 31), 'metric': ['euclidean', 'manhattan', 'hamming', 'minkowski', 'jaccard']}
        grid_search = GridSearchCV(KNeighborsClassifier(), param_grid, iid=False, cv=5, n_jobs=-1, verbose=10)
        
        initial_time = time.time()
        grid_search.fit(X, y)
        final_time = time.time()
        return grid_search.best_params_, grid_search.best_score_, (str(final_time-initial_time)+" seg")

def runDTree_GridSearch(X, y):
    with parallel_backend('multiprocessing', n_jobs=-1):
        param_grid = {'min_samples_split': np.arange(2, 11)}
        grid_search = GridSearchCV(DecisionTreeClassifier(random_state=10, min_samples_leaf=2, criterion='gini'), param_grid, iid=False,scoring='accuracy', cv=5, n_jobs=-1, verbose=5)
        initial_time = time.time()
        grid_search.fit(X, y)
        final_time = time.time()
        return grid_search.best_params_, grid_search.best_score_, (str(final_time-initial_time)+" seg")

def runRF_GridSearch(X, y):
    with parallel_backend('multiprocessing', n_jobs=-1):
        param_grid = {'n_estimators': np.arange(250, 501, 20), 'max_depth': np.arange(2, 11)}
        grid_search = GridSearchCV(RandomForestClassifier(random_state=10), param_grid, iid=False, scoring='accuracy', cv=5, n_jobs=-1, verbose=10)
        initial_time = time.time()
        grid_search.fit(X, y)
        final_time = time.time()
        return grid_search.best_params_, grid_search.best_score_, (str(final_time-initial_time)+" seg")
