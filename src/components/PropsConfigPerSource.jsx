import React from "react";
import { useState, useEffect } from "react";
import TransformsConfig from "./TransformsConfig";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc';
import { DateTime } from 'luxon';

const PropsConfigPerSource = ({
  sourceType,
  inputsFormat,
  setInputsFormat,
  each,
  handleTransforms,
}) => {
  const [file, setFile] = useState(null);
  const [fileText, setFileText] = useState("");
  const [fileLines, setFileLines] = useState([]);
  const [newKeys, setNewKeys] = useState([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [transformConfig, setTransformConfig] = useState(false);
  const [transforms, setTransforms] = useState([]);
  const [configData, setConfigData] = useState({
    timeFormat: "",
    dateTime: "",
    lineBreaker: "",
    shouldLine: "",
    truncate: "",
  });
  const [isCopyConfig, setIsCopyConfig] = useState(false);

  console.log("each", each);
  console.log("inputss : ", inputsFormat);
  const sourceTypes = inputsFormat.inputs[each - 1].sourceType;
  console.log("sourceType", sourceTypes);
  let itemList = [];
  itemList = inputsFormat.props[sourceTypes];
  // const filteredEntries = Object.entries(item).filter(([key]) => key !== 'newKey' && key !== 'newValue');
  // console.log("filteredEntries", filteredEntries)


  console.log("items", itemList);
  const itemListTransform=Object.keys(itemList);
  console.log("itemListTransform",itemListTransform);





  const updateIputs = (e) => {
    const { name, value } = e.target;
    console.log("name", name);
    console.log("value", value);
    console.log("inputs config", inputsFormat);
    setInputsFormat((prev) => {
      const updated = { ...prev.props };
      console.log("updated", updated);
      let updateSource = { ...updated[sourceType], [name]: value }
      updated[sourceTypes] = { ...updateSource }; // update only sourceType
      return { ...prev, props: updated };

    });
    if (["regex", "format", "destKey", "newKey"].includes(name)) {
      setInputsFormat((prev) => {
        const updated = [...prev.transform];
        updated[each - 1] = { ...updated[each - 1], [name]: value }; // update only sourceType
        return { ...prev, transform: updated };
      });
    }

  };

  const applyConfigToFile = () => {
  let delimiter = /\r?\n/; // default: newline
  console.log("item : ", itemList);

  // 1️⃣ Handle LINE_BREAKER
  switch (itemList.lineBreaker) {
    case "double":
      delimiter = /\n\n/;
      break;
    case "windowsDouble":
      delimiter = /\r\n\r\n/;
      break;
    case "date":
      delimiter = /\d{4}-\d{2}-\d{2}/;
      break;
    case "newline":
    default:
      delimiter = /\r?\n/;
      break;
  }

  // 2️⃣ Match all log formats
  let lines = fileText.match(
    /(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [A-Z]+ .*?\(user=.*?\))|(?:\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] [A-Z]+: .*? \| user=.*?)/g
  ) || [];

  // 3️⃣ Handle SHOULD_LINE
  if (itemList.shouldLine === "true") {
    lines = [lines.join(" ")];
  }

  // 4️⃣ Handle TRUNCATE
  if (itemList.truncate && Number(itemList.truncate) > 0) {
    lines = lines.map((line) => line.substring(0, Number(itemList.truncate)));
  }

  // 5️⃣ Process each line
  const processed = lines.map((line) => {
    let date = "";
    let time = "";
    let info = line;
    let match;

    // Match based on timeFormat
    switch (itemList.timeFormat) {
      case "YYYY-MM-DD HH:mm:ss":
        match = line.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/);
        break;
      case "MM-DD-YYYY HH:mm":
        match = line.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/);
        break;
      case "DD-MM-YYYY HH:mm:ss":
       match = line.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/);
        break;
      default:
        match = null;
        break;
    }

    if (match) {
      date = match[1];
      time = match[2];
      info = line.replace(match[0], "").trim();
    }

    // 6️⃣ Apply DATETIME_CONFIG
    const now = new Date();
    const formatDate = (d) => d.toISOString().split("T")[0];
    const formatTime = (d) => d.toTimeString().split(" ")[0];

    // switch (itemList.dateTime) {
    //   case "CURRENT":
    //     date = formatDate(now);
    //     time = formatTime(now);
    //     break;
    //   case "UTC":
    //     date = formatDate(new Date(now.toISOString()));
    //     time = now.toISOString().split("T")[1].split(".")[0];
    //     break;
    //   case "GMT":
    //     const gmt = now.toUTCString().split(" ");
    //     date = gmt.slice(0, 4).join(" ");
    //     time = gmt[4];
    //     break;
    //   case "US":
    //     const us = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
    //     date = formatDate(us);
    //     time = formatTime(us);
    //     break;
    //   case "EU":
    //     const eu = new Date(now.toLocaleString("en-GB", { timeZone: "Europe/Berlin" }));
    //     date = formatDate(eu);
    //     time = formatTime(eu);
    //     break;
    //   case "SA":
    //     const sa = new Date(now.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }));
    //     date = formatDate(sa);
    //     time = formatTime(sa);
    //     break;
    //   case "APAC":
    //     const apac = new Date(now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
    //     date = formatDate(apac);
    //     time = formatTime(apac);
    //     break;
    //   case "AUTO":
    //     date = formatDate(now);
    //     time = now.toLocaleTimeString();
    //     break;
    //   case "NONE":
    //   default:
    //     // Keep parsed values
    //     break;
    // }

    return { date, time, info };
  });

  setFileLines(processed);
};

  useEffect(() => {
    if (fileText) {
      applyConfigToFile();
    }
  }, [itemList, fileText]);

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
    console.log("text", text);

    // Match both formats
    const textData = text.match(
      /(?:\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2} [A-Z]+ .*?\(user=.*?\))|(?:\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\] [A-Z]+: .*? \| user=.*?)/g
    );
    console.log("textData", textData);

    setFileText(text);

    const processedLines = textData.map((line) => {
      // Format 1: 2025-10-29 10:35:58 ERROR Database connection lost (user=system)
      const match1 = line.match(
        /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([A-Z]+) (.*?) \(user=(.*?)\)/
      );

      // Format 2: [2025-10-29 10:01:59] INFO: Low disk space detected | user=user01
      const match2 = line.match(
        /\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\] ([A-Z]+): (.*?) \| user=(.*)/
      );

      if (match1) {
        return {
          date: match1[1],
          time: match1[2],
          level: match1[3],
          message: match1[4],
          user: match1[5],
        };
      } else if (match2) {
        return {
          date: match2[1],
          time: match2[2],
          level: match2[3],
          message: match2[4],
          user: match2[5],
        };
      } else {
        return null;
      }
    }).filter(Boolean); // Remove nulls if any line didn't match

    setFileLines(processedLines);
    console.log("processed", processedLines);
  };

  reader.readAsText(file);
};

  // const updateIputs = (e) => {
  //   const { name, value } = e.target;
  //   console.log("name", name);
  //   console.log("value", value);
  //   setInputsFormat((prev) => {
  //     const updated = [...prev.customInput];
  //     updated[each - 1] = { ...updated[each - 1], [name]: value }; // update only sourceType
  //     return { ...prev, customInput: updated };
  //   });
  //   if (name === "sourceType") {
  //     setInputsFormat((prev) => {
  //       const updated = [...prev.props];
  //       updated[each - 1] = { ...updated[each - 1], [name]: value }; // update only sourceType
  //       return { ...prev, props: updated };
  //     });
  //   }
  // };

  // const handleAddingKeys = () => {
  //   // const currentTransform = inputsFormat.transform[each - 1];
  //   // const newData = { key: item.newKey, value: newValue };
  //   // setNewKeys([...newKeys, newData]);

  //   // if (item.newKey.toLowerCase().startsWith("transform-")) {
  //   //   setTransformConfig(true);
  //   //   setTransforms([
  //   //     ...transforms,
  //   //     { key: "", regex: "", format: "", destKey: "" },
  //   //   ]);
  //   // }

  //   const data = {
  //    [newKey] :{
  //     regex: "",
  //     format: "",
  //     destKey: "",
  //    }
  //   };

  //   // setInputsFormat((prev) => {
  //   //   const updated = [...prev.transform];
  //   //   updated[updated.length] = data;
  //   //   return { ...prev, transform: updated };
  //   // });
  //   setInputsFormat((prev) => ({
  //   ...prev,
  //   transform: [...prev.transform, data], // add new transform object
  // }));

  //   if (newKey.toLowerCase().startsWith("transform-")) {
  //     setTransformConfig(true);
  //     setTransforms([
  //       ...transforms,
  //       { key: "", regex: "", format: "", destKey: "" },
  //     ]);
  //   }

  //   setNewKey("");
  //   setNewValue("");
  // };

  const handleAddingKeys = () => {
    if (!newKey) return;
    if (!newValue) return;
    console.log("new value : ", newValue);
    setNewValue(newValue);

    if (newKey.toLowerCase().includes("transform-".toLowerCase())) {
      setInputsFormat((prev) => ({
        ...prev,
        transform: {
          ...prev.transform,
          [newKey]: {
            regex: "",
            format: "",
            destKey: "",
          },
        },
      }));
    }

    let sType = inputsFormat.inputs[each - 1].sourceType;
    console.log(sType);

    setInputsFormat((prev) => {
      let updateProps = { ...prev.props };
      let pProp = { ...updateProps[sType], [newKey]: newValue }
      updateProps = { ...updateProps, [sType]: pProp };
      return {
        ...prev,
        props: updateProps,
        // props: updatedProps,
      };
    })

    setNewKey("");
    setNewValue("");
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
          newKey: "",
          newValue: "",
        }
      };
      return {
        ...prev,
        props: updateProps,
        // props: updatedProps,
      };
    })
  }

  const updateTransform = (key, field, value) => {
    setInputsFormat((prev) => ({
      ...prev,
      transform: {
        ...prev.transform,
        [key]: {
          ...prev.transform[key],
          [field]: value,
        },
      },
    }));
  };

  // const handleCopyConfig = () => {
  //   const updates = newKeys.reduce((acc, item) => {
  //     acc[item.key] = item.value;
  //     return acc;
  //   }, {});

  //   item((prev) => ({
  //     ...prev,
  //     ...updates,
  //   }));
  //   setIsCopyConfig(true);
  //   console.log("updates : ", updates);
  // };

  const handleCopyConfig = () => {
    if (!inputsFormat?.props) {
      console.warn("No props found in inputsFormat");
      return;
    }

    // take only props from inputsFormat
    const propsJson = JSON.stringify(inputsFormat.props, null, 2);

    console.log("Props JSON:", propsJson);

    // Copy to clipboard
    navigator.clipboard.writeText(propsJson);

    setIsCopyConfig(true);
  };



  //   const config = inputsFormat.props[sourceType] || {
  //   timeFormat: "",
  //   dateTime: "",
  //   lineBreaker: "",
  //   truncate: "",
  // };

  // console.log("config : ", config);

  console.log("itemOutput : ", inputsFormat.props[inputsFormat.inputs[each - 1].sourceType].timeFormat)


  console.log("file linessss : ", fileLines);

  const fileFormats = (item,value) => {
    if (item === "timeFormat") {
      return <div className="flex items-center gap-4">
        <label className="w-40 text-sm font-medium text-gray-700">
          TIME FORMAT
        </label>
        <select
          name="timeFormat"
          value={inputsFormat.props[sourceType].timeFormat}

          onChange={(e) => updateIputs(e)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select TIME_FORMAT</option>
          <option value="YYYY-MM-DD HH:mm:ss">YYYY-MM-DD HH:mm:ss</option>
          <option value="MM-DD-YYYY HH:mm">MM-DD-YYYY HH:mm</option>
          <option value="DD-MM-YYYY HH:mm:ss">DD-MM-YYYY HH:mm:ss</option>
          <option value="epoch">Epoch Time (seconds)</option>
          <option value="iso8601">ISO 8601</option>
          <option value="custom">Custom</option>
        </select>
        <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
          Delete
        </button>
      </div>
    }
    else if (item === "dateTime") {
      return <div className="flex items-center gap-4">
        <label className="w-40 text-sm font-medium text-gray-700">
          DATE TIME CONFIG
        </label>
        <select
          name="dateTime"
          
          // onChange={(e) => {
          //   setConfigData((prev) => ({
          //     ...prev,
          //     dateTime: e.target.value,
          //   }));
          // }}
          value={inputsFormat.props[sourceType].dateTime}
          onChange={(e) => updateIputs(e)}
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
    }
    else if (item === "lineBreaker") {
      return <div className="flex items-center gap-4">
        <label className="w-40 text-sm font-medium text-gray-700">
          LINE BREAKER
        </label>
        <select
          name="lineBreaker"
          value={inputsFormat.props[sourceType].lineBreaker}
          // onChange={(e) => {
          //   setConfigData((prev) => ({
          //     ...prev,
          //     lineBreaker: e.target.value,
          //   }));
          // }}
          onChange={(e) => updateIputs(e)}
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
    }
    else if (item === "shouldLine") {
      return <div className="flex items-center gap-4">
        <label className="w-40 text-sm font-medium text-gray-700">
          SHOULD LINE
        </label>
        <select
          name="shouldLine"
          value={item.shouldLine}
          // onChange={(e) => {
          //   setConfigData((prev) => ({
          //     ...prev,
          //     shouldLine: e.target.value,
          //   }));
          // }}
          onChange={(e) => updateIputs(e)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
        <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
          Delete
        </button>
      </div>
    }
    else if (item === "truncate") {
      return <div className="flex items-center gap-4">
        <label className="w-40 text-sm font-medium text-gray-700">
          TRUNCATE
        </label>
        <input
          name="truncate"
          value={item.truncate}
          // onChange={(e) => {
          //   setConfigData((prev) => ({
          //     ...prev,
          //     truncate: e.target.value,
          //   }));
          // }}
          onChange={(e) => updateIputs(e)}
          type="number"
          min="0"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
          Delete
        </button>
      </div>
    }
    else{
     return <div className="flex items-center gap-4">
        <label className="w-40 text-sm font-medium text-gray-700">
          {item}
        </label>
        <input
          name={item}
          value={value}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
          Delete
        </button>
      </div>
    }
  };

  const dateFormat=(dates, time)=>{
    let originalDate=dates+" "+time;
    const dateTimeFormat=inputsFormat.props[sourceType].timeFormat;
    
    if(inputsFormat.props[sourceType].dateTime==="CURRENT"){
      originalDate=dayjs();
    }
     if(inputsFormat.props[sourceType].dateTime==="GMT" || inputsFormat.props[sourceType].dateTime==="UTC"){
      dayjs.extend(utc);
      return dayjs().utc().format(dateTimeFormat);
    }
    if(inputsFormat.props[sourceType].dateTime==="SA" || inputsFormat.props[sourceType].dateTime==="UTC"){
      dayjs.extend(utc);
      return dayjs().utc().format(dateTimeFormat);
    }
    console.log("originalDateTime", originalDate)

    if(inputsFormat.props[sourceType].timeFormat){
      
    
    return dayjs(originalDate).format(dateTimeFormat);
    }
    else{
      return "";
    }
  }


  return (
    <div >
      <div className="grid grid-cols-2 justify-between md:flex-row gap-6 mt-2.5">
        <div className="flex-1 p-6 shadow-md rounded-2xl">
          <div className="flex flex-col space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Upload Props.conf for{" "}
              <span className="text-indigo-600">{sourceType}</span>
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
            {/* <div className="flex items-center gap-4">
              <label className="w-40 text-sm font-medium text-gray-700">
                TIME FORMAT
              </label>
              <select
                name="timeFormat"
                value={item.timeFormat}
                // onChange={(e) => {
                //   setConfigData((prev) => ({
                //     ...prev,
                //     timeFormat: e.target.value,
                //   }));
                // }}
                onChange={(e) => updateIputs(e)}
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
                name="dateTime"
                value={item.dateTime}
                // onChange={(e) => {
                //   setConfigData((prev) => ({
                //     ...prev,
                //     dateTime: e.target.value,
                //   }));
                // }}
                onChange={(e) => updateIputs(e)}
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
                name="lineBreaker"
                value={item.lineBreaker}
                // onChange={(e) => {
                //   setConfigData((prev) => ({
                //     ...prev,
                //     lineBreaker: e.target.value,
                //   }));
                // }}
                onChange={(e) => updateIputs(e)}
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
                name="shouldLine"
                value={item.shouldLine}
                // onChange={(e) => {
                //   setConfigData((prev) => ({
                //     ...prev,
                //     shouldLine: e.target.value,
                //   }));
                // }}
                onChange={(e) => updateIputs(e)}
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
                name="truncate"
                value={item.truncate}
                // onChange={(e) => {
                //   setConfigData((prev) => ({
                //     ...prev,
                //     truncate: e.target.value,
                //   }));
                // }}
                onChange={(e) => updateIputs(e)}
                type="number"
                min="0"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
                Delete
              </button>
            </div> */}
            {Object.entries(itemList).map(([key, value], index) => {
              return fileFormats(key, value);
            })}

          </div>
          {/* {Object.keys(inputsFormat.transform).map((key, index) =>
            key !== "" ? (
              <div className="flex items-center gap-4 mt-3.5" key={index}>
                <label className="w-40 text-sm font-medium text-gray-700">
                  {key}
                </label>
                <input
                  name="newValue"
                  // value={item.newValue || ""}
                  value={inputsFormat.props[sourceTypes][key] || ""}
                  // onChange={(e) => {
                  //   const { value } = e.target;
                  //   setInputsFormat((prev) => {
                  //     const updated = [...prev.transform];
                  //     updated[index] = { ...updated[index], newValue: value };
                  //     return { ...prev, transform: updated };
                  //   });
                  // }}
                  onChange={(e) => {
                    const { value } = e.target;
                    setInputsFormat((prev) => ({
                      ...prev,
                      transform: {
                        ...prev.transform,
                        [key]: {
                          ...prev.transform[key],
                          newValue: value
                        }
                      }
                    }));
                  }}
                  type="text"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  // onClick={() => {
                  //   setInputsFormat((prev) => {
                  //     const updated = prev.transform.filter(
                  //       (_, i) => i !== index
                  //     );
                  //     return { ...prev, transform: updated };
                  //   });
                  // }}
                  onClick={() => {
                    setInputsFormat((prev) => {
                      const { [key]: _, ...rest } = prev.transform; // remove key
                      return { ...prev, transform: rest };
                    });
                  }}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400"
                >
                  Delete
                </button>
              </div>
            ) : null
          )} */}

          <div className="flex items-center gap-4 mt-3.5">
            <input
              name="newKey"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              type="text"
              placeholder="New key"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="newValue"
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
                  {console.log("FIle lines", fileLines)}
                  {fileLines.map((each, index) => (
                    <tr className="hover:bg-gray-50" key={index}>
                      <td className="px-4 py-2 border border-gray-300">
                        {dateFormat(each.date, each.time)}
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
            {isCopyConfig && (
              <pre className=" h-44  overflow-auto w-96 resize-none border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {JSON.stringify(itemList, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* {transformConfig && (
        <TransformsConfig
          key={each}
          each={each}
          newKey={item.newKey}
          inputsFormat={inputsFormat}
          setInputsFormat={setInputsFormat}
          transforms={transforms}
          setTransforms={setTransforms}
        />
      )} */}
      {Object.keys(inputsFormat.transform).map((key, index) => {
        const value = inputsFormat.transform[key];
        if(itemListTransform.includes(key)){
          return (


          <TransformsConfig
            key={index}
            each={each}
            newKey={key}          // pass the actual key
            transformValue={value} // optional: pass value if needed
            inputsFormat={inputsFormat}
            setInputsFormat={setInputsFormat}
            transforms={transforms}
            setTransforms={setTransforms}
            updateTransform={updateTransform}
            updateIputs={updateIputs}
          />
        )
        }

      })}

    </div>
  );
};

export default PropsConfigPerSource;
