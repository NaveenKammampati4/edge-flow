import React from "react";
import PropsConfigPerSource from "./PropsConfigPerSource";
import { useState } from "react";
import TransformsConfig from "./TransformsConfig";

const InputConfig = ({ cancelConfig, each }) => {
  const [inputsConfigData, setInputsConfigData] = useState({
    filePath: "",
    sourceType: "",
    index: "",
  });

  const[customField, setCustomField]=useState(false);
  const[cancelCustomField, setCancelCustomField]=useState(false);

  const handleCustomFields=()=>{
    setCustomField(true);
    setCancelCustomField(false);
  }
  return (
    <div>
      <div className="flex flex-col shadow-md rounded-2xl p-6 w-full">
        <div className="flex flex-wrap gap-6 mb-4">
          <div className="flex flex-col w-1/4 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-1">
              File Path
            </label>
            <input
              value={inputsConfigData.filePath}
              onChange={(e) =>
                setInputsConfigData((prev) => ({
                  ...prev,
                  filePath: e.target.value,
                }))
              }
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
              onChange={(e) =>
                setInputsConfigData((prev) => ({
                  ...prev,
                  sourceType: e.target.value,
                }))
              }
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
              onChange={(e) =>
                setInputsConfigData((prev) => ({
                  ...prev,
                  index: e.target.value,
                }))
              }
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
          </div>
        </div>
        <div className=" border-gray-200 pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Custom Fields
          </h3>
          {
            customField && !cancelCustomField ? <div className="grid grid-cols-[1fr_3fr_1fr] gap-2.5 mb-2.5">
              <input type="text" className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Key"/> 
              <input type="text" className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Value"/>
              <button onClick={()=>setCancelCustomField(true)} className="p-2 ml-4 max-w-20 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition cursor-pointer">Cancel</button>
            </div> : <p className="text-sm mb-2.5">No Custom fields added yet.</p>
          }
          <button onClick={handleCustomFields} className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 cursor-pointer">Add Custom Field</button>
        </div>
      </div>
      <h2 className="items-center font-semibold text-xl mt-1 mb-1">
        Props Config Per Source Type
      </h2>
      <hr className="text-blue-500" />
      <div>
        {inputsConfigData.sourceType !== "" && <PropsConfigPerSource />}
      </div>
      {/* <TransformsConfig/> */}
      
    </div>
  );
};

export default InputConfig;
