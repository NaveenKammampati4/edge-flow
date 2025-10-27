import React from 'react'
import { useState } from 'react';

export const IndexConfig = ({indexName, setInputsFormat, inputsFormat, cancelConfig}) => {
    console.log("inpu",inputsFormat)
    const [customkey, setCustomKey] = useState("");
  const [customvalue, setCustomValue] = useState("");
  const handleAddCustomField = () => {
      // setInputCustomFields([...inputCustomFields, { key: "", value: "" }]);
      if (customkey !== "" && customvalue !== "") {
        setInputsFormat(prev => ({
                    ...prev,
                    indexConfig:{ ...prev.indexConfig,[indexName]: {
                      ...prev.indexConfig[indexName],
                      customFields: [
                        ...prev.indexConfig[indexName].customFields,
                        { [customkey]: customvalue }
                      ]
                    }},
                    
                  }));
        // setInputsFormat((prev) => {
        //   let updatedIndex = prev.indexConfig[indexName];
  
        //   const updatedCustomIndex = [
        //     ...updatedIndex.customFields,
        //     { [customkey]: customvalue }
        //   ];
  
        //   updatedIndex = {
        //     ...updatedIndex,
        //     customFields: updatedCustomIndex
        //   };
  
        //   return {
        //     ...prev,
        //     index: updatedIndex
        //   };
        // });
      }
  
      setCustomKey("");
      setCustomValue("");
  
    };
  
    const deleteCustomField = (delVal) => {
      let updatedCustomFileds = inputsFormat.indexConfig[indexName].customFields.filter((each, index) => index !== delVal);
      console.log("updatedCustomFileds", updatedCustomFileds);
       setInputsFormat(prev => ({
                    ...prev,
                    indexConfig:{ ...prev.indexConfig,[indexName]: {
                      ...prev.indexConfig[indexName],
                      customFields: updatedCustomFileds
                    }},
                    
                  }));
    }
  return (
    <div>
         <div>
          <h2 className="text-xl font-semibold mb-2">Index Config</h2>
          <hr className="mb-4 text-blue-500" />


        </div>
        <div className="shadow-md rounded-2xl pb-3">
          <div className="grid grid-cols-5 gap-4   p-6">

            <div className="flex flex-col ">
              <label className="text-sm font-medium text-gray-700 mb-1">Hot Path</label>
              <input
                name="hotPath"
                type="text"
                onChange={e => {
                  setInputsFormat(prev => ({
                    ...prev,
                    indexConfig:{ ...prev.indexConfig,[indexName]: {
                      ...prev.indexConfig[indexName],
                      hotPath: e.target.value
                    }},
                    
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter hot path"
              />
            </div>


            <div className="flex flex-col ">
              <label className="text-sm font-medium text-gray-700 mb-1">Cold Path</label>
              <input
                name="coldPath"
                type="text"
                onChange={e => {
                  setInputsFormat(prev => ({
                    ...prev,
                    indexConfig:{ ...prev.indexConfig,[indexName]: {
                      ...prev.indexConfig[indexName],
                      coldPath: e.target.value
                    }},
                    
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter cold path"
              />
            </div>


            <div className="flex flex-col ">
              <label className="text-sm font-medium text-gray-700 mb-1">Thawed Path</label>
              <input
                name="thawedPath"
                type="text"
                onChange={e => {
                  setInputsFormat(prev => ({
                    ...prev,
                    indexConfig:{ ...prev.indexConfig,[indexName]: {
                      ...prev.indexConfig[indexName],
                      thawedPath: e.target.value
                    }},
                    
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter thawed path"
              />
            </div>


            <div className="flex flex-col ">
              <label className="text-sm font-medium text-gray-700 mb-1">MAX Size</label>
              <input
                name="MAXsize"
                type="text"
                onChange={e => {
                  setInputsFormat(prev => ({
                    ...prev,
                    indexConfig:{ ...prev.indexConfig,[indexName]: {
                      ...prev.indexConfig[indexName],
                      MAXsize: e.target.value
                    }},
                    
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter max size"
              />
            </div>


            <div className="flex flex-col ">
              <label className="text-sm font-medium text-gray-700 mb-1">Retention Time</label>
              <input
                name="retentionTime"
                type="text"
               onChange={e => {
                  setInputsFormat(prev => ({
                    ...prev,
                    indexConfig:{ ...prev.indexConfig,[indexName]: {
                      ...prev.indexConfig[indexName],
                      retentionTime: e.target.value
                    }},
                    
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter retention time"
              />
            </div>
          </div>

          <div className="flex flex-row gap-2.5 justify-start items-end pl-6">
            <div className="flex flex-col ">
              <label className="text-lg font-semibold text-gray-700 mb-1">Custom Fields</label>
              <input
                value={customkey}
                type="text"
                onChange={(e) => setCustomKey(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Key"
              />
            </div>
            <div className="flex flex-col ">
              <label className="text-sm font-medium text-gray-700 mb-8"></label>
              <input
                value={customvalue}
                type="text"
                onChange={(e) => setCustomValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Value"
              />
            </div>
            <div>
              <button
                onClick={handleAddCustomField}
                className="p-2 ml-1.5 max-w-20 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
          {inputsFormat.indexConfig[indexName].customFields.length > 0 ? (
            inputsFormat.indexConfig[indexName].customFields.map((field, index) => {
              const key = Object.keys(field)[0];
              const value = field[key];
              return <div className="flex flex-row gap-2.5 pl-6 mt-2">
                <div className="flex flex-col ">
                  <input
                    onChange={(e) => setNewKey(e.target.value)}
                    value={key}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Key"
                  />
                </div>
                <div className="flex flex-col ">
                  <input
                    onChange={(e) => setValue(e.target.value)}
                    value={value}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Value"
                  />
                </div>
                <div>
                  <button
                    onClick={() => deleteCustomField(index)}
                    className="p-2 ml-1.5  max-w-20 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                </div>

              </div>
            })
          ) : (
            <p className="text-sm mt-2 pl-6">No Custom fields added yet.</p>
          )}
        </div>
    </div>
  )
}
