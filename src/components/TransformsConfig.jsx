import React from "react";

const TransformsConfig = () => {
  return (
    <div className="flex flex-col mt-3">
      <h2 className="font-bold text-2xl">Transforms Config</h2>
      <hr />
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-2.5 md:flex-row mt-4">
        <div className="border items-start border-gray-200 rounded-2xl p-6 bg-gray-50">
          <div className="flex justify-between items-center">
            <h2>
              Transform: <span className="font-bold">Transform-data</span>
            </h2>
            <button className="bg-red-500 text-white rounded-xl p-2">
              Delete
            </button>
          </div>
          <div className="flex flex-col mt-2">
            <label className="text-blue-700">REGEX</label>
            <textarea className="bg-white border border-gray-300 rounded-xl h-20" />
          </div>
          <div className="flex flex-col mt-2">
            <label className="text-blue-700">FORMAT</label>
            <input className="bg-white border border-gray-300 rounded-xl h-10" />
          </div>
          <div className="flex flex-col mt-2">
            <label className="text-blue-700">DEST_KEY</label>
            <input className="bg-white border border-gray-300 rounded-xl h-10" />
          </div>
        </div>
        <div className="flex flex-col items-start">
          <h1 className="font-semibold text-xl">Transforms Editor</h1>
          <div className="flex flex-col text-center items-start justify-center">
            <input
              type="file"
              className="items-center text-center border border-blue-400 rounded-lg p-2 mt-2"
            />
            <button className="bg-blue-400 text-sm text-white border rounded-lg p-2 mt-2 mb-2">
              Clear All
            </button>
          </div>
          <textarea
            className="h-54 w-full overflow-auto resize-none border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Edit or paste transforms.conf here..."
          />
          <button className="bg-green-400 text-center text-white rounded-lg text-sm mt-2 p-2">
            Download transforms.conf
          </button>
        </div>
        <div className="flex flex-col max-w">
          <h2 className="font-semibold text-xl">Log File</h2>
          <input
            type="file"
            className="items-center text-center border border-blue-400 rounded-lg p-2 mt-2"
          />
          <div className="flex flex-col mt-2">
            <label className="text-blue-700 font-semibold">
              Transform View:
            </label>
            <select className="p-2 border border-blue-400 rounded-lg">
              <option>Routing</option>
              <option>Masking</option>
              <option>Filtering</option>
              <option>All</option>
            </select>
          </div>
          <div className="flex flex-col mt-2">
            <h3 className="text-xl font-semibold mb-2">Logs Output</h3>
            <textarea
              className="h-40 overflow-auto bg-gray-700 text-white rounded-lg p-4"
              placeholder="Upload transforms.conf and log file to see filtered/masked logs here."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformsConfig;
