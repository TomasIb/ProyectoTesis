
def getMissValuesQuestion():
    question = {
                'name': 'Imputer',                                        
                'title':'We find missing values in your dataset. Please select a Miss Values Imputer.',
                'choices':  [
                                {"name":'Miss Forest'},
                                {"name":'KNN Miss Values'},
                            ],
                'type': 'radio'
            }
    
    return question


def getPositiveTargetClassQuestion(classes):
    options = []
    for c in classes:
        options.append({"name":str(c)})        
    question =  {                                
                'name': 'Positive Target Class',
                'title':'The binary dataset class column is not encoded. Please select the positive class',                              
                'choices':   options,          
                'type': 'radio'
                }
    return question
    

def getEncoderAlgorithmsQuestion():
    question =  {                    
                    'name': 'Encoder Algorithm',  
                    'title': 'We find no encoder columns in your dataset. Please select a Encoder',                    
                    'choices': [
                        {"name":'Label Encoder'},
                        {"name":'One Hot Encoder'},                        
                        # 'Do not select'                        
                    ],           
                    'type': 'radio'         
                }

    return question
    

    

def getNormalizeQuestion():
    question =  {                    
                    'name': 'Normalize',  
                    'title': 'Which scaler algoritm for continuous values do you want to use?',                                        
                    'choices': [
                        {"name":'Min Max Scaler'},
                        {"name":'Standard Scaler'},
                        {"name":'Normalizer'},
                        {"name":'Do not normalize'}                                                                          
                    ],     
                    'type': 'radio'
                }

    return question


def getBalanceQuestion():
    question = {                    
                "name": "Balance",                    
                "title": "The dataset is unbalanced, do you want to use Smote?",
                "choices":  [
                                {"name":"Yes"},                        
                                {"name":"No"},                                
                            ],
                'type': 'radio'
                }
    return question     



def getFeatureSelectionQuestion():
    question = {                    
                "name": "Feature Selector",                    
                "title": "Which feature selector do you want to use?",
                "choices":  [
                                {"name":"Boruta"},                        
                                {"name":"Recursive Feature Elimination"},
                                {"name":"Recursive Feature Elimination CV",
                                "params":{
                                    "name": "Recursive Feature Elimination CV Estimator",                    
                                    "title": "Select the algorithm to fit RFECV",
                                    "type": "Fit algorithm",
                                    "choices":  [
                                            {"name":"Support Vector Machine"},                        
                                            {"name":"Random Forest"},                                
                                    ],                
                                }},                        
                                {"name":"Do not select"}
                            ],
                'type': 'radio'                        
                }
    return question      

 


def getMlAlgorithmsQuestion():
    question = {                                                            
                    'name': 'ML Algorithms',
                    'title': 'Select the Machine Learning Algorithms to train',                    
                    'choices': [
                                {"name":'Naive Bayes'},
                                {"name":'Logistic Regression'},
                                {"name":'Suport Vector Machine'},                                                
                                {"name":'Artificial Neural Network'},                                          
                                {"name":'K-Nearest Neighbors'},                                                
                                {"name":'AdaBoost'},                                                
                                {"name":'Decision Tree'},                                                
                                {"name":'Random Forest'}                        
                            ],      
                    'type': 'checkbox'
                }    
    return question




        


