import { useState } from 'react';

export const useQuestionStep = (nameInitialState,titleInitialState) => {   
    const [stepName, setStepName] = useState(nameInitialState); 
    const [title, setTitle] = useState(titleInitialState);
    const [type, setType] = useState('range-slider');
    const [options, setOptions] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [itemChecked, setItemChecked] = useState({});
    const [checkedTotal, setCheckedTotal] = useState(0);
    const [selected, setSelected] = useState(0.10);
    const [disableButtonNext, setDisableButtonNext] = useState(false);

    const setStep = (name,title, choices,type) => {                
        setStepName(name)
        setTitle(title)
        setType(type)
        setOptions(choices)      
        setSelected(JSON.stringify(choices[0])) 
        setDisableButtonNext(false);        
    }

    const handleSetOptions = (options) => {
        setOptions(options)
    }

    const setItems = (question) => {
        setItemChecked(new Array(question.choices.length).fill().map((item) => item = true))
        setDisableButtonNext(true)         
        setSelected([])         
    }
 
    const handleCheckItem = (index) => {
        const itemCheckedChanged = itemChecked.map((item, idx) => { if (index === idx) { item = !item } return item; });
        const total = itemCheckedChanged.filter((item) => item === false).length
        setCheckedTotal(total)
        setItemChecked(itemCheckedChanged)
        setSelectedCheckbox(itemCheckedChanged)
        
    }

    const handleSelectAll = () => {
        setSelectAll(!selectAll)        
        var itemCheckedChanged = itemChecked.map((item) => { 
            item = selectAll ? true : false;
            return item;
        });       
        setItemChecked(itemCheckedChanged)
        setCheckedTotal(itemCheckedChanged.filter((item) => item === false).length)
        setSelectedCheckbox(itemCheckedChanged)

    }

    const setSelectedCheckbox = (itemCheckedChanged) => {
        const selectedItemsFilter = options.filter((item, idx) => itemCheckedChanged[idx] === false).map((item, idx) => { return item.name });        
        setSelected(selectedItemsFilter)
        selectedItemsFilter.length > 0 ? setDisableButtonNext(false) : setDisableButtonNext(true)
    }

    return {
        stepName,
        title,
        type,
        options,
        selected,    
        selectAll,
        itemChecked,
        checkedTotal,
        disableButtonNext,
        setStep,
        handleSetOptions,
        setItems,
        handleSelectAll,
        handleCheckItem,
        setSelectedCheckbox,
        setSelected,
        setDisableButtonNext

    };



}