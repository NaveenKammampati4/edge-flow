import React, { use } from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import  PropsConfigPerSource  from './PropsConfigPerSource';

const UniversalForwarder = ({
  setUfTokenDetails,
  ufTokenDetails,
  inputsFormat,
  setInputsFormat,
  syslogFile,
  handleTransforms
}) => {
  const [ufToken, setUfToken] = useState(false);
  const [files, setFiles] = useState([]);
  const [pathInput, setPathInput] = useState("");
  const [showPathInput, setShowPathInput] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
 const sourceType = ufTokenDetails?.sourceType || "";
  const propsExists = inputsFormat?.props?.[sourceType];

  const applyPathToSelected = () => {
    const hasSelected = files.some(f => f.selected);
    if (!hasSelected || !pathInput.trim()) {
      return;
    }
    setFiles(prev =>
      prev.map(item =>
        item.selected
          ? { ...item, path: pathInput.trim(), selected: false }
          : item
      )
    );

    setPathInput("");
    setShowPathInput(false);
  };
  const generateToken = () => {
    if (!ufTokenDetails.indexName.trim()) return;
    if (!ufTokenDetails.sourceType.trim()) return;
    const allHavePath = files.length > 0 && files.every(f => f.path);
    if (!allHavePath) return;
    setUfToken(true);
  };
  const saveEditPath = () => {
    setFiles(prev =>
      prev.map((item, i) =>
        i === editingIndex
          ? { ...item, path: editValue }
          : item
      )
    );

    setEditingIndex(null);
    setEditValue("");
  };
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    const newFiles = selectedFiles
      .filter(
        (newFile) =>
          !files.some(
            (existing) =>
              existing.file.name === newFile.name &&
              existing.file.size === newFile.size
          )
      )
      .map((file) => ({
        file,
        selected: false,
        path: ""
      }));

    setFiles((prev) => [...prev, ...newFiles]);
    e.target.value = "";
  };
  const toggleSelect = (index) => {
    setFiles((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };
  return (
    <div className='w-full flex flex-col justify-start items-start gap-1'>
      <h2 className='self-center font-bold'>Create Config</h2>

      <div className="w-full border border-gray-300 rounded-lg px-4 py-3 space-y-3">

        {/* Header Row */}
        <div className="flex items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold whitespace-nowrap">
              Upload Files
            </span>

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="text-sm"
            />
          </div>

          {files.length > 0 && (
            <button
              onClick={clearAllFiles}
              className="ml-auto bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* File Cards */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-3">

            {files.map((item, index) => (
              <div
                key={`${item.file.name}-${item.file.size}-${index}`}
                className="bg-gray-100 rounded-md px-3 py-2 text-sm flex flex-col gap-1"
              >

                {/* Top Row */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    disabled={!!item.path}
                    onChange={() => toggleSelect(index)}
                  />

                  <span className="font-medium truncate max-w-[200px]">
                    {item.file.name}
                  </span>

                  <button
                    onClick={() => removeFile(index)}
                    className="ml-auto bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded text-xs"
                  >
                    Delete
                  </button>
                </div>

                {/* Path Section */}
                {item.path && editingIndex !== index && (
                  <div className="flex items-center gap-3 ml-6">
                    <span className="text-xs text-gray-600">
                      Path: {item.path}
                    </span>

                    <button
                      onClick={() => {
                        setEditingIndex(index);
                        setEditValue(item.path);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-0.5 rounded text-xs"
                    >
                      Edit
                    </button>
                  </div>
                )}

                {/* Edit Input */}
                {editingIndex === index && (
                  <div className="flex items-center gap-3 ml-6 mt-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs w-64"
                    />

                    <button
                      onClick={saveEditPath}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-0.5 rounded text-xs"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingIndex(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-0.5 rounded text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                )}

              </div>
            ))}

          </div>
        )}
        {files.length > 0 && (
          <div className="flex items-center mt-3">
            {/* <button
              onClick={() => setShowPathInput(true)}
              className="ml-auto bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
            >
              Add Path
            </button> */}
            <button
              onClick={() => setShowPathInput(true)}
              disabled={!files.some(f => f.selected)}
              className={`ml-auto px-3 py-1 rounded text-xs text-white 
    ${files.some(f => f.selected)
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"}`}
            >
              Add Path
            </button>
          </div>
        )}
        {showPathInput && (
          <div className="flex items-center gap-3 mt-2">
            <input
              type="text"
              placeholder="Enter file path"
              value={pathInput}
              onChange={(e) => setPathInput(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm w-64"
            />

            <button
              onClick={applyPathToSelected}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
            >
              Apply
            </button>
          </div>
        )}

      </div>

      {/* <input
        value={ufTokenDetails.indexName}
        id="indexName"
        placeholder="Enter Index Name"
        onChange={(e) => setUfTokenDetails({ ...ufTokenDetails, indexName: e.target.value })}
        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
      />
      <input
        value={ufTokenDetails.sourceType}
        id="sourceType"
        placeholder="Enter Source Type"
        onChange={(e) => setUfTokenDetails({ ...ufTokenDetails, sourceType: e.target.value })}
        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
      /> */}

      <div className="w-full">
        <label className="text-sm font-medium">Index Name</label>
        <input
          value={ufTokenDetails.indexName}
          readOnly
          className="w-full border border-gray-300 rounded-lg bg-gray-100 px-3 py-2"
        />
      </div>

      <div className="w-full">
        <label className="text-sm font-medium">Source Type</label>
        <input
          value={ufTokenDetails.sourceType}
          readOnly
          className="w-full border border-gray-300 rounded-lg bg-gray-100 px-3 py-2"
        />
      </div>

      {propsExists && (
        <div className="w-full mt-6">
          <h2 className="items-center font-semibold text-xl mb-1">
            Props Config Per Source Type
          </h2>

          <hr className="text-blue-500 mb-3" />

          <PropsConfigPerSource
            sourceType={sourceType}
            inputsFormat={inputsFormat}
            setInputsFormat={setInputsFormat}
            syslogFile={syslogFile}
            each={1}
            handleTransforms={handleTransforms}
          />
        </div>
      )}

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        onClick={generateToken}
      >
        Generate Config
      </button>

      {/* {ufToken && <div className='w-full p-4 bg-gray-100 rounded-lg mt-4'>
        <h3 className='font-bold mb-2'>UF Token:</h3>
        <p>[monitor:///var/log/syslog]</p>
        <p>index={ufTokenDetails.indexName}</p>
        <p>sourcetype={ufTokenDetails.sourceType}</p>
        <p>disabled = false</p>
      </div>} */}

      {ufToken && (
        <div className='w-full p-4 bg-gray-100 rounded-lg mt-4'>
          <h3 className='font-bold mb-2'>Input Config</h3>

          {[...new Set(files
            .filter(f => f.path)        // only files that have path
            .map(f => f.path)           // take only path
          )].map((path, i) => (
            <div key={i} className="mb-4">
              <p>[monitor:{path}]</p>
              <p>index={ufTokenDetails.indexName}</p>
              <p>sourcetype={ufTokenDetails.sourceType}</p>
              <p>disabled = false</p>
            </div>
          ))}

        </div>
      )}
    </div>
  )
}

export default UniversalForwarder