import React from "react";
import PropsConfigPerSource from "./PropsConfigPerSource";
import { useState } from "react";
import TransformsConfig from "./TransformsConfig";

const InputConfig = ({ cancelConfig, each, inputsFormat, setInputsFormat, handleTransforms }) => {
  const [inputsConfigData, setInputsConfigData] = useState({
    filePath: "",
    sourceType: "",
    index: "",
  });
  //  const [customConfig, setCustomConfig] = useState(1);

  // const[customField, setCustomField]=useState(false);
  // const[cancelCustomField, setCancelCustomField]=useState(false);
  const [inputCustomFields, setInputCustomFields] = useState(inputsFormat.inputs[each-1].customFields);
  const [key, setKey]=useState("");
  const [value, setValue]=useState("");

  const handleAddCustomField = () => {
    // setInputCustomFields([...inputCustomFields, { key: "", value: "" }]);
    if(key!=="" && value!==""){
      setInputsFormat((prev) => {
  const updatedInputs = [...prev.inputs];
  console.log("update", updatedInputs[each - 1]);

  const updatedCustomInputs = [
    ...updatedInputs[each - 1].customFields,
    {[key]:value}
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
    else{
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

  };

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

  const updateIputs = (e) => {
    const { name, value } = e.target;
    console.log("name", name);
    console.log("value", value);
    setInputsFormat((prev) => {
      const updatedInputs = [...prev.inputs];
      updatedInputs[each - 1] = { ...updatedInputs[each - 1], [name]: value }; // update only sourceType
      // return { ...prev, customInput: updated };
      console.log("updatedInputs : ", updatedInputs);
    
    //  let updatedProps = [ ...prev.props ];
    // if (name === "sourceType" && value) {
    //   // setInputsFormat((prev) => {
    //   //   const updated = [...prev.props];
    //   //   updated[each - 1] = { ...updated[each - 1], [name]: value }; // update only sourceType
    //   //   return { ...prev, props: updated };
    //   // });
    //   if (!updatedProps[each-1]) {
    //     updatedProps[each-1] ={[value]: {
    //       timeFormat: "",
    //       dateTime: "",
    //       lineBreaker: "",
    //       shouldLine : "",
    //       truncate: "",
    //     }};
    //   }
    // }

    //    console.log("updatedProps : ", updatedProps);
    return {
      ...prev,
      inputs: updatedInputs,
      // props: updatedProps,
    };


    })
  };

  const addProps=()=>{
    let sType=inputsFormat.inputs[each-1].sourceType;
    console.log(sType);

    setInputsFormat((prev)=>
    {
      let updateProps={...prev.props};
      updateProps={...updateProps, [sType]:{ 
   
    timeFormat: "",
    dateTime: "",
    lineBreaker: "",
    shouldLine: "",
    truncate: "",
    
  }};
  return {
      ...prev,
      props: updateProps,
      // props: updatedProps,
    };
    })
  }

  const addField = () => {
    let sTypeField=inputsFormat.inputs[each-1].customFields;
    console.log("file : " ,sTypeField);

    setInputsFormat((prev)=>
    {
      let updateField={...prev.inputs};
      updateField={...updateField, [sTypeField]:{ 
       inputKey : "",
       inputValue : "",
   
    
  }};
  return {
      ...prev,
      props: updateField,
      // props: updatedProps,
    };
    })

  }

  console.log(inputsFormat)

  return (
    <div>
      <div className="flex flex-col shadow-md rounded-2xl p-6 w-full">
        <div className="flex flex-wrap gap-6 mb-4">
          <div className="flex flex-col w-1/4 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-1">
              File Path
            </label>
            <input
              // value={inputsConfigData.filePath}
              value={item.filePath}
              // onChange={(e) =>
              //   setInputsConfigData((prev) => ({
              //     ...prev,
              //     filePath: e.target.value,
              //   }))
              // }
              name="filePath"
              onChange={(e) => updateIputs(e)}
              type="text"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter file path"
            />
          </div>
          <div className="flex flex-col w-1/4 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Source Type
            </label>
            <input
              // onChange={(e) =>
              //   setInputsConfigData((prev) => ({
              //     ...prev,
              //     sourceType: e.target.value,
              //   }))
              // }
              name="sourceType"
              value={item.sourceType}
              onChange={(e) => updateIputs(e)}
              type="text"
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter source type"
            />
          </div>
          <div className="flex flex-col w-1/4 min-w-[200px]">
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
          </div>
          <div className="flex items-end">
            <button
              onClick={() => cancelConfig(each)}
              className="px-4 py-2 cursor-pointer rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
            >
              Cancel
            </button>
          
          <button
          onClick={addProps}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 cursor-pointer ml-2"
          >Add Props</button>
          </div>
        </div>
        <div className=" border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Custom Fields
          </h3>

          {inputsFormat.inputs[each-1].customFields.length > 0 ? (
            inputsFormat.inputs[each-1].customFields.map((field, index) => (
              <div className="grid grid-cols-[1fr_3fr_1fr] gap-2.5 mb-2.5">
                <input
                  onChange={(e)=>setKey(e.target.value)}
                  value={key}
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Key"
                />
                <input
                  onChange={(e)=>setValue(e.target.value)}
                  value={value}
                  type="text"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Value"
                />
                <div>
                <button
                  onClick={() => handleRemoveCustomField(index)}
                  className="p-2 ml-4 max-w-20 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                   onClick={addField}
                  className="p-2 ml-4 max-w-20 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition cursor-pointer"
                >
                  Add
                </button>
                </div>
                
              </div>
            ))
          ) : (
            <p className="text-sm mb-2.5">No Custom fields added yet.</p>
          )}
          <button
            onClick={handleAddCustomField}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 cursor-pointer"
          >
            Add Custom Field
          </button>
        </div>
      </div>
      <h2 className="items-center font-semibold text-xl mt-1 mb-1">
        Props Config Per Source Type
      </h2>
      <hr className="text-blue-500" />
      <div>
        {inputsFormat.props[inputsFormat.inputs[each-1].sourceType] && (
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
