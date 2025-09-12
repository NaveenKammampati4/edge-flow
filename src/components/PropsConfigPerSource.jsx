import React from "react";
import { useState } from "react";

const PropsConfigPerSource = () => {
  const [file, setFile] = useState(null);
  const [fileText, setFileText] = useState("");
  const [fileLines, setFileLines] = useState([]);
  const [newKeys, setNewKeys] = useState([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const[transformConfig, setTransformConfig]=useState(false);
  const [configData, setConfigData] = useState({
    timeFormat: "",
    dateTime: "",
    lineBreaker: "",
    shouldLine: "",
    truncate: "",
  });
  const [isCopyConfig, setIsCopyConfig]=useState(false);

  function splitLogLine(line) {
    const firstSpace = line.indexOf(" ");
    const secondSpace = line.indexOf(" ", firstSpace + 1);

    const part1 = line.substring(0, firstSpace);
    const part2 = line.substring(firstSpace + 1, secondSpace);
    const part3 = line.substring(secondSpace + 1);

    return [part1, part2, part3];
  }

  const handleReadFile = () => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      const textData = text.split(/\r?\n/).filter(Boolean);
      console.log("hi", textData);
      setFileText(text);
      const processedLines = textData.map((line) => {
        const firstSpace = line.indexOf(" ");
        const secondSpace = line.indexOf(" ", firstSpace + 1);

        const part1 = line.substring(0, firstSpace);
        const part2 = line.substring(firstSpace + 1, secondSpace);
        const part3 = line.substring(secondSpace + 1);

        return { date: part1, time: part2, info: part3 };
      });

      setFileLines(processedLines);
      console.log("processed", processedLines);
    };

    reader.readAsText(file);
  };

  const handleAddingKeys = () => {
    const newData = { key: newKey, value: newValue };
    setNewKeys([...newKeys, newData]);

    if(newKey.toLowerCase()==="transform-"){
      setTransformConfig(true);
    }
    setNewKey("");
    setNewValue("");
  };

  const handleCopyConfig = () => {
    const updates = newKeys.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    setConfigData((prev) => ({
      ...prev,
      ...updates,
    }));
    setIsCopyConfig(true);
  };

  return (
    <div>
      <div className="grid grid-cols-2 justify-between md:flex-row gap-6 mt-2.5">
        <div className="flex-1 p-6 shadow-md rounded-2xl">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Upload Props.conf for{" "}
              <span className="text-indigo-600">[SourceType]</span>
            </h2>
            <div className="flex items-center gap-4">
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type="file"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleReadFile}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
              >
                Apply Changes
              </button>
            </div>
          </div>
          <div className="space-y-4 mt-3.5">
            <div className="flex items-center gap-4">
              <label className="w-40 text-sm font-medium text-gray-700">
                TIME FORMAT
              </label>
              <select
                value={configData.timeFormat}
                onChange={(e) => {
                  setConfigData((prev) => ({
                    ...prev,
                    [timeFormat]: e.target.value,
                  }));
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select TIME_FORMAT</option>
                <option value="option1">YYYY-MM-DD HH:mm:ss</option>
                <option value="option2">MM/DD/YYYY HH:mm</option>
                <option value="option3">DD-MM-YYYY HH:mm:ss</option>
                <option value="">Epoch Time (seconds)</option>
                <option value="">ISO 8601</option>
                <option value="">Custom</option>
              </select>
              <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
                Delete
              </button>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-sm font-medium text-gray-700">
                DATE TIME CONFIG
              </label>
              <select
                value={configData.dateTime}
                onChange={(e) => {
                  setConfigData((prev) => ({
                    ...prev,
                    [dateTime]: e.target.value,
                  }));
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">--Select DATETIME_CONFIG--</option>
                <option value="option1">NONE</option>
                <option value="option2">AUTO</option>
                <option value="option3">CURRENT</option>
                <option value="">GMT</option>
                <option value="">UTC</option>
                <option value="">SA</option>
                <option value="">US</option>
                <option value="">EU</option>
                <option value="">APAC</option>
              </select>
              <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
                Delete
              </button>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-sm font-medium text-gray-700">
                LINE BREAKER
              </label>
              <select
                value={configData.lineBreaker}
                onChange={(e) => {
                  setConfigData((prev) => ({
                    ...prev,
                    [lineBreaker]: e.target.value,
                  }));
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Line Breaker</option>
                <option value="option1">New Line (\r\n)</option>
                <option value="option2">Double New Line (\n\n)</option>
                <option value="option3">
                  Windows Double New Line (\r\n\r\n)
                </option>
                <option value="">Date Format (YYYY-MM-DD)</option>
                <option value="">Custom</option>
              </select>
              <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
                Delete
              </button>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-sm font-medium text-gray-700">
                SHOULD LINE
              </label>
              <select
                value={configData.shouldLine}
                onChange={(e) => {
                  setConfigData((prev) => ({
                    ...prev,
                    [shouldLine]: e.target.value,
                  }));
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
              <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
                Delete
              </button>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-sm font-medium text-gray-700">
                TRUNCATE
              </label>
              <input
                value={configData.truncate}
                onChange={(e) => {
                  setConfigData((prev) => ({
                    ...prev,
                    [truncate]: e.target.value,
                  }));
                }}
                type="number"
                min="0"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
                Delete
              </button>
            </div>
          </div>
          {newKeys.map((each) => (
            <div className="flex items-center gap-4 mt-3.5">
              <label className="w-40 text-sm font-medium text-gray-700">
                {each.key}
              </label>
              <input
                value={each.value}
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
                Delete
              </button>
            </div>
          ))}
          <div className="flex items-center gap-4 mt-3.5">
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              type="text"
              placeholder="New key"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              type="text"
              placeholder="New value"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleAddingKeys}
              className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 focus:ring-2 focus:ring-green-400"
            >
              Add
            </button>
          </div>
          <div className="flex justify-end gap-4 mt-3.5">
            <button
              onClick={handleCopyConfig}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:ring-2 focus:ring-gray-300"
            >
              Copy Config
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400">
              Apply Changes
            </button>
          </div>
        </div>

        <div className="p-6  shadow-md rounded-2xl space-y-6">
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Raw File Preview before Props
            </h3>
            <pre className="h-54 overflow-auto resize-none border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {fileText}
            </pre>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Customized Props File Preview After Props Update
            </h3>
            <div className="h-64 overflow-y-auto border border-gray-300 rounded-lg p-3 text-sm bg-white shadow">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border border-gray-300 text-sm font-semibold">
                      Date Time
                    </th>
                    <th className="px-4 py-2 border border-gray-300 text-sm font-semibold">
                      Event Logs
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {fileLines.map((each) => (
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-300">
                        {each.date} {each.time}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">
                        {each.info}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Generated Props.conf
            </h3>
            {isCopyConfig && <pre className=" h-44  overflow-auto w-96 resize-none border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {JSON.stringify(configData, null, 2)}
            </pre>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropsConfigPerSource;
