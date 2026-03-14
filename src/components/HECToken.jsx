import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';

export const HECToken = ({ setHecTokenDetails, hecTokenDetails }) => {
  const [curlCommand, setCurlCommand] = useState("");
  const [files, setFiles] = useState([]);


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setHecTokenDetails((prevDetails) => ({ ...prevDetails, [id]: value }));
  };

  // Add multiple files (append mode)
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    // Prevent duplicate file names
    const newFiles = selectedFiles.filter(
      (newFile) =>
        !files.some(
          (existing) =>
            existing.name === newFile.name &&
            existing.size === newFile.size
        )
    );
    setFiles((prev) => [...prev, ...newFiles]);
    // Reset input so same file can be re-selected later
    e.target.value = null;
  };

  // Remove single file
  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }
  // Clear all files
  const clearAllFiles = () => {
    setFiles([]);
  };

  const generateHecToken = async () => {
    axios.post("http://127.0.0.1:5000/create-hecToken", {
      token_name: hecTokenDetails.tokenName,
      index_name: hecTokenDetails.indexName,
      sourcetype: hecTokenDetails.sourceType
    })
      .then(res => {
        console.log("Token:", res.data);
        setCurlCommand(res.data.curl_command);
      })
      .catch(err => {
        console.error(err);
      });

  };

  return (
    <div className='w-full flex flex-col justify-start items-start gap-1'>
      <h2 className='self-center font-bold'>Create HEC Token</h2>

      {/* File Upload Section */}
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

        {/* File Cards Section */}
        {files.length > 0 && (
          <div className="flex flex-wrap gap-3">

            {files.map((file, index) => (
              <div
                key={`${file.name}-${file.size}-${index}`}
                className="bg-gray-100 rounded-md px-3 py-2 text-sm flex items-center gap-4"
              >
                <span className="font-medium truncate max-w-[180px]">
                  {file.name}
                </span>

                <button
                  onClick={() => removeFile(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-0.5 rounded text-xs"
                >
                  Delete
                </button>
              </div>
            ))}

          </div>
        )}

      </div>
      <input
        value={hecTokenDetails.tokenName}
        onChange={handleInputChange}
        id="tokenName"
        placeholder="Enter Token Name"
        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
      />

      <input
        value={hecTokenDetails.indexName}
        onChange={handleInputChange}
        id="indexName"
        placeholder="Enter Index Name"

        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
      />
      <input
        value={hecTokenDetails.sourceType}
        onChange={handleInputChange}
        id="sourceType"
        placeholder="Enter Source Type"
        className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
      />

      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        // onClick={handleCreateApp}
        onClick={generateHecToken}
      >
        Generate HEC Token
      </button>




      <h4>Test event using curl (HEC – port 8088)</h4>
      <div className='w-full border border-black-300 rounded-lg px-3 py-2 text-wrap overflow-auto'>

        {curlCommand && <div className='w-full p-4 bg-gray-100 rounded-lg mt-4'>
          <h3 className='font-bold mb-2'>HEC Token:</h3>
          <p>[monitor:///var/log/syslog]</p>
          <p>Token Name={hecTokenDetails.tokenName}</p>
          <p>index Name={hecTokenDetails.indexName}</p>
          <p>sourcetype={hecTokenDetails.sourceType}</p>
          <p>disabled = false</p>
        </div>}

        <pre>{curlCommand}</pre>

      </div>
    </div>
  )
}
