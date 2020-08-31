import numpy as np
from imblearn.over_sampling import SMOTE
from collections import Counter

class Detect:  
    def __init__(self):
        self.count_after_smote = 0
        self.count_before_smote = 0
        self.total_after_smote = 0
        self.total_before_smote = 0


    def missvalues(self, train_dataset, test_dataset, headers):
        missing_val_column_train = []
        missing_val_column_test = []
        nullValuesCount = 0
        missing_val_target = ["Nan", 'na', "", "?", "n/a", "Na"]
        for x in headers:

            temp_train = []
            temp_test = []

            temp_train = train_dataset[x].isnull()
            temp_test = test_dataset[x].isnull()

            for i, v in enumerate(temp_train):
                if(v == True):
                    if x not in missing_val_column_train:
                        missing_val_column_train.append(x)
                        nullValuesCount = nullValuesCount + 1

            for i, v in enumerate(temp_test):
                if(v == True):
                    if x not in missing_val_column_test:
                        missing_val_column_test.append(x)
                        nullValuesCount = nullValuesCount + 1

            for v in train_dataset[x]:
                if v in missing_val_target:
                    train_dataset[x] = train_dataset[x].replace(v, np.NaN)
                    if x not in missing_val_column_train:
                        missing_val_column_train.append(x)
                        nullValuesCount = nullValuesCount + 1

            for v in test_dataset[x]:
                if v in missing_val_target:
                    test_dataset[x] = test_dataset[x].replace(v, np.NaN)
                    if x not in missing_val_column_test:
                        missing_val_column_test.append(x)
                        nullValuesCount = nullValuesCount + 1

        for c in missing_val_column_train:
            for target in missing_val_target:
                train_dataset[c] = train_dataset[c].replace(target, np.NaN)

        for c in missing_val_column_test:
            for target in missing_val_target:
                test_dataset[c] = test_dataset[c].replace(target, np.NaN)

        return train_dataset, test_dataset, nullValuesCount, missing_val_column_test, missing_val_column_train

    def isBalanced(self,y_train,classes,isMultiClass):                        
        couter_target = Counter(y_train)                
        self.total_before_smote = len(y_train)
        self.total_after_smote = 'Smote was not used'
        
        self.count_before_smote = [value for key,value in couter_target.items()]
        self.count_after_smote = self.count_before_smote
         
        for c in classes:
            couter_target[c] = couter_target[c]/len(y_train)            
            if (isMultiClass == True):
                if(couter_target[c] != 1/len(couter_target)):                    
                    return False        
                return True
            else:
                if(couter_target[c] < 0.40 or couter_target[c] > 0.60):                                                            
                    return False #No está balanceado        
        return True

    def balanceWithSmote(self,X_train,y_train):
        smt = SMOTE()
        X_train, y_train = smt.fit_sample(X_train, y_train)       
        counts= Counter(y_train)
        self.count_after_smote = [value for key,value in counts.items()]                                       
        self.total_after_smote = len(y_train)
        return X_train,y_train
