import React, { use } from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';

const UniversalForwarder = ({ setUfTokenDetails, ufTokenDetails }) => {
  const [ufToken, setUfToken] = useState(false);

  const uploadNewFile = (e, index) => {

    let uftFiles = ufTokenDetails.files;
    uftFiles[index] = e.target.value;

    setUfTokenDetails((prev) => ({
      ...prev,
      files: uftFiles
    }))
  }

  console.log("uftFiles", ufTokenDetails);
  return (
    <div className='w-full flex flex-col justify-start items-start gap-1'>
      <h2 className='self-center font-bold'>Create UF Token</h2>


      <input
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
      />

      {
        ufTokenDetails.files.map((each, index) => <input
          type='text'
          onChange={(e) => uploadNewFile(e, index)}
          id="sourceType"
          placeholder="Enter file path"

          className="w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
        />)
      }

      <button
        onClick={() =>
          setUfTokenDetails((prev) => ({
            ...prev,
            files: [...prev.files, ""],
          }))
        }
        className="bg-blue-600 p-2 border text-white rounded-2xl self-end"
      >
        Add File
      </button>


      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
        onClick={() => setUfToken(true)}
      >
        Generate UF Token
      </button>

      {ufToken &&
        <div  className="w-full p-4 bg-gray-100 rounded-lg mt-4">
          <h3 className="font-bold mb-2">UF Token:</h3>
          {ufTokenDetails.files.map((each)=><div className='mb-3'>
            <p>[monitor:{each}]</p>
          <p>index={ufTokenDetails.indexName}</p>
          <p>sourcetype={ufTokenDetails.sourceType}</p>
          <p>disabled = false</p>
          </div>)}
        </div>
      }
    </div>
  )
}

export default UniversalForwarder