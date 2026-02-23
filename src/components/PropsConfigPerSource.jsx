import React from "react";
import { useState, useEffect } from "react";
import TransformsConfig from "./TransformsConfig";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { DateTime } from "luxon";

const PropsConfigPerSource = ({
  sourceType,
  inputsFormat,
  setInputsFormat,
  each,
  handleTransforms,
  syslogFile,
}) => {
  console.log("PropsConfigPerSource props:", {
    sourceType,
    inputsFormat,
    setInputsFormat,
    each,
    handleTransforms,
  });
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
  const [customs, setCustoms] = useState({
    dateTimeCustom: false,
    dateTimeCustomError: false,
    lineBreakerCustom: false,
    lineBreakerError: false,
  });
  const [customsValue, setCustomsValue] = useState({
    dateTimeCustomValue: "",
    lineBreakerRegex: "",
    lineBreakerTableFormat: "",
  });

  const [hasAppliedProps, setHasAppliedProps] = useState(false);

  const fileName = file?.name || "";

  const isJsonFile = fileName.toLowerCase().endsWith(".json");
  const isXmlFile = fileName.toLowerCase().endsWith(".xml");
  const isCsvFile = fileName.toLowerCase().endsWith(".csv");
  const isTxtFile = !isJsonFile && !isCsvFile;

  useEffect(() => {
    if (syslogFile) {
      setFile(syslogFile);
    }
  }, [syslogFile]);

  // Debug (optional)
  console.log("fileName:", fileName);
  console.log("isJsonFile:", isJsonFile);
  console.log("isTxtFile:", isTxtFile);

  console.log("each", each);
  console.log("inputss : ", inputsFormat);
  const sourceTypes = inputsFormat?.inputs?.[each - 1]?.sourceType;
  console.log("sourceType", sourceTypes);
  // let itemList = [];
  // itemList = inputsFormat.props[sourceTypes];
  let itemList = {};
  if (sourceTypes && inputsFormat?.props?.[sourceTypes]) {
    itemList = inputsFormat.props[sourceTypes];
  }
  // const filteredEntries = Object.entries(item).filter(([key]) => key !== 'newKey' && key !== 'newValue');
  // console.log("filteredEntries", filteredEntries)

  console.log("items", itemList);
  const itemListTransform = Object.keys(itemList);
  console.log("itemListTransform", itemListTransform);

  function isValidDateFormat(format) {
    // Common allowed tokens
    const validTokens = ["YYYY", "YY", "MM", "DD", "HH", "mm", "ss"];
    const parts = format.split(/[^A-Za-z]+/); // split by non-letter characters

    return parts.every((token) => validTokens.includes(token));
  }

  const addCustomField = () => {
    if (!isValidDateFormat(customsValue.dateTimeCustomValue)) {
      setCustoms((prev) => ({
        ...prev,
        dateTimeCustomError: true,
      }));
      return;
    }
    setCustoms((prev) => ({
      ...prev,
      dateTimeCustomError: false,
    }));
    console.log("one", 1);
    setInputsFormat((prev) => {
      const updated = { ...prev.props };

      let updateSource = {
        ...updated[sourceType],
        timeFormat: customsValue.dateTimeCustomValue,
      };
      console.log("updateSource", updateSource);
      updated[sourceTypes] = { ...updateSource }; // update only sourceType
      return { ...prev, props: updated };
    });
  };
  const deleteTransformEverywhere = (key) => {
    const sType = inputsFormat.inputs[each - 1].sourceType;

    setInputsFormat((prev) => {
      //remove from transform
      const { [key]: _, ...remainingTransforms } = prev.transform;

      //remove from props[sourceType]
      const updatedSourceProps = { ...prev.props[sType] };
      delete updatedSourceProps[key];

      return {
        ...prev,
        transform: remainingTransforms,
        props: {
          ...prev.props,
          [sType]: updatedSourceProps,
        },
      };
    });
  };

  const updateIputs = (e) => {
    const { name, value } = e.target;

    /* ---------------- TIME FORMAT ---------------- */
    if (name === "timeFormat") {
      setCustoms((prev) => ({
        ...prev,
        dateTimeCustom: value === "custom",
        dateTimeCustomError: false,
      }));

      if (value !== "custom") {
        setCustomsValue((prev) => ({
          ...prev,
          dateTimeCustomValue: "",
        }));
      }
    }

    /* ---------------- LINE BREAKER ---------------- */
    if (name === "lineBreaker") {
      setCustoms((prev) => ({
        ...prev,
        lineBreakerCustom: value === "custom",
        lineBreakerError: false,
      }));

      if (value !== "custom") {
        setCustomsValue((prev) => ({
          ...prev,
          lineBreakerRegex: "",
          lineBreakerTableFormat: "",
        }));
      }
    }

    /* ---------------- SINGLE SOURCE OF TRUTH ---------------- */
    setInputsFormat((prev) => ({
      ...prev,
      props: {
        ...prev.props,
        [sourceTypes]: {
          ...prev.props[sourceTypes],
          [name]: value, //ALWAYS UPDATE
        },
      },
    }));
  };

  useEffect(() => {
    if (inputsFormat.props[sourceTypes]?.lineBreaker === "custom") {
      setInputsFormat((prev) => ({
        ...prev,
        props: {
          ...prev.props,
          [sourceTypes]: {
            ...prev.props[sourceTypes],
            lineBreakerRegex: customsValue.lineBreakerRegex,
            lineBreakerTableFormat: customsValue.lineBreakerTableFormat,
          },
        },
      }));
    }
  }, [customsValue.lineBreakerRegex, customsValue.lineBreakerTableFormat]);

  // const truncateByLookHead = (text) => {
  //   const max = Number(inputsFormat.props[sourceTypes]?.truncate);

  //   if (!text) return "";
  //   if (!max || max <= 0) return text;
  //   console.log("info data: " + text);
  //   return text.substring(0, max);
  //   // return text;
  // };

  const truncateByLookHead = (value) => {
    const max = Number(inputsFormat.props[sourceTypes]?.truncate);

    if (value === null || value === undefined) return "";

    // Convert everything to string safely
    const text = typeof value === "string" ? value : JSON.stringify(value);

    if (!max || max <= 0) return text;

    return text.substring(0, max);
  };

  const applyConfigToFile = () => {
    if (!fileText) return;

    const sourceProps = inputsFormat.props[sourceTypes];
    console.log("source type in props: ", JSON.stringify(sourceProps, null, 2));
    console.table(
      "source type in props: ",
      JSON.stringify(sourceProps, null, 2),
    );
    const truncateLen = Number(sourceProps.truncate);
    console.log("truncate length: " + truncateLen);

    console.log("LINE BREAKER MODE:", sourceProps.lineBreaker);
    console.log("REGEX:", sourceProps?.lineBreakerRegex);
    console.log("TABLE FORMAT:", sourceProps?.lineBreakerTableFormat);

    let lines = [];

    /* -----------------------------
    SPLIT LINES USING LINE BREAKER
  ----------------------------- */
    switch (sourceProps.lineBreaker) {
      case "double":
        // lines = fileText.split(/\n\n/);
        lines = fileText.split(/\n\s*\n/);
        break;

      case "windowsDouble":
        // lines = fileText.split(/\r\n\r\n/);
        lines = fileText.split(/\r\n\s*\r\n/);
        break;

      // case "date":
      //   lines =
      //     fileText.match(/\d{4}-\d{2}-\d{2}.*?(?=\d{4}-\d{2}-\d{2}|$)/gs) || [];
      //   break;
      case "date":
        lines =
          fileText.match(
            /^\[\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\][\s\S]*?(?=^\[\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}\]|$)/gm,
          ) || [];
        break;

      case "custom":
        // custom handled later
        lines = fileText.split(/\r?\n/);
        break;

      case "newline":
      default:
        lines = fileText.split(/\r?\n/);
        break;
    }

    /* -----------------------------
    SHOULD_LINE (combine)
  ----------------------------- */
    if (sourceProps.shouldLine === "true") {
      // lines = [lines.join(" ")];
      lines = [lines.join("\n")];
    }

    /* -----------------------------
    PROCESS EACH LINE
  ----------------------------- */
    const processed = lines
      .map((line) => {
        if (!line.trim()) return null;

        let date = "";
        let time = "";
        let info = "";

        /* -----------------------------
         3.1 CUSTOM LINE BREAKER (REGEX)
      ----------------------------- */
        if (
          sourceProps.lineBreaker === "custom" &&
          sourceProps.lineBreakerRegex
        ) {
          try {
            const cleanPattern = sourceProps.lineBreakerRegex.replace(
              /^\/|\/$/g,
              "",
            );
            const regexObj = new RegExp(cleanPattern);
            const match = line.match(regexObj);

            if (!match) return null;

            const headers = sourceProps.lineBreakerTableFormat
              .split(",")
              .map((h) => h.trim());

            const row = {};
            headers.forEach((h, i) => {
              row[h] = match[i + 1] ?? "";
            });

            return row;
          } catch (e) {
            console.error("Invalid custom regex:", e.message);
            return null;
          }
        }

        /* -----------------------------
         3.2️ FORMAT 1
      ----------------------------- */
        // const match1 = line.match(
        //   /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([A-Z]+) (.*?) \(user=.*?\)/
        // );
        // const match1 = line.match(
        //   /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s+([A-Z]+)\s+(.*)$/
        // );
        const match1 = line.match(
          /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s+([A-Z]+)\s+(.*?)(?:\s*\(.*\))?$/,
        );
        console.log("match1 Data: " + match1);

        if (match1) {
          date = match1[1];
          time = match1[2];
          info = line;
        }

        /* -----------------------------
         3.3️ FORMAT 2
      ----------------------------- */
        // const match2 = line.match(
        //   /\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\] ([A-Z]+): (.*?) \| user=.*/
        // );
        const match2 = line.match(
          /^\[(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\]\s+([A-Z]+):\s+(.*)$/,
        );
        console.log("match2 Data: " + match2);

        if (match2) {
          date = match2[1];
          time = match2[2];
          info = line;
        }

        /* -----------------------------
         3.4️ DEFAULT DATE MATCH
      ----------------------------- */
        if (!date || !time) {
          const match = line.match(/(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})/);
          console.log("match of not date and time: " + match);
          if (match) {
            date = match[1];
            time = match[2];
            info = line;
          }
        }

        console.log("before the trunacate info data: " + info);
        console.log("INFO RAW >>>\n", info);

        /* -----------------------------
         4️ TRUNCATE
      ----------------------------- */
        if (truncateLen === 0) {
          info = "";
        } else if (truncateLen > 0 && info) {
          info = info.substring(0, truncateLen);
          // info=info;
        }

        console.log("info data list: " + info);

        return { date, time, info };
      })
      .filter(Boolean);
    console.log("processed Line: " + processed);
    setFileLines(processed);
  };

  // useEffect(() => {
  //   if (fileText) {
  //     applyConfigToFile();
  //   }
  // }, [itemList, fileText]);

  // useEffect(() => {
  //   if (fileText) {
  //     applyConfigToFile();
  //   }
  // }, [fileText, inputsFormat.props[sourceTypes]]);

  useEffect(() => {
    if (!hasAppliedProps) return; // only after Apply
    if (!fileText) return;
    if (!isTxtFile) return;

    applyConfigToFile();
  }, [fileText, inputsFormat.props[sourceTypes], isTxtFile, hasAppliedProps]);
  useEffect(() => {
    setHasAppliedProps(false);
    setFileText("");
    setFileLines([]);
  }, [file]);

  function splitLogLine(line) {
    const firstSpace = line.indexOf(" ");
    const secondSpace = line.indexOf(" ", firstSpace + 1);

    const part1 = line.substring(0, firstSpace);
    const part2 = line.substring(firstSpace + 1, secondSpace);
    const part3 = line.substring(secondSpace + 1);

    return [part1, part2, part3];
  }

  // const handleReadFile = () => {
  //   if (!file) return;

  //   const reader = new FileReader();

  //   reader.onload = (event) => {
  //     const text = event.target.result;

  //     if (text === fileText) {
  //       console.log("same");
  //       console.log("text Data: ", text);
  //       return;
  //     }

  //     console.log("text", text);

  //     // Split lines
  //     const textData = text.split("\n").filter((line) => line.trim() !== "");
  //     console.log("textData", textData);

  //     setFileText(text);

  //     // -----------------------------------------
  //     // Get prefix dynamically (example: from input)
  //     // -----------------------------------------
  //     const prefix = inputsFormat.props[sourceType].timePrefix;
  //     const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  //     // -----------------------------------------
  //     // Dynamic prefix log pattern
  //     // -----------------------------------------
  //     const prefixRegex = new RegExp(
  //       inputsFormat.props[sourceType].lineBreaker
  //     );

  //     const processedLines = textData
  //       .map((line) => {
  //         // -----------------------------------------
  //         // 1. PREFIX FORMAT (dynamic)
  //         // -----------------------------------------
  //         const matchPrefix = line.match(prefixRegex);

  //         console.log("matchPrefix", matchPrefix);
  //         if (matchPrefix) {
  //           return {
  //             type: "FORMAT1",
  //             date: matchPrefix[1],
  //             time: matchPrefix[2],
  //             level: matchPrefix[3],
  //             message: matchPrefix[4],
  //             user: matchPrefix[5],
  //           };
  //         }

  //         // -----------------------------------------
  //         // 2. FORMAT 1
  //         // -----------------------------------------
  //         const match1 = line.match(
  //           /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s+([A-Z]+)\s+(.*)$/
  //         );
  //         // const match1 = line.match(
  //         //   /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([A-Z]+) (.*?) \(user=(.*?)\)/
  //         // );

  //         if (match1) {
  //           return {
  //             type: "FORMAT1",
  //             date: match1[1],
  //             time: match1[2],
  //             level: match1[3],
  //             message: match1[4],
  //             user: match1[5],
  //           };
  //         }

  //         // -----------------------------------------
  //         // 3. FORMAT 2
  //         // -----------------------------------------
  //         // const match2 = line.match(
  //         //   /\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\] ([A-Z]+): (.*?) \| user=(.*)/
  //         // );
  //         const match2 = line.match(
  //           /^\[(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\]\s+([A-Z]+):\s+(.*)$/
  //         );

  //         if (match2) {
  //           return {
  //             type: "FORMAT2",
  //             date: match2[1],
  //             time: match2[2],
  //             level: match2[3],
  //             message: match2[4],
  //             user: match2[5],
  //           };
  //         }

  //         return null;
  //       })
  //       .filter(Boolean);

  //     setFileLines(processedLines);
  //     console.log("processed", processedLines);
  //   };

  //   reader.readAsText(file);
  // };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim());

    return lines.slice(1).map((line) => {
      const values = line.split(",");
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = values[i]?.trim() ?? "";
      });
      return obj;
    });
  };

  const handleReadFile = () => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;
      setFileText(text);

      /* =======================
       JSON FILE
    ======================= */
      if (isJsonFile) {
        try {
          const parsed = JSON.parse(text);

          if (!Array.isArray(parsed)) {
            console.error("JSON must be an array");
            setFileLines([]);
            setHasAppliedProps(false);
            return;
          }

          setFileLines(parsed); //JSON rows
          setHasAppliedProps(true);
          return; // stop here
        } catch (e) {
          console.error("Invalid JSON file", e);
          setFileLines([]);
          setHasAppliedProps(false);
          return;
        }
      }

      /* =======================
          CSV FILE
        ======================= */
      if (isCsvFile) {
        try {
          const rows = parseCSV(text);

          if (!Array.isArray(rows) || rows.length === 0) {
            console.error("Invalid or empty CSV file");
            setFileLines([]);
            setHasAppliedProps(false);
            return;
          }

          setFileLines(rows); // CSV rows = array of objects
          setHasAppliedProps(true);
          return; //STOP here (no TXT parsing)
        } catch (e) {
          console.error("CSV parsing failed", e);
          setFileLines([]);
          setHasAppliedProps(false);
          return;
        }
      }

      if (text === fileText) {
        console.log("same");
        console.log("text Data: ", text);
        return;
      }

      console.log("text", text);

      // Split lines
      const textData = text.split("\n").filter((line) => line.trim() !== "");
      console.log("textData", textData);

      setFileText(text);

      // -----------------------------------------
      // Get prefix dynamically (example: from input)
      // -----------------------------------------
      const prefix = inputsFormat.props[sourceType].timePrefix;
      const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // -----------------------------------------
      // Dynamic prefix log pattern
      // -----------------------------------------
      const prefixRegex = new RegExp(
        inputsFormat.props[sourceType].lineBreaker,
      );

      const processedLines = textData
        .map((line) => {
          // -----------------------------------------
          // 1. PREFIX FORMAT (dynamic)
          // -----------------------------------------
          const matchPrefix = line.match(prefixRegex);

          console.log("matchPrefix", matchPrefix);
          if (matchPrefix) {
            return {
              type: "FORMAT1",
              date: matchPrefix[1],
              time: matchPrefix[2],
              level: matchPrefix[3],
              message: matchPrefix[4],
              user: matchPrefix[5],
            };
          }

          // -----------------------------------------
          // 2. FORMAT 1
          // -----------------------------------------
          const match1 = line.match(
            /^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\s+([A-Z]+)\s+(.*)$/,
          );
          // const match1 = line.match(
          //   /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) ([A-Z]+) (.*?) \(user=(.*?)\)/
          // );

          if (match1) {
            return {
              type: "FORMAT1",
              date: match1[1],
              time: match1[2],
              level: match1[3],
              message: match1[4],
              user: match1[5],
            };
          }

          // -----------------------------------------
          // 3. FORMAT 2
          // -----------------------------------------
          // const match2 = line.match(
          //   /\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2})\] ([A-Z]+): (.*?) \| user=(.*)/
          // );
          const match2 = line.match(
            /^\[(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2})\]\s+([A-Z]+):\s+(.*)$/,
          );

          if (match2) {
            return {
              type: "FORMAT2",
              date: match2[1],
              time: match2[2],
              level: match2[3],
              message: match2[4],
              user: match2[5],
            };
          }

          return null;
        })
        .filter(Boolean);

      setFileLines(processedLines);
      console.log("processed", processedLines);
      setHasAppliedProps(true);
    };

    reader.readAsText(file);
  };

  const deleteKeys = (val) => {
    console.log("val", val);
    let sType = inputsFormat.inputs[each - 1].sourceType;
    setInputsFormat((prev) => {
      let updateProps = { ...prev.props };
      let pProp = updateProps[sType];
      console.log("pProp", pProp);
      const updated = Object.fromEntries(
        Object.entries(pProp).filter(([key]) => key !== val),
      );
      updateProps = { ...updateProps, [sType]: updated };
      return {
        ...prev,
        props: updateProps,
        // props: updatedProps,
      };
    });
  };

  const handleAddingKeys = () => {
    if (!newKey) return;
    if (!newValue) return;
    console.log("new value : ", newValue);
    setNewValue(newValue);

    //     if (newKey.toLowerCase().includes("transform-".toLowerCase())) {
    //   setInputsFormat((prev) => ({
    //     ...prev,
    //     transform: {
    //       ...prev.transform,
    //       [newKey]: {
    //         regex: "",
    //         format: "",
    //         destKey: "",
    //       },
    //     },
    //   }));
    // }

    if (newKey.toLowerCase().startsWith("transforms-")) {
      const stanzaName = newValue.trim();

      if (!stanzaName) return;

      setInputsFormat((prev) => ({
        ...prev,
        transform: {
          ...prev.transform,
          [stanzaName]: {
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
      let pProp = { ...updateProps[sType], [newKey]: newValue };
      updateProps = { ...updateProps, [sType]: pProp };
      return {
        ...prev,
        props: updateProps,
        // props: updatedProps,
      };
    });

    setNewKey("");
    setNewValue("");
  };

  const addProps = () => {
    let sType = inputsFormat.inputs[each - 1].sourceType;
    console.log(sType);

    setInputsFormat((prev) => {
      let updateProps = { ...prev.props };
      updateProps = {
        ...updateProps,
        [sType]: {
          timeFormat: "",
          dateTime: "",
          lineBreaker: "",
          shouldLine: "",
          truncate: "",
          newKey: "",
          newValue: "",
        },
      };
      return {
        ...prev,
        props: updateProps,
        // props: updatedProps,
      };
    });
  };

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

  const handleCopyConfig = async () => {
    if (!inputsFormat?.props) {
      console.warn("No props found in inputsFormat");
      return;
    }

    const propsJson = JSON.stringify(inputsFormat.props, null, 2);

    try {
      // Modern Clipboard API (secure browsers)
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(propsJson);
        setIsCopyConfig(true);
        return;
      }

      //Fallback for Azure / older browsers
      const textArea = document.createElement("textarea");
      textArea.value = propsJson;
      textArea.style.position = "fixed"; // avoid scrolling
      textArea.style.opacity = "0";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      document.execCommand("copy");
      document.body.removeChild(textArea);

      setIsCopyConfig(true);
    } catch (err) {
      console.error("Copy failed:", err);
      alert("Copy failed. Please copy manually.");
    }
  };

  //   const config = inputsFormat.props[sourceType] || {
  //   timeFormat: "",
  //   dateTime: "",
  //   lineBreaker: "",
  //   truncate: "",
  // };

  // console.log("config : ", config);

  console.log(
    "itemOutput : ",
    inputsFormat.props[inputsFormat.inputs[each - 1].sourceType].timeFormat,
  );

  console.log("file linessss : ", fileLines);

  const fileFormats = (item, value) => {
    console.log("aqaqa", item);
    if (item === "timePrefix") {
      return (
        <div className="flex flex-col items-start">
          <div className="w-full flex items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700">
              TIME PREFIX
            </label>
            <input
              name="timePrefix"
              value={inputsFormat.props[sourceType].timePrefix}
              onChange={(e) => updateIputs(e)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {/* <select
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
          </select> */}
            {/* <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
            Delete
          </button> */}
          </div>
        </div>
      );
    }
    if (item === "timeFormat") {
      return (
        <div className="flex flex-col items-start">
          <div className="w-full flex items-center gap-4">
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
            {/* <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
            Delete
          </button> */}
          </div>
          {customs.dateTimeCustom && (
            <div className="w-full flex items-center gap-4 mt-1">
              <label className="w-40 text-sm font-medium text-gray-700">
                Custom Format
              </label>
              <input
                name="timeFormat"
                value={customsValue.dateTimeCustomValue}
                onChange={(e) =>
                  setCustomsValue((prev) => ({
                    ...prev,
                    dateTimeCustomValue: e.target.value,
                  }))
                }
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                onClick={addCustomField}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg"
              >
                Add
              </button>
            </div>
          )}
          {customs.dateTimeCustomError && (
            <p className="text-red-600 self-center">In valid format</p>
          )}
        </div>
      );
    } else if (item === "dateTime") {
      return (
        <div className="flex items-center gap-4">
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
          {/* <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
          Delete
        </button> */}
        </div>
      );
    } else if (item === "maximum_lookHead") {
      return (
        <div className="flex flex-col items-start">
          <div className="w-full flex items-center gap-4">
            <label className="w-40 text-sm font-medium text-gray-700">
              MAXIMUM LOOKHEAD
            </label>
            <input
              name="maximum_lookHead"
              value={inputsFormat.props[sourceType].maximum_lookHead}
              onChange={(e) => updateIputs(e)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {/* <select
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
          </select> */}
            {/* <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
            Delete
          </button> */}
          </div>
        </div>
      );
    } else if (item === "lineBreaker") {
      return (
        <div className="flex flex-col items-start">
          <div className="w-full flex items-center gap-4">
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
            {/* <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
            Delete
          </button> */}
          </div>

          {customs.lineBreakerCustom && (
            <div className="flex flex-col w-full mt-1.5">
              <div className="w-full flex items-center gap-4 mt-1">
                <label className="w-40 text-sm font-medium text-gray-700">
                  Regex Pattern
                </label>
                <input
                  name="lineBreakerCustomValue"
                  value={customsValue.lineBreakerRegex}
                  onChange={(e) =>
                    setCustomsValue((prev) => ({
                      ...prev,
                      lineBreakerRegex: e.target.value,
                    }))
                  }
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* <button
                onClick={addLineBreakerCustomField}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg"
              >
                Add
              </button> */}
              </div>
              <div className="w-full flex items-center gap-4 mt-1.5">
                <label className="w-40 text-sm font-medium text-gray-700">
                  Table Format
                </label>
                <input
                  name="lineBreakerCustomValue"
                  value={customsValue.lineBreakerTableFormat}
                  onChange={(e) =>
                    setCustomsValue((prev) => ({
                      ...prev,
                      lineBreakerTableFormat: e.target.value,
                    }))
                  }
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="date,time,level,message"
                />

                {/* <button
                onClick={addLineBreakerCustomField}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg"
              >
                Add
              </button> */}
              </div>
            </div>
          )}
          {customs.dateTimeCustomError && (
            <p className="text-red-600 self-center">In valid format</p>
          )}
        </div>
      );
    } else if (item === "shouldLine") {
      console.log("aaaaaaaaa", item.shouldLine);
      return (
        <div className="flex items-center gap-4">
          <label className="w-40 text-sm font-medium text-gray-700">
            SHOULD LINE
          </label>
          <select
            name="shouldLine"
            value={inputsFormat.props[sourceType].shouldLine}
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
          {/* <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
          Delete
        </button> */}
        </div>
      );
    } else if (item === "truncate") {
      console.log("aaaaaaaaa", item.truncate);
      return (
        <div className="flex items-center gap-4">
          <label className="w-40 text-sm font-medium text-gray-700">
            TRUNCATE
          </label>
          <input
            name="truncate"
            value={inputsFormat.props[sourceType].truncate}
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
          {/* <button className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400">
          Delete
        </button> */}
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-4">
          <label className="w-40 text-sm font-medium text-gray-700">
            {item}
          </label>
          <input
            name={item}
            value={value}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => deleteTransformEverywhere(item)}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 focus:ring-2 focus:ring-red-400"
          >
            Delete
          </button>
        </div>
      );
    }
  };

  const dateFormat = (dates, time) => {
    const nowUTC = DateTime.utc();
    let originalDate = dates + " " + time;
    console.log("dd", originalDate);
    const dateTimeFormat = inputsFormat.props[sourceType].timeFormat;

    if (inputsFormat.props[sourceType].dateTime === "CURRENT") {
      originalDate = dayjs();
    }
    if (
      inputsFormat.props[sourceType].dateTime === "GMT" ||
      inputsFormat.props[sourceType].dateTime === "UTC"
    ) {
      dayjs.extend(utc);
      return dayjs().utc().format(dateTimeFormat);
    }
    if (
      inputsFormat.props[sourceType].dateTime === "SA" ||
      inputsFormat.props[sourceType].dateTime === "US" ||
      inputsFormat.props[sourceType].dateTime === "EU" ||
      inputsFormat.props[sourceType].dateTime === "APAC"
    ) {
      let country = inputsFormat.props[sourceType].dateTime;
      let zone = "";
      if (country === "SA") {
        zone = "America/Argentina/Buenos_Aires";
      } else if (country === "US") {
        zone = "America/New_York";
      } else if (country === "EU") {
        zone = "Europe/Berlin";
      } else if (country === "APAC") {
        zone = "Asia/Tokyo";
      }

      const nowUTC = DateTime.utc();
      const newDate = nowUTC.setZone(zone);

      // Format using Luxon
      console.log("dateTimeFormat", dateTimeFormat);
      const formattedLuxon = newDate.toFormat("yyyy-MM-dd HH:mm:ss");

      // Then pass to dayjs if needed

      return formattedLuxon;
    }
    console.log("originalDateTime", originalDate);

    if (inputsFormat.props[sourceType].timeFormat) {
      console.log("originalDate", originalDate);
      console.log("dateFormat", dateTimeFormat);
      console.log(
        "After formatting",
        dayjs(originalDate).format(dateTimeFormat),
      );
      return dayjs(originalDate).format(dateTimeFormat);
    } else {
      return "";
    }
  };
  const isCustomLineBreaker =
    inputsFormat.props[sourceTypes]?.lineBreaker === "custom";

  // const tableHeaders = isCustomLineBreaker
  //   ? (
  //       inputsFormat.props[sourceTypes]?.lineBreakerTableFormat || ""
  //     )
  //       .split(",")
  //       .map((h) => h.trim())
  //       .filter(Boolean)
  //   : ["Date Time", "Event Logs"];

  const lineBreaker = inputsFormat.props[sourceTypes]?.lineBreaker;

  const rawFormat =
    inputsFormat.props[sourceTypes]?.lineBreakerTableFormat ?? "";

  const tableHeaders = (() => {
    // // JSON → dynamic keys
    // if (isJsonFile && fileLines.length > 0) {
    //   return Object.keys(fileLines[0]);
    // }
    if ((isJsonFile || isCsvFile) && fileLines.length > 0) {
      return Object.keys(fileLines[0]);
    }
    //No selection OR empty/space value
    if (!lineBreaker || !lineBreaker.trim()) {
      return [];
    }

    //Custom
    if (lineBreaker === "custom") {
      if (!rawFormat.trim()) {
        return [];
      }
      return rawFormat
        .split(",")
        .map((h) => h.trim())
        .filter(Boolean);
    }

    //All valid non-custom selections
    return ["Date Time", "Event Logs"];
  })();

  return (
    <div>
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
            </div>
            <strong>{file && (
                <h2 className="text-sm text-gray-600">{file.name}</h2>
              )}</strong>
          </div>
          <div className="space-y-4 mt-3.5">
            {Object.entries(itemList)
              .filter(
                ([key]) =>
                  key !== "lineBreakerRegex" &&
                  key !== "lineBreakerTableFormat",
              )
              .map(([key, value]) => fileFormats(key, value))}
          </div>

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
              onClick={handleReadFile}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400"
            >
              Apply Changes
            </button>
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
              {hasAppliedProps &&
                fileLines.length > 0 &&
                tableHeaders.length > 0 && (
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        {(isJsonFile || isCsvFile) && (
                          <th className="px-4 py-2 border border-gray-300 text-sm font-semibold">
                            DATETIME
                          </th>
                        )}
                        {tableHeaders.map((header) => (
                          <th
                            key={header}
                            className="px-4 py-2 border border-gray-300 text-sm font-semibold"
                          >
                            {header.toUpperCase()}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {fileLines.map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {(isJsonFile || isCsvFile) && (
                            <>
                              <td className="px-4 py-2 border border-gray-300">
                                {dateFormat(
                                  row.timestamp?.split(" ")[0],
                                  row.timestamp?.split(" ")[1],
                                )}
                              </td>
                              {tableHeaders.map((key) => (
                                <td
                                  key={key}
                                  className="px-4 py-2 border border-gray-300"
                                >
                                  {truncateByLookHead(row?.[key])}
                                </td>
                              ))}
                            </>
                          )}

                          {isTxtFile &&
                            tableHeaders.map((header, colIndex) => (
                              <td
                                key={colIndex}
                                className="px-4 py-2 border border-gray-300"
                              >
                                {isCustomLineBreaker
                                  ? truncateByLookHead(row?.[header])
                                  : colIndex === 0
                                    ? dateFormat(row.date, row.time)
                                    : truncateByLookHead(row?.info)}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Generated Props.conf
            </h3>
            {isCopyConfig && (
              // <pre className=" h-44  overflow-auto w-96 resize-none border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              //   {JSON.stringify(itemList, null, 2)}
              // </pre>
              <div className="w-120 h-40 overflow-auto bg-white border border-black rounded-2xl p-3">
                <p>{`[${sourceType}]`}</p>
                <ul>
                  {Object.keys(itemList).map((each) => {
                    return (
                      itemList[each] !== "" && (
                        <li>
                          {each.toUpperCase()} : {itemList[each]}
                        </li>
                      )
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* {Object.keys(inputsFormat.transform).map((key, index) => {
        const value = inputsFormat.transform[key];
        if (itemListTransform.includes(key)) {
          return (
            // <TransformsConfig
            //   key={index}
            //   each={each}
            //   newKey={key} // pass the actual key
            //   transformValue={value} // optional: pass value if needed
            //   inputsFormat={inputsFormat}
            //   setInputsFormat={setInputsFormat}
            //   transforms={transforms}
            //   setTransforms={setTransforms}
            //   updateTransform={updateTransform}
            //   updateIputs={updateIputs}
            // />
            <TransformsConfig
              file={file}
              key={key}
              each={each}
              newKey={key}
              inputsFormat={inputsFormat}
              setInputsFormat={setInputsFormat}
              updateTransform={updateTransform}
              updateIputs={updateIputs}
              deleteTransformEverywhere={deleteTransformEverywhere}
            />
          );
        }
      })} */}

      {Object.keys(inputsFormat.transform).map((key) => {
        const propsValues = Object.values(itemList);

        if (propsValues.includes(key)) {
          return (
            <TransformsConfig
              key={key}
              file={file}
              each={each}
              newKey={key}
              inputsFormat={inputsFormat}
              setInputsFormat={setInputsFormat}
              updateTransform={updateTransform}
              updateIputs={updateIputs}
              deleteTransformEverywhere={deleteTransformEverywhere}
            />
          );
        }

        return null;
      })}
    </div>
  );
};

export default PropsConfigPerSource;
