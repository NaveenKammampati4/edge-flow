import React from "react";
import PropsConfigPerSource from "./PropsConfigPerSource";
import { useState, useEffect } from "react";
import TransformsConfig from "./TransformsConfig";
import { IndexConfig } from "./IndexConfig";

const InputConfig = ({ cancelConfig, each, inputsFormat, setInputsFormat, handleTransforms }) => {
  const [inputsConfigData, setInputsConfigData] = useState({
    filePath: "",
    sourceType: "",
    index: "",
  });
  //  const [customConfig, setCustomConfig] = useState(1);

  // const[customField, setCustomField]=useState(false);
  // const[cancelCustomField, setCancelCustomField]=useState(false);
  const [inputCustomFields, setInputCustomFields] = useState(inputsFormat.inputs[each - 1].customFields);
  const [newkey, setNewKey] = useState("");
  const [value, setValue] = useState("");
  const [mode, setMode] = useState("appName");
  const [indexName, setIndexName] = useState("");
  const [suggestions, setSuggestions] = useState([]);

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

  useEffect(()=>{
    setInputsFormat((prev) => {
      const updatedInputs = [...prev.inputs];
      updatedInputs[each - 1] = { ...updatedInputs[each - 1], index: inputsFormat.indexName }; 
      return {
        ...prev,
        inputs: updatedInputs,
        
      };


    })
  },[inputsFormat.indexName])


  const handleAddCustomField = () => {
    // setInputCustomFields([...inputCustomFields, { key: "", value: "" }]);
    if (newkey !== "" && value !== "") {
      setInputsFormat((prev) => {
        const updatedInputs = [...prev.inputs];
        console.log("update", updatedInputs[each - 1]);

        const updatedCustomInputs = [
          ...updatedInputs[each - 1].customFields,
          { [newkey]: value }
        ];

        updatedInputs[each - 1] = {
          ...updatedInputs[each - 1],
          customFields: updatedCustomInputs
        };

        return {
          ...prev,
          inputs: updatedInputs
        };
      });
    }
    else {
      setInputsFormat((prev) => {
        const updatedInputs = [...prev.inputs];
        console.log("update", updatedInputs[each - 1]);

        const updatedCustomInputs = [
          ...updatedInputs[each - 1].customFields,
          {}
        ];

        updatedInputs[each - 1] = {
          ...updatedInputs[each - 1],
          customFields: updatedCustomInputs
        };

        return {
          ...prev,
          inputs: updatedInputs
        };
      });
    }
    setNewKey("");
    setValue("");

  };

  const deleteCustomField = (delVal) => {
    const updatedCustomFileds = inputsFormat.inputs[each - 1].customFields.filter((each, index) => index !== delVal);
    console.log("updatedCustomFileds", updatedCustomFileds);
    setInputsFormat((prev) => {
      const updatedInputs = [...prev.inputs];
      console.log("update", updatedInputs[each - 1]);
      updatedInputs[each - 1] = {
        ...updatedInputs[each - 1],
        customFields: updatedCustomFileds
      };

      return {
        ...prev,
        inputs: updatedInputs
      };
    });
  }

  const handleRemoveCustomField = (index) => {
    const updatedFields = inputCustomFields.filter((_, i) => i !== index);
    setInputCustomFields(updatedFields);
  };

  const handleChange = (index, field, value) => {
    const updatedFields = [...inputCustomFields];
    updatedFields[index][field] = value;
    setInputCustomFields(updatedFields);
  };

  // const handleCustomFields=()=>{
  //   setCustomConfig(customConfig + 1);
  //   setCustomField(true);
  //   setCancelCustomField(false);
  // }
  const item = inputsFormat.inputs[each - 1];
  console.log("itemsinput : ", inputsFormat.inputs);

  const addNewIndex = (value) => {
    setInputsFormat((prev) => {
      const updatedInputs = [...prev.inputs];
      updatedInputs[each - 1] = { ...updatedInputs[each - 1], index: value }; 
      return {
        ...prev,
        inputs: updatedInputs,
        indexConfig:{...prev.indexConfig,
                        [value]:{
                        hotPath: "",
                        coldPath: "",
                        thawedPath: "",
                        MAXsize: "",
                        retentionTime: "",
                        customFields: []
                      }}
      };


    })
  };

  const updateIputs = (e) => {
    const { name, value } = e.target;
    console.log("name", name);
    console.log("value", value);
    setInputsFormat((prev) => {
      const updatedInputs = [...prev.inputs];
      updatedInputs[each - 1] = { ...updatedInputs[each - 1], [name]: value }; 
      return {
        ...prev,
        inputs: updatedInputs
      };


    })
  };

  const addProps = () => {
    let sType = inputsFormat.inputs[each - 1].sourceType;
    console.log(sType);

    setInputsFormat((prev) => {
      let updateProps = { ...prev.props };
      updateProps = {
        ...updateProps, [sType]: {

          timeFormat: "",
          dateTime: "",
          lineBreaker: "",
          shouldLine: "",
          truncate: "",

        }
      };
      return {
        ...prev,
        props: updateProps,
        // props: updatedProps,
      };
    })
  }

  const addField = () => {
    let sTypeField = inputsFormat.inputs[each - 1].customFields;
    console.log("file : ", sTypeField);

    setInputsFormat((prev) => {
      let updateField = { ...prev.inputs };
      updateField = {
        ...updateField, [sTypeField]: {
          inputKey: "",
          inputValue: "",


        }
      };
      return {
        ...prev,
        props: updateField,
        // props: updatedProps,
      };
    })

  }

  console.log(inputsFormat)


  console.log("length : ", inputsFormat.inputs.length);

  return (
    <div>
      <div className="flex flex-col shadow-md rounded-2xl p-6 w-full">
        <div className="flex flex-wrap gap-2 ">
          <div className="flex flex-col w-48 min-w-[150px]">
            <label className="text-sm font-medium text-gray-700 mb-1">
              File Path
            </label>
            <input

              value={item.filePath}
              name="filePath"
              onChange={(e) => updateIputs(e)}
              type="text"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter file path"
            />
          </div>
          <div className="flex flex-col w-48 min-w-[150px]">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Source Type
            </label>
            <input
              name="sourceType"
              value={item.sourceType}
              onChange={(e) => updateIputs(e)}
              type="text"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter source type"
            />
          </div>
          <div className="flex flex-col w-48">
                <label htmlFor="appIndex" className=" text-sm font-medium text-gray-700  mb-1">
                  Index (from App Name)
                </label>
                <input
                  id="appIndex"
                  type="text"
                  value={inputsFormat.indexName || ""}
                  readOnly
                  className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                  placeholder="App Name’s index"
                />

                
              </div>
          {/* <div className="flex flex-col w-1/4 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Index (Optional)
            </label>
            <input
              // onChange={(e) =>
              //   setInputsConfigData((prev) => ({
              //     ...prev,
              //     index: e.target.value,
              //   }))
              // }
              name="index"
              value={item.index}
              onChange={(e) => updateIputs(e)}
              type="text"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter index"
            />
          </div> */}

          {/* <div className="flex flex-col rounded-lg p-4 space-y-3">
            <div className="flex space-x-6">
              
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="indexMode"
                  value="existing"
                  checked={mode === "existing"}
                  onChange={() => {
                    setMode("existing");
                    
                  }}
                  className="accent-blue-600"
                />
                <span>Existing Index</span>
              </label>

              
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="indexMode"
                  value="new"
                  checked={mode === "new"}
                  onChange={() => {
                    setMode("new");
                    
                  }}
                  className="accent-blue-600"
                />
                <span>New Index</span>
              </label>

              
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                <input
                  type="radio"
                  name="indexMode"
                  value="appName"
                  checked={mode === "appName"}
                  onChange={(e) => {
                    const selectedIndex = e.target.value;
                    setMode("appName");
                  }}
                  className="accent-blue-600"
                />
                <span>As of App Name</span>
              </label>
            </div>

            
            {mode === "appName" && (
              <div className="flex flex-col w-48">
                <label htmlFor="appIndex" className=" text-sm font-medium text-gray-700  mb-1">
                  Index (from App Name)
                </label>
                <input
                  id="appIndex"
                  type="text"
                  value={inputsFormat.indexName || ""}
                  readOnly
                  className="border border-gray-400 rounded-md px-3 py-2"
                  placeholder="App Name’s index"
                />
              </div>
            )}

            {mode === "existing" && (
              <div className="flex flex-col w-48">
                <label htmlFor="existingIndex" className="text-sm font-medium text-gray-700 mb-1">
                  Select Existing Index
                </label>
                <select
                  id="existingIndex"
                  className="border border-gray-400 rounded-md px-3 py-2"
                  
                  name="index"
                  onChange={(e) => updateIputs(e)}
                >
                  <option value="">-- Choose an index --</option>
                  {existingIndexes.map((index) => (
                    <option key={index} value={index}>
                      {index}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {mode === "new" && (
              <div className="flex flex-col relative w-48">
                <label htmlFor="newIndex" className="text-sm font-medium text-gray-700 mb-1">
                  Enter New Index
                </label>
                <input
                  id="newIndex"
                  value={indexName}
                  onChange={handleInputChange}
                  placeholder="Enter index name"
                  className="border border-gray-400 rounded-md px-3 py-2"
                />
               
                {suggestions.length > 0 && inputsFormat.inputs[each-1].index !== indexName && (
                  <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                    {suggestions.map((sug) => (
                      <li
                        key={sug}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          addNewIndex(indexName + sug),
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
          </div> */}

          
          <div className="flex flex-col">
            <div className="flex flex-row gap-2 mt-6">
              <button
                onClick={addProps}
                className=" bg-blue-500 text-white px-3 py-2 rounded-lg shadow hover:bg-blue-600 cursor-pointer"
              >
                Add Props
              </button>
              <button
                onClick={() => cancelConfig(each)}
                className=" px-3 py-2 cursor-pointer rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
              >
                Cancel
              </button>

              
            </div>
          </div>
        </div>
        <div className=" border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1.9">
            Custom Fields
          </h3>

          <div className="flex flex-row gap-2">
            <input
              onChange={(e) => setNewKey(e.target.value)}
              value={newkey}
              type="text"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              placeholder="Key"
            />
            <input
              onChange={(e) => setValue(e.target.value)}
              value={value}
              type="text"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              placeholder="Value"
            />
            <div>
              <button
                onClick={handleAddCustomField}
                className="p-2 ml-2 max-w-20 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>


          {inputsFormat.inputs[each - 1].customFields.length > 0 ? (
            inputsFormat.inputs[each - 1].customFields.map((field, index) => {
              const key = Object.keys(field)[0];
              const value = field[key];
              return <div className="flex flex-row gap-2 mt-2">
                <input
                  onChange={(e) => setNewKey(e.target.value)}
                  value={key}
                  type="text"
                  className="px-3 py-2 w-48 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Key"
                />
                <input
                  onChange={(e) => setValue(e.target.value)}
                  value={value}
                  type="text"
                  className="px-3 py-2 w-48 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Value"
                />
                <div>
                  <button
                    onClick={() => deleteCustomField(index)}
                    className="p-2 ml-2 max-w-20 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  {/* <button
                    onClick={addField}
                    className="p-2 ml-4 max-w-20 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition cursor-pointer"
                  >
                    Add
                  </button> */}
                </div>

              </div>
            })
          ) : (
            <p className="text-sm mt-2 ml-1">No Custom fields added yet.</p>
          )}

        </div>
      </div>
       {/* {inputsFormat.inputs[each-1].index &&
                
                  <IndexConfig key={inputsFormat.inputs[each-1].index} indexName={inputsFormat.inputs[each-1].index} inputsFormat={inputsFormat} setInputsFormat={setInputsFormat} />
                
              } */}
      <h2 className="items-center font-semibold text-xl  mb-1 mt-5">
        Props Config Per Source Type
      </h2>
      <hr className="text-blue-500" />
      <div>
        {inputsFormat.props[inputsFormat.inputs[each - 1].sourceType] && (
          <PropsConfigPerSource
            key={each}
            each={each}
            sourceType={item.sourceType}
            inputsFormat={inputsFormat}
            setInputsFormat={setInputsFormat}
            handleTransforms={handleTransforms}
          />
        )}
      </div>
      {/* <TransformsConfig/> */}
    </div>
  );
};

export default InputConfig;
