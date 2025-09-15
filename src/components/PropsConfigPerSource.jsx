import React from "react";
import { useState, useEffect } from "react";

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

//   const applyConfigToFile = () => {
//   let delimiter = /\r?/; // default = new line

//   // 1. Handle LINE_BREAKER according to props.conf doc
//   switch (configData.lineBreaker) {
//     case "double":
//       delimiter = /\n\n/;
//       break;
//     case "windowsDouble":
//       delimiter = /\r\n\r\n/;
//       break;
//     case "date":
//       delimiter = /(([\r\n]+)\d{4}-\d{2}-\d{2})/; // YYYY-MM-DD
//       break;
//     case "newline":
//     default:
//       delimiter = /\r?\n/;
//       break;
//   }

//   // 2. Split events
//   let events = fileText.split(delimiter).filter(Boolean);

//   // 3. Handle SHOULD_LINEMERGE
//   if (configData.shouldLine === "true") {
//     // Merge all lines into a single event
//     events = [events.join(" ")];
//   }

//   // 4. Handle TRUNCATE (limit event size)
//   if (configData.truncate && Number(configData.truncate) > 0) {
//     events = events.map((ev) => ev.slice(0, Number(configData.truncate)));
//   }

//   // 5. Handle TIME_FORMAT (match based on selected pattern)
//   const processed = events.map((line) => {
//     let date = "";
//     let time = "";
//     let info = line;

//     if (configData.timeFormat === "%Y-%m-%d %H:%M:%S") {
//       const match = line.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/);
//       if (match) {
//         date = match[1];
//         time = match[2];
//         info = line.replace(match[0], "").trim();
//       }
//     } else if (configData.timeFormat === "%m/%d/%Y %H:%M") {
//       const match = line.match(/(\d{2}\/\d{2}\/\d{4}) (\d{2}:\d{2})/);
//       if (match) {
//         date = match[1];
//         time = match[2];
//         info = line.replace(match[0], "").trim();
//       }
//     } else if (configData.timeFormat === "%d-%m-%Y %H:%M:%S") {
//       const match = line.match(/(\d{2}-\d{2}-\d{4}) (\d{2}:\d{2}:\d{2})/);
//       if (match) {
//         date = match[1];
//         time = match[2];
//         info = line.replace(match[0], "").trim();
//       }
//     }

//     // 6. Handle DATETIME_CONFIG (simplified simulation)
//     if (configData.dateTime === "UTC") {
//       date = date ? `${date} (UTC)` : date;
//     } else if (configData.dateTime === "GMT") {
//       date = date ? `${date} (GMT)` : date;
//     } else if (configData.dateTime === "AUTO") {
//       // AUTO means Splunk guesses → just leave unchanged
//     } else if (configData.dateTime === "NONE") {
//       // NONE means Splunk doesn’t extract → wipe out date/time
//       date = "";
//       time = "";
//     } else if (configData.dateTime === "CURRENT") {
     
//         const now = new Date();
//         date = now.toISOString().split("T")[0];
//         time = now.toTimeString().split(" ")[0];
     
//     }

//     return { date, time, info };
//   });

//   setFileLines(processed);
// };

