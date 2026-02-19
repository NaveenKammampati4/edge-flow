import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';

export const HECToken = ({setHecTokenDetails, hecTokenDetails}) => {
  const[curlCommand, setCurlCommand] = useState("");

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setHecTokenDetails((prevDetails) => ({  ...prevDetails, [id]: value }));
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
