import { getImputerVariables, getPositiveTargetClass, getEncoderAlgorithms, getScalerAlgorithms, transformColumns, getIsBalanced ,getFeatureSelector,getMlAlgorithms} from '.';

// Esta variable setea la secuencia del pipeline, 
// name: es el nombre del paso que se realiza
// post: es la url de la api para metodo post
// nextGet: corresponde al siguiente paso que será llamado

export const pipeSteps = [
    {
        name: 'Split Size',
        post: 'defineTrainTestSplit',
        nextGet: getImputerVariables,
    },
    {
        name: 'Imputer',
        post: 'imputer',
        nextGet: getPositiveTargetClass
    },
    {
        name: 'Positive Target Class',
        post: 'positive-target-class',
        nextGet: getEncoderAlgorithms
    },
    {
        name: 'Encoder Algorithm',
        post: 'encoder',
        nextGet: getScalerAlgorithms
    },
    {
        name: 'Normalize',
        post: 'normalize',
        nextGet: transformColumns
    },
    {
        name: 'transform',
        post: null,
        nextGet: getIsBalanced
    },

    {
        name: 'isBalanced',
        post: 'balance',
        nextGet: getFeatureSelector
    },
    {
        name: 'Feature Selector',
        post: 'feature-selector',
        nextGet: getMlAlgorithms
    },
    {
        name: 'ML Algorithms',
        post: 'mlAlgorithms',
        nextGet: null  //siguiente get es metrics se navega a metrics y se llaman las metricas en useeffect
    },
    {
        name: 'Metrics', //solo para identificar y navegar
        post: '',
        nextGet: null
    }
]