const applyConfigToFile = () => {
  let delimiter = /\r?\n/; // default: newline

  // ✅ 1. Handle LINE_BREAKER
  switch (configData.lineBreaker) {
    case "double":
      delimiter = /\n\n/;
      break;
    case "windowsDouble":
      delimiter = /\r\n\r\n/;
      break;
    case "date":
      delimiter = /\d{4}-\d{2}-\d{2}/; // split at date pattern
      break;
    case "newline":
    default:
      delimiter = /\r?\n/;
      break;
  }

  // ✅ 2. Break file into chunks
  let lines = fileText.split(delimiter).filter(Boolean);

  // ✅ 3. Handle SHOULD_LINE
  if (configData.shouldLine === "true") {
    lines = [lines.join(" ")];
  }

  // ✅ 4. Handle TRUNCATE
  if (configData.truncate && Number(configData.truncate) > 0) {
    lines = lines.map((line) => line.substring(0, Number(configData.truncate)));
  }

  // ✅ 5. Handle TIME_FORMAT + DATETIME_CONFIG
  const processed = lines.map((line) => {
    let date = "";
    let time = "";
    let info = line;

  

    if (configData.timeFormat === "%Y-%m-%d %H:%M:%S") {
      const match = line.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/);
      if (match) {
        date = match[1];
        time = match[2];
        info = line.replace(match[0], "").trim();
      }
    } else if (configData.timeFormat === "%m-%d-%Y %H:%M") {
      const match = line.match(/(\d{2}-\d{2}-\d{4}) (\d{2}:\d{2})/);
      if (match) {
        date = match[1];
        time = match[2];
        info = line.replace(match[0], "").trim();
      }
    } else if (configData.timeFormat === "%d-%m-%Y %H:%M:%S") {
      const match = line.match(/(\d{2}-\d{2}-\d{4}) (\d{2}:\d{2}:\d{2})/);
      if (match) {
        date = match[1];
        time = match[2];
        info = line.replace(match[0], "").trim();
      }
    }

    // 📌 DATETIME_CONFIG overrides
    const now = new Date();
    switch (configData.dateTime) {
      case "CURRENT":
        date = now.toISOString().split("T")[0];
        time = now.toTimeString().split(" ")[0];
        break;

      case "UTC": {
        const utc = new Date(now.toISOString());
        date = utc.toISOString().split("T")[0];
        time = utc.toISOString().split("T")[1].split(".")[0];
        break;
      }

      case "GMT":
        date = now.toUTCString().split(" ").slice(0, 4).join(" ");
        time = now.toUTCString().split(" ")[4];
        break;

      case "US": {
        const us = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
        date = us.toISOString().split("T")[0];
        time = us.toTimeString().split(" ")[0];
        break;
      }

      case "EU": {
        const eu = new Date(now.toLocaleString("en-GB", { timeZone: "Europe/Berlin" }));
        date = eu.toISOString().split("T")[0];
        time = eu.toTimeString().split(" ")[0];
        break;
      }

      case "SA": {
        const sa = new Date(now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));
        date = sa.toISOString().split("T")[0];
        time = sa.toTimeString().split(" ")[0];
        break;
      }

      case "APAC": {
        const apac = new Date(now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
        date = apac.toISOString().split("T")[0];
        time = apac.toTimeString().split(" ")[0];
        break;
      }

      case "AUTO":
        date = now.toISOString().split("T")[0];
        time = now.toLocaleTimeString();
        break;

      case "NONE":
      default:
        // keep whatever we parsed
        break;
    }

    return { date, time, info };
  });

  setFileLines(processed);
};




  useEffect(() => {
    if (fileText) {
      applyConfigToFile();
    }
  }, [configData, fileText]);

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
                    timeFormat: e.target.value,
                  }));
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select TIME_FORMAT</option>
                <option value="%Y-%m-%d %H:%M:%S">YYYY-MM-DD HH:mm:ss</option>
                <option value="%m-%d-%Y %H:%M">MM-DD-YYYY HH:mm</option>
                <option value="%d-%m-%Y %H:%M:%S">DD-MM-YYYY HH:mm:ss</option>
                <option value="epoch">Epoch Time (seconds)</option>
                <option value="iso8601">ISO 8601</option>
                <option value="custom">Custom</option>
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
                    dateTime: e.target.value,
                  }));
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">--Select DATETIME_CONFIG--</option>
                <option value="NONE">NONE</option>
                <option value="AUTO">AUTO</option>
                <option value="CURRENT">CURRENT</option>
                <option value="GMT">GMT</option>
                <option value="UTC">UTC</option>
                <option value="SA">SA</option>
                <option value="US">US</option>
                <option value="EU">EU</option>
                <option value="APAC">APAC</option>
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
                    lineBreaker: e.target.value,
                  }));
                }}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select Line Breaker</option>
                <option value="newline">New Line (\r\n)</option>
                <option value="double">Double New Line (\n\n)</option>
                <option value="windowsDouble">
                  Windows Double New Line (\r\n\r\n)
                </option>
                <option value="date">Date Format (YYYY-MM-DD)</option>
                <option value="custom">Custom</option>
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
                    shouldLine: e.target.value,
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
                    truncate: e.target.value,
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
