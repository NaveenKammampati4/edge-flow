import React, { useState, useEffect } from "react";
import InputConfig from "./InputConfig";
import TransformsConfig from "./TransformsConfig";

const Main = () => {
  const [inputsConfig, setInputsConfig] = useState(1);
  const [inputsConfigList, setInputsConfigList] = useState([]);
  const [inputsFormat, setInputsFormat] = useState({
    appName : "",
    indexName : "",
    inputs:[
      {id : "", filePath:"", sourceType:"", index:"",
         customFields : [
      ]
      }
     
    ],
    props : {
      
  //     sourceType : { 
   
  //   timeFormat: "",
  //   dateTime: "",
  //   lineBreaker: "",
  //   shouldLine: "",
  //   truncate: "",
  //   newKey : "",
  //   newValue : "",
  // }
    }
,
    transform:
      []   
  });

  useEffect(() => {
    const arr = Array.from({ length: inputsConfig }, (_, i) => i + 1);
    setInputsConfigList(arr);
  }, [inputsConfig]);

  const cancelConfig = (val) => {
    if (inputsConfigList.length > 1) {
      const inputs = inputsConfigList.filter((each) => each !== val);
      setInputsConfigList(inputs);
    }
  };

  const handleCreateApp = () => {
    console.log("inputs format : ", inputsFormat); 
  }

  const handleInputConfigs=()=>{
    setInputsConfig(inputsConfig + 1)
    const customInputData={filePath:"", sourceType:"", index:""}
    const propsConfig={ 
    timeFormat: "",
    dateTime: "",
    lineBreaker: "",
    shouldLine: "",
    truncate: "",}
    setInputsFormat((prev) => ({
    ...prev,
    inputs: [...prev.inputs, customInputData], 
    
  }));
  }

  const handleTransforms=()=>{
    const transformsData={
      newKey:"",
      newValue:"",
      regex:"",
      format:"",
      destKey:""
    }

    setInputsFormat((prev) => ({
    ...prev,
    transform:[...prev.transform, transformsData]
  }));
  }

  return (
    <div className="flex flex-col justify-center items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-blue-600 font-bold text-2xl mb-6">
        Dynamic Splunk App Builder
      </h2>
      <div className="w-full  bg-white shadow-md rounded-xl p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col bg-white shadow rounded-lg p-4">
            <label htmlFor="appName" className="font-medium mb-1">
              App Name
            </label>
            <input
              id="appName"
              className="border border-gray-400 rounded-md px-3 py-2"
              onChange={(e) => {
                  setInputsFormat((prev) => ({
                    ...prev,
                    appName: e.target.value,
                  }));
                }}
              placeholder="Enter App Name"
            />
          </div>
          <div className="flex flex-col bg-white shadow rounded-lg p-4">
            <label htmlFor="indexName" className="font-medium mb-1">
              Index Name
            </label>
            <input
              id="indexName"
              className="border border-gray-400 rounded-md px-3 py-2"
              onChange={(e) => {
                  setInputsFormat((prev) => ({
                    ...prev,
                    indexName: e.target.value,
                  }));
                }}
              placeholder="Enter Index Name"
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Inputs Config</h2>
          <hr className="mb-4 text-blue-500" />
        </div>

        <div className="flex flex-col gap-6">
          {inputsConfigList.map((each) => (
            <InputConfig key={each} cancelConfig={cancelConfig} each={each} inputsFormat={inputsFormat} setInputsFormat={setInputsFormat} handleTransforms={handleTransforms}/>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
            onClick={handleInputConfigs}
          >
            + Add Input
          </button>
        </div>
        <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        onClick={handleCreateApp}>
          Create App
        </button>
        
      </div>
    </div>
  );
};

export default Main;
