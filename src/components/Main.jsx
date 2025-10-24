import React, { useState, useEffect } from "react";
import InputConfig from "./InputConfig";
import TransformsConfig from "./TransformsConfig";

const Main = () => {
  const [inputsConfig, setInputsConfig] = useState([1]);
  const [inputsConfigList, setInputsConfigList] = useState([]);


  const [mode, setMode] = useState("new");
  const [indexName, setIndexName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [customkey, setCustomKey] = useState("");
  const [customvalue, setCustomValue] = useState("");

  const existingIndexes = ["users_index", "orders_index", "products_index"];
  const possibleSuffixes = ["_logs", "_data"];

  const handleInputChange = (e) => {
    const value = e.target.value;
    setIndexName(value);
    console.log("Typed:", value);
    console.log("Current suggestions:", suggestions);

    if (value.trim() !== "") {

      const generated = possibleSuffixes.map((suffix) => suffix);
      setSuggestions(generated);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddCustomField = () => {
    // setInputCustomFields([...inputCustomFields, { key: "", value: "" }]);
    if (customkey !== "" && customvalue !== "") {
      setInputsFormat((prev) => {
        let updatedIndex = prev.index;

        const updatedCustomIndex = [
          ...updatedIndex.customFields,
          { [customkey]: customvalue }
        ];

        updatedIndex = {
          ...updatedIndex,
          customFields: updatedCustomIndex
        };

        return {
          ...prev,
          index: updatedIndex
        };
      });
    }

    setCustomKey("");
    setCustomValue("");

  };

  const deleteCustomField = (delVal) => {
    let updatedCustomFileds = inputsFormat.index.customFields.filter((each, index) => index !== delVal);
    console.log("updatedCustomFileds", updatedCustomFileds);
    setInputsFormat((prev) => {
      let updatedIndex = prev.index;

      updatedIndex = {
        ...updatedIndex,
        customFields: updatedCustomFileds
      };

      return {
        ...prev,
        index: updatedIndex
      };
    });
  }

  const [inputsFormat, setInputsFormat] = useState({
    appName: "",
    indexName: "",
    index: {
      hotPath: "",
      coldPath: "",
      thawedPath: "",
      MAXsize: "",
      retentionTime: "",
      customFields: []
    },
    inputs: [
      {
        id: 1, filePath: "", sourceType: "", index: "",
        customFields: [
        ]
      }

    ],
    props: {

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

  const handleInputConfigs = () => {
    const newId = inputsConfigList.length + 1;
    // setInputsConfig(inputsConfig + 1)
    const customInputData = { id: newId, filePath: "", sourceType: "", index: "", customFields: [] }
    // const propsConfig={ 
    // timeFormat: "",
    // dateTime: "",
    // lineBreaker: "",
    // shouldLine: "",
    // truncate: "",}
    setInputsConfigList((prev) => [...prev, newId]);
    setInputsFormat((prev) => ({
      ...prev,
      inputs: [...prev.inputs, customInputData],

    }));
  }

  const handleIndexConfig = () => {
    const newId = inputsConfigList.length + 1;
    const newConfig = {
      id: newId,
      hotPath: "",
      coldPath: "",
      thawedPath: "",
      MAXsize: "",
      retentionTime: "",
    };


    setInputsConfigList((prevList) => [...prevList, newConfig]);
  };

  const handleTransforms = () => {
    const transformsData = {
      newKey: "",
      newValue: "",
      regex: "",
      format: "",
      destKey: ""
    }

    setInputsFormat((prev) => ({
      ...prev,
      transform: [...prev.transform, transformsData]
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
          {/* <div className="flex flex-col bg-white shadow rounded-lg p-4">
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


          </div> */}

          <div className="flex flex-col bg-white shadow rounded-lg p-4 space-y-3">
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="existing"
                  checked={mode === "existing"}
                  onChange={() => {
                    setMode("existing"), setInputsFormat((prev) => ({
                      ...prev,
                      indexName: "",
                    }))
                  }}
                  className="accent-blue-600"
                />
                <span>Existing Index</span>
              </label>

              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="new"
                  checked={mode === "new"}
                  onChange={() => {
                    setMode("new"), setInputsFormat((prev) => ({
                      ...prev,
                      indexName: "",
                    }))
                  }}
                  className="accent-blue-600"
                />
                <span>New Index</span>
              </label>
            </div>


            {mode === "existing" ? (
              <div className="flex flex-col">
                <label htmlFor="existingIndex" className="font-medium mb-1">
                  Select Existing Index
                </label>
                <select
                  id="existingIndex"
                  className="border border-gray-400 rounded-md px-3 py-2"
                  onChange={(e) => {
                    setInputsFormat((prev) => ({
                      ...prev,
                      indexName: e.target.value,
                    }));
                  }}
                >
                  <option value="">-- Choose an index --</option>
                  {existingIndexes.map((index) => (
                    <option key={index} value={index}>
                      {index}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="flex flex-col relative">
                <label htmlFor="newIndex" className="font-medium mb-1">
                  Enter New Index
                </label>
                <input
                  id="newIndex"
                  value={indexName}
                  onChange={handleInputChange}
                  placeholder="Enter index name"
                  className="border border-gray-400 rounded-md px-3 py-2"
                />

                {/* Suggestions */}
                {(suggestions.length > 0 && inputsFormat.indexName !== indexName) && (
                  <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                    {suggestions.map((sug) => (
                      <li
                        key={sug}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setInputsFormat((prev) => ({
                            ...prev,
                            indexName: indexName + sug,
                          })),
                            setIndexName(indexName + sug)
                        }}
                      >
                        {indexName}
                        <span className="text-gray-400">{sug}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
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
                    index: {
                      ...prev.index,
                      hotPath: e.target.value
                    }
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
                    index: {
                      ...prev.index,
                      coldPath: e.target.value
                    }
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
                    index: {
                      ...prev.index,
                      thawedPath: e.target.value
                    }
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
                    index: {
                      ...prev.index,
                      MAXsize: e.target.value
                    }
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
                    index: {
                      ...prev.index,
                      retentionTime: e.target.value
                    }
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
          {inputsFormat.index.customFields.length > 0 ? (
            inputsFormat.index.customFields.map((field, index) => {
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

        <div>
          <h2 className="text-xl font-semibold mb-2">Inputs Config</h2>
          <hr className="mb-4 text-blue-500" />
        </div>

        <div className="flex flex-col gap-6">
          {inputsConfigList.map((each) => (
            <InputConfig key={each} cancelConfig={cancelConfig} each={each} inputsFormat={inputsFormat} setInputsFormat={setInputsFormat} handleTransforms={handleTransforms} />
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
