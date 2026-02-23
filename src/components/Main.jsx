import React, { useState, useEffect, use } from "react";
import InputConfig from "./InputConfig";
import TransformsConfig from "./TransformsConfig";
import { IndexConfig } from "./IndexConfig";
import { useParams } from "react-router-dom";
import axios from "axios";
import { HECToken } from "./HECToken";
import UniversalForwarder from "./UniversalForwarder";

const Main = () => {
  const { userName, token } = useParams();
  const [inputsConfig, setInputsConfig] = useState([1]);
  const [inputsConfigList, setInputsConfigList] = useState([]);
  const [parsedSourceTypes, setParsedSourceTypes] = useState([]);
  const [isCustomSourceType, setIsCustomSourceType] = useState(false);

  const [mode, setMode] = useState("existing");
  const [indexName, setIndexName] = useState("");
  const [appName, setAppName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [appNameSuggestions, setAppNameSuggestions] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [inputDeleteError, setInputDeleteError] = useState("");
  const [sourceMode, setSourceMode] = useState(null); // default
  const [indexMode, setIndexMode] = useState("new");
  const [appMode, setAppMode] = useState("new");
  const [syslogFile, setSyslogFile] = useState(null);
  const [syslogError, setSyslogError] = useState("");
  let propsList = [
    "timePrefix",
    "timeFormat",
    "lineBreaker",
    "maximum_lookAhead",
    "truncate",
    "dateTime",
  ];

  const [inputsFormat, setInputsFormat] = useState({
    appName: "",
    indexName: "",
    indexConfig: {},
    inputs: [
      {
        id: 1,
        filePath: "",
        sourceType: "",
        index: "",
        whiteList: "",
        blackList: "",
        customFields: [],
      },
    ],
    props: {
      //     sourceType : {
      //   timeFormat: "",
      //   dateTime: "",
      //   lineBreaker: "",
      //   shouldLine: "",
      //   truncate: "",
      //   newKey : "",
      //   newValue : "",
      // }
    },
    transform: [],
  });

  const [hecTokenDetails, setHecTokenDetails] = useState({
    appName: "",
    indexName: "",
    tokenName: "",
    // indexName: "",
    sourceType: "",
  });

  const [ufTokenDetails, setUfTokenDetails] = useState({
    appName: "",
    indexName: "",
    // indexName: "",
    sourceType: "",
  });

  const [repos, setRepos] = useState([]);
  const [repoNames, setRepoNames] = useState([]);
  const [existingConfig, setExistingConfig] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [configFiles, setConfigFiles] = useState([]);

  const fetchConfigFiles = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/config-files`);

      console.log("Configss:", response.data);
      setExistingConfig(response.data);
    } catch (e) {
      console.error("Fetch config files error:", e);
    }
  };

  const fetchRepos = async () => {
    try {
      if (!userName || !token) return;

      const response = await axios.get(
        `http://127.0.0.1:5000/get-repos/${userName}/${token}`,
      );

      console.log("Repos:", response.data);
      setRepos(response.data);
      setRepoNames(response.data.map((repo) => repo.name));
    } catch (e) {
      console.error("Fetch repos error:", e);
    }
  };

  useEffect(() => {
    console.log("username", userName);
    console.log("token", token);
    fetchRepos();
    fetchConfigFiles();
  }, [userName]);

  const fetchRepoBranches = async (owner, repoName, token) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/repo-branches/${owner}/${repoName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response.data);
      setBranches(response.data);
    } catch (error) {
      console.error(
        "Error fetching repo contents:",
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    if (!token || !inputsFormat.appName) return;

    fetchRepoBranches(userName, inputsFormat.appName, token);
  }, [inputsFormat.appName]);

  const fetchRepoFiles = async (owner, repoName, token, branch) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/repo-tree/${owner}/${repoName}/${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Files:", response.data);
    } catch (error) {
      console.error(
        "Error fetching repo contents:",
        error.response?.data || error.message,
      );
    }
  };

  // const fetchRepoConfigFiles = async (owner, repoName, token, branch) => {
  //   try {
  //     const response = await axios.get(
  //       `http://127.0.0.1:5000/read-splunk-configs/${owner}/${repoName}/${branch}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     console.log("Files:", response.data);
  //     setConfigFiles(response.data.files);
  //   } catch (error) {
  //     console.error(
  //       "Error fetching repo contents:",
  //       error.response?.data || error.message,
  //     );
  //   }
  // };
  const fetchRepoConfigFiles = async (owner, repoName, token, branch) => {
    try {
      console.log("==== API CALL START ====");
      console.log("Owner:", owner);
      console.log("Repo:", repoName);
      console.log("Branch:", branch);

      const response = await axios.get(
        `http://127.0.0.1:5000/read-splunk-configs/${owner}/${repoName}/${branch}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("==== FULL RESPONSE ====");
      console.log(response);

      console.log("==== RESPONSE DATA ====");
      console.log(response.data);

      if (!response.data || !response.data.files) {
        console.warn("No files key found in response");
        return;
      }

      console.log("==== FILE COUNT ====");
      console.log(response.data.files.length);

      response.data.files.forEach((file, index) => {
        console.log(`---- FILE ${index + 1} ----`);
        console.log("File Name:", file.file_name);
        console.log("Content Type:", typeof file.content);
        console.log("Content Length:", file.content?.length);
        console.log("Full Content:");
        console.log(file.content);
      });

      setConfigFiles(response.data.files);

      console.log("==== STATE UPDATED ====");
    } catch (error) {
      console.error("==== API ERROR ====");
      console.error(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (!token || !inputsFormat.appName || !selectedBranch) return;

    fetchRepoFiles(userName, inputsFormat.appName, token, selectedBranch);
    fetchRepoConfigFiles(userName, inputsFormat.appName, token, selectedBranch);
  }, [inputsFormat.appName, selectedBranch]);

  const getFormattedValue = (content) => {
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0); // remove empty lines

    const parseValue = (val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    };

    const formatted = {
      ...Object.fromEntries(
        lines
          .slice(1)
          .map((line) => {
            const parts = line.split("=");
            if (parts.length < 2) return []; // skip invalid lines

            const key = parts[0].trim();
            const value = parseValue(parts.slice(1).join("=").trim());

            return [key, value];
          })
          .filter((entry) => entry.length), // remove skipped lines
      ),
    };

    return formatted;
  };

  const handleSyslogFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [".log", ".txt", ".csv"];
    const isValidType = allowedTypes.some((ext) =>
      file.name.toLowerCase().endsWith(ext),
    );

    if (!isValidType) {
      setSyslogError("Only .log, .txt, .csv files allowed");
      setSyslogFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSyslogError("File size must be less than 10MB");
      setSyslogFile(null);
      return;
    }

    setSyslogError("");
    setSyslogFile(file);
  };

  const parseInputsConfig = (content) => {
    const lines = content
      .split(/\r?\n|\\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    console.log("lines: ", lines);

    const parseValue = (val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    };

    const stanzas = [];
    let current = null;

    lines.forEach((line) => {
      if (/^\[.*\]$/.test(line)) {
        current = {
          name: line.substring(1, line.length - 1),
          config: {},
        };
        stanzas.push(current);
        return;
      }

      if (current && line.includes("=")) {
        const parts = line.split("=");
        if (parts.length < 2) return;

        const key = parts[0].trim();
        const value = parseValue(parts.slice(1).join("=").trim());

        current.config[key] = value;
      }
    });

    console.log("STANZA COUNT:", stanzas.length);
    const sourceTypes = stanzas.map((s) => s.config.sourceType).filter(Boolean);

    return {
      inputsArray: stanzas,
      sourceTypesArray: sourceTypes,
    };
  };

  const parseConfFile = (content) => {
    const lines = content
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#"));

    const stanzas = {};
    let current = null;

    const parseValue = (val) => {
      if (val === "true") return true;
      if (val === "false") return false;
      return val;
    };

    lines.forEach((line) => {
      if (/^\[.*\]$/.test(line)) {
        current = line.slice(1, -1);
        stanzas[current] = {};
        return;
      }

      if (current && line.includes("=")) {
        const [key, ...rest] = line.split("=");
        stanzas[current][key.trim()] = parseValue(rest.join("=").trim());
      }
    });

    return stanzas;
  };

  const handleConfigFiles = () => {
    console.log("========== HANDLE CONFIG FILES START ==========");

    const inputsFile = configFiles.find(
      (file) => file.file_name === "inputs.conf",
    );

    const propsFile = configFiles.find(
      (file) => file.file_name === "props.conf",
    );

    const transformsFile = configFiles.find(
      (file) => file.file_name === "transforms.conf",
    );

    if (!inputsFile || !propsFile || !transformsFile) {
      console.warn("Required config file missing");
      return;
    }

    const parsedInputs = parseInputsConfig(inputsFile.content);
    const parsedProps = parseConfFile(propsFile.content);
    const parsedTransforms = parseConfFile(transformsFile.content);

    setParsedSourceTypes(parsedInputs.sourceTypesArray || []);

    setInputsFormat((prev) => {
      let updatedInputs = [...prev.inputs];
      let updatedProps = {};
      let transformObj = {};

      if (!parsedInputs.inputsArray.length) {
        return prev;
      }

      const firstInput = parsedInputs.inputsArray[0];
      const rawSourceType = firstInput.config.sourceType;

      // ---------- INPUTS (do NOT auto set sourceType) ----------
      updatedInputs[0] = {
        ...updatedInputs[0],
        filePath: firstInput.config.filePath || "",
        index: firstInput.config.index || "",
        whiteList: firstInput.config.whiteList || "",
        blackList: firstInput.config.blackList || "",
      };

      if (!rawSourceType) {
        return {
          ...prev,
          inputs: updatedInputs,
        };
      }

      // ---------- Case-insensitive sourceType match ----------
      const matchedSourceType = Object.keys(parsedProps).find(
        (k) => k.trim().toLowerCase() === rawSourceType.trim().toLowerCase(),
      );

      if (!matchedSourceType) {
        console.warn("No matching props stanza for:", rawSourceType);
        return {
          ...prev,
          inputs: updatedInputs,
        };
      }

      const propsConfig = parsedProps[matchedSourceType];
      updatedProps[matchedSourceType] = {};

      // ---------- PROPS + TRANSFORMS ----------
      for (const [key, value] of Object.entries(propsConfig)) {
        updatedProps[matchedSourceType][key] = value;

        // Only process TRANSFORMS-* (case-insensitive)
        if (key.toLowerCase().startsWith("transforms-")) {
          const transformNames = value
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

          transformNames.forEach((transformName) => {
            const matchedTransformKey = Object.keys(parsedTransforms).find(
              (k) =>
                k.trim().toLowerCase() === transformName.trim().toLowerCase(),
            );

            if (!matchedTransformKey) {
              console.warn("Transform stanza not found:", transformName);
              return;
            }

            transformObj = {
              ...transformObj,
              [matchedTransformKey]: {
                regex: parsedTransforms[matchedTransformKey]?.REGEX || "",
                format: parsedTransforms[matchedTransformKey]?.FORMAT || "",
                destKey: parsedTransforms[matchedTransformKey]?.DEST_KEY || "",
              },
            };
          });
        }
      }
      console.log("FINAL INPUTS FORMAT:");
      console.log("inputs:", updatedInputs);
      console.log("props:", updatedProps);
      console.log("transform:", transformObj);

      return {
        ...prev,
        inputs: updatedInputs,
        props: updatedProps,
        transform: transformObj,
      };
    });

    console.log("========== HANDLE CONFIG FILES END ==========");
  };
  useEffect(() => {
    if (configFiles.length === 0) return;
    handleConfigFiles();
  }, [configFiles]);

  const existingIndexes = ["users_index", "orders_index", "products_index"];
  const possibleSuffixes = ["_logs", "_data"];
  const existingAppName = ["_logs", "_data", "_metrics"];

  const SOURCE_MODES = {
    HEC: "HEC",
    UF: "UF",
    CONF: "CONF",
  };

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (e.nativeEvent.inputType === "deleteContentBackward") {
      let changedIndexName = inputsFormat.indexName.split("_");
      console.log(
        "changed INdex Name",
        changedIndexName[changedIndexName.length - 1],
      );
      if (
        possibleSuffixes.includes(
          "_" + changedIndexName[changedIndexName.length - 1],
        )
      ) {
        let lastIndex = inputsFormat.indexName.lastIndexOf("_");
        console.log("lastIndex", lastIndex);
        value = inputsFormat.indexName.slice(0, lastIndex);
      }
    }
    setIndexName(value);
    console.log("Typed:", value);
    console.log("Current suggestions:", suggestions);
    setInputsFormat((prev) => ({
      ...prev,
      indexName: "",
    }));

    setHecTokenDetails((prev) => ({
      ...prev,
      indexName: value,
    }));

    setUfTokenDetails((prev) => ({
      ...prev,
      indexName: value,
    }));

    // if (value.trim() !== "") {
    //   const generated = possibleSuffixes.map((suffix) => suffix);
    //   setSuggestions(generated);
    // } else {
    //   setSuggestions([]);
    // }

    if (value.trim() !== "") {
      const appBase = inputsFormat.appName?.trim();

      const generated = [
        value, //user typed
        appBase, // app name
        ...(appBase ? possibleSuffixes.map((suf) => `${appBase}${suf}`) : []),
      ];

      setSuggestions([...new Set(generated.filter(Boolean))]);
    } else {
      setSuggestions([]);
    }
  };

  const PreviewPage = ({ inputsFormat, onBack }) => {
    if (!inputsFormat) return null;

    const { appName, indexName, indexConfig, inputs, props, transform } =
      inputsFormat;
    console.log("DEBUG TRANSFORM:", inputsFormat.transform);
    console.log("DEBUG PROPS:", inputsFormat.props);

    return (
      <div className="w-full bg-gray-50 rounded-xl p-6 space-y-6">
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-600">
            App Configuration Preview
          </h2>
          <button
            onClick={onBack}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back
          </button>
        </div>

        {/* ===== App & Index ===== */}
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-semibold text-blue-500 mb-4">
            App & Index Configuration
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Row label="App Name" value={appName} />
            <Row label="Index Name" value={indexName} />
          </div>

          {indexConfig && Object.keys(indexConfig).length > 0 && (
            <>
              <Divider />
              <h4 className="font-semibold mb-2">Index Retention</h4>

              {Object.entries(indexConfig).map(([idx, cfg]) => (
                <div
                  key={idx}
                  className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded mb-2"
                >
                  <div className="font-medium">{idx}</div>
                  <div>{cfg.retentionTime}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ===== Inputs ===== */}
        {inputs?.length > 0 && (
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-blue-500 mb-4">
              Inputs Configuration
            </h3>

            {inputs.map((input, i) => (
              <div
                key={input.id || i}
                className="border rounded-lg p-4 mb-4 bg-gray-50"
              >
                <div className="font-semibold mb-3 text-gray-700">
                  Input #{i + 1}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Row label="File Path" value={input.filePath} />
                  <Row label="Source Type" value={input.sourceType} />
                  <Row label="Index" value={input.index || indexName} />
                  <Row label="WhiteList" value={input.whiteList} />
                  <Row label="BlackList" value={input.blackList} />
                </div>

                {/* Custom Fields */}
                {input.customFields?.length > 0 && (
                  <>
                    <Divider />
                    <h4 className="font-semibold mb-2">Custom Fields</h4>

                    <div className="grid grid-cols-2 gap-3">
                      {input.customFields.map((cf, idx) => {
                        const key = Object.keys(cf)[0];
                        const value = cf[key];
                        return <Row key={idx} label={key} value={value} />;
                      })}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ===== Props ===== */}
        {props && Object.keys(props).length > 0 && (
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-blue-500 mb-4">
              Props Configuration (Per Source Type)
            </h3>

            {Object.entries(props).map(([sourceType, cfg]) => (
              <div
                key={sourceType}
                className="border rounded-lg p-4 mb-4 bg-gray-50"
              >
                <div className="font-semibold text-blue-600 mb-3">
                  Source Type: {sourceType}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(cfg).map(([k, v]) => (
                    <Row key={k} label={k} value={v} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== Transforms ===== */}
        {transform &&
          (Array.isArray(transform)
            ? transform.length > 0
            : Object.keys(transform).length > 0) && (
            <div className="bg-white rounded-lg shadow p-5">
              <h3 className="text-lg font-semibold text-blue-500 mb-4">
                Transforms Configuration
              </h3>

              {(Array.isArray(transform)
                ? transform.map((t, i) => ({
                    __name: `Transform ${i + 1}`,
                    ...t,
                  }))
                : Object.entries(transform).map(([name, t]) => ({
                    __name: name, // REAL transform name
                    ...t,
                  }))
              ).map((t, i) => {
                const hasAnyValue = Object.values(t).some(
                  (v) => v !== undefined && v !== null && v !== "",
                );

                return (
                  <div
                    key={t.__name || i}
                    className="border rounded-lg p-4 mb-4 bg-gray-50"
                  >
                    {/*Transform Title */}
                    <div className="font-semibold mb-2 text-blue-700">
                      Transform Name:{" "}
                      <span className="text-gray-800">{t.__name}</span>
                    </div>

                    {/* Values */}
                    <div className="grid grid-cols-2 gap-4">
                      <Row label="Regex" value={t.regex} />
                      <Row label="Format" value={t.format} />
                      <Row label="Destination Key" value={t.destKey} />
                      <Row label="New Key" value={t.newKey} />
                      <Row label="New Value" value={t.newValue} />
                    </div>

                    {!hasAnyValue && (
                      <div className="text-sm text-gray-400 italic mt-2">
                        No transform values configured yet
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
      </div>
    );
  };

  const Section = ({ title, children }) => (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold text-blue-600 mb-3">{title}</h3>
      {children}
    </div>
  );

  // const Row = ({ label, value }) => (
  //   <div className="text-sm grid grid-cols-2 gap-4 mb-1">
  //     <div className="font-medium">{label || "-"}:</div>
  //     <div>
  //       {value === true
  //         ? "true"
  //         : value === false
  //         ? "false"
  //         : value !== undefined && value !== null
  //         ? value
  //         : "-"}
  //     </div>
  //   </div>
  // );

  const Row = ({ label, value }) => {
    // DO NOT RENDER if value is empty
    if (value === undefined || value === null || value === "") {
      return null;
    }

    return (
      <div className="text-sm grid grid-cols-2 gap-4 mb-1">
        <div className="font-medium">{label}:</div>
        <div>{value === true ? "true" : value === false ? "false" : value}</div>
      </div>
    );
  };

  const Divider = () => <hr className="my-2 border-gray-300" />;

  const handleInputChangeInAppName = (e) => {
    let value = e.target.value;
    console.log("valuees", e);

    if (e.nativeEvent.inputType === "deleteContentBackward") {
      // let lastValue=inputsFormat.appName.lastIndexOf("_");
      // let changedAppValue=inputsFormat.appName.substring(0,lastValue);
      // value=changedAppValue;
      let changedAppName = inputsFormat.appName.split("_");
      console.log("changedAppName", changedAppName[changedAppName.length - 1]);
      if (
        existingAppName.includes(
          "_" + changedAppName[changedAppName.length - 1],
        )
      ) {
        let lastIndex = inputsFormat.appName.lastIndexOf("_");
        console.log("lastIndex", lastIndex);
        value = inputsFormat.appName.slice(0, lastIndex);
      }
    }

    setAppName(value);

    // setInputsFormat((prev) => ({
    //   ...prev,
    //   appName: value,
    // }));
    setInputsFormat((prev) => ({
      ...prev,
      appName: value,
      indexName: "",
      indexConfig: {},
    }));

    if (value.trim() === "") {
      setAppNameSuggestions([]);
      return;
    }

    //  find if input already ends with a known suffix
    const matchedSuffix = existingAppName.find((suf) => value.endsWith(suf));

    const base = matchedSuffix
      ? value.slice(0, value.length - matchedSuffix.length)
      : value;

    // const generated = existingAppName.map((suf) => `${base}${suf}`);
    const generated = [value, ...existingAppName.map((suf) => `${base}${suf}`)];

    setAppNameSuggestions(generated);
  };

  useEffect(() => {
    const arr = Array.from({ length: inputsConfig }, (_, i) => i + 1);
    setInputsConfigList(arr);
  }, [inputsConfig]);

  // const cancelConfig = (val) => {
  //   if (inputsConfigList.length > 1) {
  //     const inputs = inputsConfigList.filter((each) => each !== val);
  //     setInputsConfigList(inputs);
  //   }
  // };

  // const cancelConfig = (val) => {
  //   // Prevent deleting last input

  //   val = val - 1;
  //   console.log("valsss", val);
  //   console.log("inputtttsssss", inputsFormat);
  //   if (inputsFormat.inputs.length === 1) {
  //     setInputDeleteError("At least one input configuration is required.");
  //     return;
  //   }

  //   setInputDeleteError("");

  //   setInputsFormat((prev) => {
  //     // find input being removed
  //     const removedInput = prev.inputs.find((i, index) => index === val);

  //     // remove input
  //     const updatedInputs = prev.inputs.filter((i, index) => index == val);

  //     // remove related props
  //     const updatedProps = { ...prev.props };
  //     if (removedInput?.sourceType) {
  //       delete updatedProps[removedInput.sourceType];
  //     }

  //     return {
  //       ...prev,
  //       inputs: updatedInputs,
  //       props: updatedProps,
  //     };
  //   });

  //   // update UI list AFTER main object update
  //   setInputsConfigList((prev) => prev.filter((id) => id !== val));
  // };

  const cancelConfig = (val) => {
    // alert("value: " + val);
    // let count = 0;
    // let count1 = 0;
    // alert("count1: " + count1);
    //  Prevent deleting last input

    console.log("val", val);
    if (inputsFormat.inputs.length === 1) {
      setInputDeleteError("At least one input configuration is required.");
      return;
    }

    setInputDeleteError("");

    setInputsFormat((prev) => {
      // find input being removed
      // const removedInput = prev.inputs.find((i) => i.id === val);
      // alert((count++) + "removed Input: "+removedInput.value);

      // const removedInput = prev.inputs.find((i, index) => index + 1 === val);
      const removedInput = prev.inputs.find((i) => i.id === val);

      if (!removedInput) return;

      Object.entries(removedInput).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });

      // alert(`${count++} Input removed. Check co  nsole for details.`);

      // remove input
      // const updatedInputs = prev.inputs.filter((i, index) => index + 1 !== val);
      const updatedInputs = prev.inputs.filter((i) => i.id !== val);

      // remove related props
      let updatedProps = { ...prev.props };
      if (removedInput?.sourceType) {
        // delete updatedProps[removedInput.sourceType];
        // alert("successfully deleted");
        updatedProps = Object.fromEntries(
          Object.entries(updatedProps).filter(
            ([key]) => key !== removedInput.sourceType,
          ),
        );
      }

      console.log("updatedInputs", updatedInputs);
      console.log("updatedProps", updatedProps);

      return {
        ...prev,
        inputs: updatedInputs,
        props: updatedProps,
      };
    });

    // update UI list AFTER main object update
    setInputsConfigList((prev) => prev.filter((id) => id !== val));
  };

  const handleCreateApp = () => {
    console.log("inputs format : ", inputsFormat);
  };

  const handleInputConfigs = () => {
    const newId = inputsConfigList.length + 1;
    // setInputsConfig(inputsConfig + 1)
    const customInputData = {
      id: newId,
      filePath: "",
      sourceType: "",
      index: "",
      customFields: [],
    };
    // const propsConfig={
    // timeFormat: "",
    // dateTime: "",
    // lineBreaker: "",
    // shouldLine: "",
    // truncate: "",}
    setInputsConfigList((prev) => [...prev, newId]);
    setInputsFormat((prev) => ({
      ...prev,
      inputs: [...prev.inputs, customInputData],
    }));
  };

  const handleIndexConfig = () => {
    const newId = inputsConfigList.length + 1;
    const newConfig = {
      id: newId,
      hotPath: "",
      coldPath: "",
      thawedPath: "",
      MAXsize: "",
      retentionTime: "",
    };

    setInputsConfigList((prevList) => [...prevList, newConfig]);
  };

  const handleTransforms = () => {
    const transformsData = {
      newKey: "",
      newValue: "",
      regex: "",
      format: "",
      destKey: "",
    };

    setInputsFormat((prev) => ({
      ...prev,
      transform: [...prev.transform, transformsData],
    }));
  };

  // const handleIndexFocus = () => {
  //   if (mode === "new" && indexName === "" && inputsFormat.appName !== "") {
  //     const base = inputsFormat.appName.trim();
  //     const newSuggestions = base
  //       ? possibleSuffixes.map((suffix) => `${base}${suffix}`)
  //       : possibleSuffixes;
  //     setSuggestions(newSuggestions);
  //   } else if (mode === "new" && indexName !== "") {
  //     const base = indexName.trim();
  //     const newSuggestions = base
  //       ? possibleSuffixes.map((suffix) => `${base}${suffix}`)
  //       : possibleSuffixes;
  //     setSuggestions(newSuggestions);
  //   }
  // };

  const handleIndexFocus = () => {
    if (mode !== "new") return;

    const appBase = inputsFormat.appName?.trim();
    if (!appBase) return;

    setSuggestions([
      appBase,
      ...possibleSuffixes.map((suf) => `${appBase}${suf}`),
    ]);
  };

  // useEffect(() => {
  //   if (mode === "new" && indexName !== "") {
  //     const base = indexName.trim();
  //     const newSuggestions = base
  //       ? possibleSuffixes.map((suffix) => `${base}${suffix}`)
  //       : possibleSuffixes;
  //     setSuggestions(newSuggestions);
  //   }
  // }, [indexName]);
  useEffect(() => {
    if (mode !== "new") return;

    const appBase = inputsFormat.appName?.trim();
    if (!indexName || !appBase) return;

    const generated = [
      indexName, // user typed
      appBase, // app name
      ...possibleSuffixes.map((suf) => `${appBase}${suf}`),
    ];

    setSuggestions([...new Set(generated)]);
  }, [indexName, mode, inputsFormat.appName]);

  const loginWithGitHub = () => {
    window.location.href = "http://127.0.0.1:5000/login/github";
  };

  console.log("rposs", repos);

  console.log("Hec Token Details:", hecTokenDetails);
  console.log("Uf Token Details:", ufTokenDetails);

  return (
    <div className="flex flex-col justify-start items-center p-6 bg-gray-100 min-h-screen">
      {/* <h2 className="text-blue-600 font-bold text-2xl mb-6">
        Dynamic Splunk App Builder
      </h2>

      <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
        🔗 Connect GitHub
      </button> */}

      <div className="w-full flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-blue-600">
          Dynamic Splunk App Builder
        </h1>

        {/* GitHub Button */}
        <button
          className="
flex items-center gap-2
  px-5 py-2
  border border-gray-300
  rounded-full
  text-sm font-medium
  bg-white
  text-gray-700

  hover:bg-gray-100
  hover:border-gray-400

  active:bg-gray-200
  active:scale-95

  focus:outline-none
  focus:ring-2
  focus:ring-blue-500
  focus:ring-offset-2

  transition
"
          onClick={loginWithGitHub}
        >
          🔗 Connect GitHub
        </button>
      </div>

      {/* {isPreview ? (
        // <PreviewPage />
        <PreviewPage
          inputsFormat={inputsFormat}
          onBack={() => setIsPreview(false)}
        />
      ) : ( */}
      <div style={{ display: isPreview ? "block" : "none", width: "100%" }}>
        <PreviewPage
          inputsFormat={inputsFormat}
          onBack={() => setIsPreview(false)}
        />
      </div>
      <div
        className="w-full  bg-white shadow-md rounded-xl p-6"
        style={{ display: isPreview ? "none" : "block" }}
      >
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* ───────── App Name Card ───────── */}
          <div className="flex flex-col relative bg-white shadow rounded-xl p-6">
            <h2 className="text-lg font-semibold text-black-600 mb-2">
              App Name
            </h2>
            <div>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="existing"
                    checked={appMode === "existing"}
                    onChange={() => {
                      (setAppMode("existing"), setAppName(""));
                      setInputsFormat((prev) => ({
                        ...prev,
                        appName: "",
                      }));
                    }}
                    className="accent-blue-600"
                  />
                  <span>Existing App</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="new"
                    checked={appMode === "new"}
                    onChange={() => {
                      setAppMode("new");
                      setAppName("");
                      setInputsFormat((prev) => ({
                        ...prev,
                        appName: "",
                      }));
                      setHecTokenDetails((prev) => ({
                        ...prev,
                        appName: "",
                      }));
                      setUfTokenDetails((prev) => ({
                        ...prev,
                        appName: "",
                      }));
                    }}
                    className="accent-blue-600"
                  />
                  <span>New App</span>
                </label>
              </div>

              {appMode === "existing" ? (
                <div className="flex flex-col">
                  <label htmlFor="existingAppName" className="font-medium mb-1">
                    Select Existing App name
                  </label>
                  <select
                    id="existingAppName"
                    className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                    onChange={(e) => {
                      setInputsFormat((prev) => ({
                        ...prev,
                        appName: e.target.value,
                        // indexConfig: {
                        //   [e.target.value]: {
                        //     retentionTime: "",
                        //     customFields: [],
                        //   },
                        // },
                      }));

                      setHecTokenDetails((prev) => ({
                        ...prev,
                        appName: e.target.value,
                      }));
                      setUfTokenDetails((prev) => ({
                        ...prev,
                        appName: e.target.value,
                      }));
                    }}
                  >
                    <option value="">-- Choose an app name --</option>
                    {repoNames.map((index) => (
                      <option key={index} value={index}>
                        {index}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="existingAppName" className="font-medium mb-1">
                    Select Branches
                  </label>

                  <select
                    id="braches"
                    className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                    onChange={(e) => setSelectedBranch(e.target.value)}
                  >
                    <option value="">-- Choose an app name --</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex flex-col relative">
                  <label htmlFor="newAppName" className="font-medium mb-1">
                    Enter New App Name
                  </label>

                  <input
                    id="newAppName"
                    value={inputsFormat.appName}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAppName(value);

                      setInputsFormat((prev) => ({
                        ...prev,
                        appName: value,
                      }));
                      setHecTokenDetails((prev) => ({
                        ...prev,
                        appName: value,
                      }));

                      setUfTokenDetails((prev) => ({
                        ...prev,
                        appName: value,
                      }));
                    }}
                    placeholder="Enter App name"
                    className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                  />

                  {appNameSuggestions.length > 0 &&
                    inputsFormat.appName === "" && (
                      <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                        {appNameSuggestions.map((sug) => (
                          <li
                            key={sug}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                              setInputsFormat((prev) => ({
                                ...prev,
                                appName: sug,
                                // indexConfig: {
                                //   ...prev.indexConfig,
                                //   [sug]: {
                                //     retentionTime: "",
                                //     customFields: [],
                                //   },
                                // },
                              }));
                              setHecTokenDetails((prev) => ({
                                ...prev,
                                appName: sug,
                              }));
                              setUfTokenDetails((prev) => ({
                                ...prev,
                                appName: sug,
                              }));
                              setAppName(sug);
                              setAppNameSuggestions([]);
                            }}
                          >
                            {sug}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* ---------------------------- */}
          {/* <div className="flex flex-col bg-white shadow rounded-lg p-4">
            <label htmlFor="indexName" className="font-medium mb-1">
              Index Name
            </label>
            <input
              id="indexName"
              className="border border-gray-400 rounded-md px-3 py-2"
              onChange={(e) => {
                  setInputsFormat((prev) => ({
                    ...prev,
                    indexName: e.target.value,
                  }));
                }}
              placeholder="Enter Index Name"
            />


          </div> */}

          {/* ------------------------ */}

          <div className="flex flex-col bg-white shadow rounded-lg p-4 space-y-3 gap-0 ">
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-black-600 mb-2">
                Index Name
              </h2>
              <div className="flex flex-row gap-10">
                <div>
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="existing"
                        checked={mode === "existing"}
                        onChange={() => {
                          (setMode("existing"),
                            setInputsFormat((prev) => ({
                              ...prev,
                              indexName: "",
                            })));

                          setHecTokenDetails((prev) => ({
                            ...prev,
                            indexName: "",
                          }));
                          setUfTokenDetails((prev) => ({
                            ...prev,
                            indexName: "",
                          }));
                        }}
                        className="accent-blue-600"
                      />
                      <span>Existing Index</span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="new"
                        checked={mode === "new"}
                        onChange={() => {
                          (setMode("new"),
                            setInputsFormat((prev) => ({
                              ...prev,
                              indexName: "",
                            })));
                          setHecTokenDetails((prev) => ({
                            ...prev,
                            indexName: "",
                          }));
                          setUfTokenDetails((prev) => ({
                            ...prev,
                            indexName: "",
                          }));
                        }}
                        className="accent-blue-600"
                      />
                      <span>New Index</span>
                    </label>
                  </div>

                  {mode === "existing" ? (
                    <div className="flex flex-col">
                      <label
                        htmlFor="existingIndex"
                        className="font-medium mb-1"
                      >
                        Select Existing Index
                      </label>
                      <select
                        id="existingIndex"
                        className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                        onChange={(e) => {
                          // setInputsFormat((prev) => {
                          //   return {
                          //     ...prev,
                          //     indexName: e.target.value,
                          //     indexConfig: {
                          //       ...prev.indexConfig,
                          //       [e.target.value]: {
                          //         retentionTime: "",
                          //         customFields: [],
                          //       },
                          //     },
                          //   };
                          // });
                          setInputsFormat((prev) => ({
                            ...prev,
                            indexName: e.target.value,
                            indexConfig: {
                              [e.target.value]: {
                                retentionTime: "",
                                customFields: [],
                              },
                            },
                          }));
                          setHecTokenDetails((prev) => ({
                            ...prev,
                            indexName: e.target.value,
                          }));
                          setUfTokenDetails((prev) => ({
                            ...prev,
                            indexName: e.target.value,
                          }));
                        }}
                      >
                        <option value="">-- Choose an index --</option>
                        {existingConfig.map((index) => (
                          <option key={index} value={index}>
                            {index}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div className="flex flex-col relative">
                      <label htmlFor="newIndex" className="font-medium mb-1">
                        Enter New Index
                      </label>
                      <input
                        id="newIndex"
                        value={indexName}
                        onFocus={handleIndexFocus}
                        onChange={handleInputChange}
                        placeholder="Enter index name"
                        className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                      />

                      {/* Suggestions */}
                      {/* {(suggestions.length > 0 && inputsFormat.indexName !== indexName) && (
                  <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                    {suggestions.map((sug) => (
                      <li
                        key={sug}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setInputsFormat((prev) => {
                            return {
                              ...prev,
                              indexName: indexName + sug,
                              indexConfig: {
                                ...prev.indexConfig,
                                [indexName + sug]: {
                                  hotPath: "",
                                  coldPath: "",
                                  thawedPath: "",
                                  MAXsize: "",
                                  retentionTime: "",
                                  customFields: []
                                }
                              }

                            }
                          }),
                            setIndexName(indexName + sug)
                        }}

                      >
                        {indexName}
                        <span className="text-gray-400">{sug}</span>
                      </li>
                    ))}
                  </ul>
                )} */}
                      {suggestions.length > 0 &&
                        inputsFormat.indexName === "" && (
                          <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                            {suggestions.map((sug) => (
                              <li
                                key={sug}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setInputsFormat((prev) => ({
                                    ...prev,
                                    indexName: sug,
                                    indexConfig: {
                                      ...prev.indexConfig,
                                      [sug]: {
                                        retentionTime: "",
                                        customFields: [],
                                      },
                                    },
                                  }));
                                  setIndexName(sug);
                                  setSuggestions([]);
                                }}
                              >
                                {sug}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  )}
                </div>
                {mode === "new" && (
                  <div className="flex flex-col  rounded-lg mt-5">
                    <label htmlFor="appName" className="font-medium mb-1">
                      Retention Days
                    </label>
                    <input
                      className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                      name="retentionTime"
                      type="text"
                      /*1. CONTROL THE INPUT */
                      value={
                        inputsFormat.indexConfig[inputsFormat.indexName]
                          ?.retentionTime || ""
                      }
                      /*2. PRESERVE EXISTING INDEX CONFIG */
                      onChange={(e) => {
                        const value = e.target.value;

                        // allow empty delete
                        if (value === "") {
                          setInputsFormat((prev) => {
                            if (!prev.indexName) return prev;
                            return {
                              ...prev,
                              indexConfig: {
                                [prev.indexName]: {
                                  retentionTime: "",
                                },
                              },
                            };
                          });
                          return;
                        }

                        // allow only numbers
                        if (!/^\d+$/.test(value)) return;

                        setInputsFormat((prev) => {
                          if (!prev.indexName) return prev;

                          return {
                            ...prev,
                            // IMPORTANT: overwrite indexConfig completely
                            indexConfig: {
                              [prev.indexName]: {
                                retentionTime: value,
                              },
                            },
                          };
                        });
                      }}
                      placeholder="Enter Retention Days"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="bg-white shadow rounded-lg p-4 mb-6">
              {/* Source Type Input */}
              <div className="flex flex-col mb-4">
                <label className="font-medium mb-1">Source Type</label>

                {/* Dropdown always visible */}
                {inputsFormat.inputs[0]?.sourceTypeMode !== "custom" && (
                  <select
                    className="border border-gray-300 rounded-lg px-3 py-2"
                    value={inputsFormat.inputs[0]?.sourceType || ""}
                    onChange={(e) => {
                      const value = e.target.value;

                      setInputsFormat((prev) => {
                        const updatedInputs = [...prev.inputs];

                        if (value === "__custom__") {
                          updatedInputs[0] = {
                            ...updatedInputs[0],
                            sourceType: "", // DO NOT store "__custom__"
                            sourceTypeMode: "custom",
                          };
                        } else {
                          updatedInputs[0] = {
                            ...updatedInputs[0],
                            sourceType: value,
                            sourceTypeMode: "dropdown",
                          };
                        }

                        return {
                          ...prev,
                          inputs: updatedInputs,
                        };
                      });
                    }}
                  >
                    <option value="">-- Select Source Type --</option>

                    {parsedSourceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}

                    <option value="__custom__">Custom</option>
                  </select>
                )}

                {/* Custom input shown separately */}
                {inputsFormat.inputs[0]?.sourceTypeMode === "custom" && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter custom source type"
                      className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
                      value={inputsFormat.inputs[0]?.sourceType || ""}
                      onChange={(e) => {
                        const value = e.target.value;

                        setInputsFormat((prev) => {
                          const updatedInputs = [...prev.inputs];

                          updatedInputs[0] = {
                            ...updatedInputs[0],
                            sourceType: value,
                          };

                          return {
                            ...prev,
                            inputs: updatedInputs,
                          };
                        });
                      }}
                    />

                    <button
                      type="button"
                      className="px-3 py-2 bg-gray-200 rounded-lg"
                      onClick={() => {
                        setInputsFormat((prev) => {
                          const updatedInputs = [...prev.inputs];

                          updatedInputs[0] = {
                            ...updatedInputs[0],
                            sourceType: "",
                            sourceTypeMode: "dropdown",
                          };

                          return {
                            ...prev,
                            inputs: updatedInputs,
                          };
                        });
                      }}
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>

              <label className="font-medium mb-2">Collection Methods</label>

              {/* Radio Buttons */}
              <div className="flex flex-col gap-4">
                {/* Radio Buttons Row */}
                <div className="flex gap-8">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sourceMode"
                      value={SOURCE_MODES.HEC}
                      checked={sourceMode === SOURCE_MODES.HEC}
                      onChange={() => setSourceMode(SOURCE_MODES.HEC)}
                      className="accent-blue-600"
                    />
                    <span>HEC Token</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sourceMode"
                      value={SOURCE_MODES.UF}
                      checked={sourceMode === SOURCE_MODES.UF}
                      onChange={() => setSourceMode(SOURCE_MODES.UF)}
                      className="accent-blue-600"
                    />
                    <span>Universal Forwarder</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sourceMode"
                      value={SOURCE_MODES.CONF}
                      checked={sourceMode === SOURCE_MODES.CONF}
                      onChange={() => setSourceMode(SOURCE_MODES.CONF)}
                      className="accent-blue-600"
                    />
                    <span>Sys Log</span>
                  </label>
                </div>

                {/* Syslog Upload Section BELOW radios */}
                {sourceMode === SOURCE_MODES.CONF && (
                  <div className="mt-3 max-w-sm">
                    <h4 className="text-sm font-medium mb-1 text-gray-700">
                      Upload Sys Log File
                    </h4>

                    <input
                      type="file"
                      accept=".log,.txt,.csv"
                      onChange={handleSyslogFileUpload}
                      className="block w-full text-sm border border-gray-300 rounded-md px-2 py-1"
                    />

                    {/* {syslogFile && (
                      <p className="text-xs text-green-600 mt-1">
                        {syslogFile.name}
                      </p>
                    )} */}

                    {syslogError && (
                      <p className="text-xs text-red-600 mt-1">{syslogError}</p>
                    )}

                    <p className="text-[11px] text-gray-500 mt-1">
                      .log, .txt, .csv | Max 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ───────── Source Type + Mode Selection ───────── */}

        {/* {sourceMode === SOURCE_MODES.HEC && (
          <div className="border rounded-lg p-6 mb-6 bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">
              HEC Token Configuration
            </h2>
            <div className="h-24 border border-dashed rounded-md flex items-center justify-center text-gray-400">
              HEC Token inputs go here
            </div>
          </div>
        )} */}

        {sourceMode === SOURCE_MODES.HEC && (
          <div className="border rounded-lg p-6 mb-6 bg-white">
            <HECToken
              hecTokenDetails={hecTokenDetails}
              setHecTokenDetails={setHecTokenDetails}
              inputsFormat={inputsFormat}
              setInputsFormat={setInputsFormat}
            />
          </div>
        )}

        {/* {sourceMode === SOURCE_MODES.UF && (
          <div className="border rounded-lg p-6 mb-6 bg-gray-50">
            <h2 className="text-lg font-semibold mb-2">
              Universal Forwarder Configuration
            </h2>
            <div className="h-24 border border-dashed rounded-md flex items-center justify-center text-gray-400">
              Universal Forwarder config goes here
            </div>
          </div>
        )} */}

        {sourceMode === SOURCE_MODES.UF && (
          <div className="border rounded-lg p-6 mb-6 bg-white">
            <UniversalForwarder
              ufTokenDetails={ufTokenDetails}
              setUfTokenDetails={setUfTokenDetails}
            />
          </div>
        )}

        {/* {Object.keys(inputsFormat.indexConfig).length > 0 &&
          <IndexConfig key={Object.keys(inputsFormat.indexConfig)[0]} indexName={Object.keys(inputsFormat.indexConfig)[0]} inputsFormat={inputsFormat} setInputsFormat={setInputsFormat} />
        } */}

        {sourceMode === SOURCE_MODES.CONF && (
          <>
            <div>
              <h2 className="text-xl font-semibold mb-2">Inputs Config</h2>
              <hr className="mb-4 text-blue-500" />
            </div>

            {/* <div className="flex flex-col gap-6">
          {inputsConfigList.map((each) => (
            <InputConfig
              key={each}
              cancelConfig={cancelConfig}
              each={each}
              inputsFormat={inputsFormat}
              setInputsFormat={setInputsFormat}
              handleTransforms={handleTransforms}
            />
          ))}
        </div> */}
            {inputDeleteError && (
              <p className="text-red-500 text-sm mb-3 font-medium">
                {inputDeleteError}
              </p>
            )}

            <div className="flex flex-col gap-6">
              {/* {inputsFormat.inputs.map((v, index) => {
              const each = index + 1;
              return (
                <div
                  key={each}
                  className="bg-white border border-gray-300 rounded-xl p-4 shadow"
                >
                  <InputConfig
                    cancelConfig={cancelConfig}
                    each={each}
                    inputsFormat={inputsFormat}
                    setInputsFormat={setInputsFormat}
                    handleTransforms={handleTransforms}
                  />
                </div>
              );
            })} */}

              {/* {inputsFormat.inputs.map((each, index) => (
                <div
                  key={index + 1}
                  className="bg-white border border-gray-300 rounded-xl p-4 shadow"
                >
                  <InputConfig
                    configFiles={configFiles}
                    cancelConfig={cancelConfig}
                    each={index + 1}
                    inputsFormat={inputsFormat}
                    setInputsFormat={setInputsFormat}
                    handleTransforms={handleTransforms}
                  />
                </div>
              ))} */}

              {inputsFormat.inputs.map((input) => (
                <div
                  key={input.id}
                  className="bg-white border border-gray-300 rounded-xl p-4 shadow"
                >
                  <InputConfig
                    configFiles={configFiles}
                    cancelConfig={cancelConfig}
                    syslogFile={syslogFile}
                    each={input.id}
                    inputsFormat={inputsFormat}
                    setInputsFormat={setInputsFormat}
                    handleTransforms={handleTransforms}
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
                onClick={handleInputConfigs}
              >
                + Add Input
              </button>
            </div>
          </>
        )}
        <div className="flex flex-row gap-1.5">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600"
            onClick={handleCreateApp}
          >
            Create App
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600"
            onClick={() => setIsPreview(true)}
          >
            Preview
          </button>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default Main;
