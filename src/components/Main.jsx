import React, { useState, useEffect, use } from "react";
import InputConfig from "./InputConfig";
import TransformsConfig from "./TransformsConfig";
import { IndexConfig } from "./IndexConfig";

const Main = () => {
  const [inputsConfig, setInputsConfig] = useState([1]);
  const [inputsConfigList, setInputsConfigList] = useState([]);

  const [mode, setMode] = useState("new");
  const [indexName, setIndexName] = useState("");
  const [appName, setAppName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [appNameSuggestions, setAppNameSuggestions] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [inputDeleteError, setInputDeleteError] = useState("");

  const existingIndexes = ["users_index", "orders_index", "products_index"];
  const possibleSuffixes = ["_logs", "_data"];
  const existingAppName = ["_logs", "_data", "_metrics"];

  const handleInputChange = (e) => {
    let value = e.target.value;
    if (e.nativeEvent.inputType === "deleteContentBackward") {
      let changedIndexName = inputsFormat.indexName.split("_");
      console.log(
        "changed INdex Name",
        changedIndexName[changedIndexName.length - 1]
      );
      if (
        possibleSuffixes.includes(
          "_" + changedIndexName[changedIndexName.length - 1]
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

  //   const PreviewPage = () => (
  //   <div className="w-full bg-white shadow-md rounded-xl p-6">
  //     <h2 className="text-2xl font-bold mb-4 text-blue-600">
  //       App Configuration Preview
  //     </h2>

  //     <div className="bg-gray-100 rounded-lg p-4 overflow-auto max-h-[500px] text-sm">
  //       <pre>{JSON.stringify(inputsFormat, null, 2)}</pre>
  //     </div>

  //     <div className="flex justify-end mt-6">
  //       <button
  //         className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
  //         onClick={() => setIsPreview(false)}
  //       >
  //         Back
  //       </button>
  //     </div>
  //   </div>
  // );

  const PreviewPage = () => {
    const { appName, indexName, indexConfig, inputs, props } = inputsFormat;

    return (
      <div className="w-full bg-white shadow-md rounded-xl p-6 space-y-6">
        {/* ───────── App / Index Config ───────── */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-2">
            App Configuration
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <b>App Name:</b> {appName || "-"}
            </div>
            <div>
              <b>Index Name:</b> {indexName || "-"}
            </div>

            {Object.entries(indexConfig).map(([idx, cfg]) => (
              <div key={idx}>
                <b>Retention Days ({idx}):</b> {cfg.retentionTime || "-"}
              </div>
            ))}
          </div>
        </div>

        {/* ───────── Inputs Config ───────── */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-600 mb-3">
            Inputs Configuration
          </h3>

          {inputs.map((input, i) => (
            <div
              key={input.id}
              className="border rounded-md p-3 mb-3 bg-gray-50"
            >
              <div className="font-medium mb-1">Input #{i + 1}</div>
              <div className="text-sm grid grid-cols-2 gap-2">
                <div>
                  <b>File Path:</b> {input.filePath || "-"}
                </div>
                <div>
                  <b>Source Type:</b> {input.sourceType || "-"}
                </div>
                <div>
                  <b>Index:</b> {input.index || indexName}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ───────── Props Config Per Source Type ───────── */}
        {props && Object.keys(props).length > 0 && (
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">
              Props Configuration (Per Source Type)
            </h3>

            {Object.entries(props).map(([sourceType, cfg]) => (
              <div
                key={sourceType}
                className="border rounded-md p-3 mb-3 bg-gray-50"
              >
                <div className="font-medium mb-2">
                  Source Type:{" "}
                  <span className="text-blue-600">{sourceType}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <b>Time Format:</b> {cfg.timeFormat || "-"}
                  </div>
                  <div>
                    <b>Date Time:</b> {cfg.dateTime || "-"}
                  </div>
                  <div>
                    <b>Line Breaker:</b> {cfg.lineBreaker || "-"}
                  </div>
                  <div>
                    <b>Should Line:</b> {cfg.shouldLine || "-"}
                  </div>
                  <div>
                    <b>Truncate:</b> {cfg.truncate || "-"}
                  </div>
                </div>

                {/* ───────── Global Transforms Config ───────── */}
                {inputsFormat.transform &&
                  Object.keys(inputsFormat.transform).length > 0 && (
                    <div className="border rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-blue-600 mb-3">
                        Transforms Configuration
                      </h3>

                      {Object.entries(inputsFormat.transform).map(
                        ([key, t], index) => (
                          <div
                            key={key}
                            className="border rounded-md p-3 mb-3 bg-gray-50 text-sm"
                          >
                            <div className="font-medium mb-2">
                              Transform #{index + 1}
                            </div>

                            <div>
                              <b>Regex:</b> {t.regex || "-"}
                            </div>
                            <div>
                              <b>Format:</b> {t.format || "-"}
                            </div>
                            <div>
                              <b>Destination Key:</b> {t.destKey || "-"}
                            </div>
                            <div>
                              <b>New Key:</b> {t.newKey || "-"}
                            </div>
                            <div>
                              <b>New Value:</b> {t.newValue || "-"}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}

        {/* ───────── Actions ───────── */}
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={() => setIsPreview(false)}
          >
            Back
          </button>

          {/* <button
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
          onClick={handleCreateApp}
        >
          Confirm & Create
        </button> */}
        </div>
      </div>
    );
  };

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
          "_" + changedAppName[changedAppName.length - 1]
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
  //   // ❌ Prevent deleting last input

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

    console.log("val", val)
    if (inputsFormat.inputs.length === 1) {
      setInputDeleteError("At least one input configuration is required.");
      return;
    }

    setInputDeleteError("");

    setInputsFormat((prev) => {
      // find input being removed
      // const removedInput = prev.inputs.find((i) => i.id === val);
      // alert((count++) + "removed Input: "+removedInput.value);
      const removedInput = prev.inputs.find((i,index) => index+1 === val);

      if (!removedInput) return;

      Object.entries(removedInput).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });

      // alert(`${count++} Input removed. Check console for details.`);

      // remove input
      const updatedInputs = prev.inputs.filter((i,index) => index+1 !== val);

      // remove related props
      let updatedProps = { ...prev.props };
      if (removedInput?.sourceType) {
        // delete updatedProps[removedInput.sourceType];
        // alert("successfully deleted");
        updatedProps=Object.fromEntries(
  Object.entries(updatedProps).filter(([key]) => key !== removedInput.sourceType))
      }

      console.log("updatedInputs", updatedInputs)
      console.log("updatedProps", updatedProps)

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

  return (
    <div className="flex flex-col justify-start items-center p-6 bg-gray-100 min-h-screen">
      <h2 className="text-blue-600 font-bold text-2xl mb-6">
        Dynamic Splunk App Builder
      </h2>
      {isPreview ? (
        <PreviewPage />
      ) : (
        <div className="w-full  bg-white shadow-md rounded-xl p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col relative">
              <label htmlFor="appName" className="font-medium mb-1">
                App Name
              </label>
              <input
                id="appName"
                value={inputsFormat.appName} // ✅ ADD THIS
                className="border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                onChange={handleInputChangeInAppName}
                placeholder="Enter App Name"
              />

              {appNameSuggestions.length > 0 && (
                <ul className="top-full left-0 right-0 bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto z-10">
                  {appNameSuggestions.map((sug) => (
                    <li
                      key={sug}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      // onMouseDown={() => {
                      //   setInputsFormat((prev) => ({
                      //     ...prev,
                      //     appName: sug,
                      //   }));
                      //   // setAppName(sug);
                      //   setAppNameSuggestions([]);
                      // }}
                      onMouseDown={() => {
                        setInputsFormat((prev) => ({
                          ...prev,
                          appName: sug,
                          indexName: "", // ✅ RESET
                          indexConfig: {}, // ✅ CLEAR OLD INDEXES
                        }));
                        setIndexName(""); // ✅ RESET LOCAL STATE
                        setAppNameSuggestions([]);
                      }}
                    >
                      {sug}
                    </li>
                  ))}
                </ul>
              )}
            </div>
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

            <div className="flex flex-row bg-white shadow rounded-lg p-4 space-y-3 gap-20 ">
              <div>
                <div className="flex space-x-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="existing"
                      checked={mode === "existing"}
                      onChange={() => {
                        setMode("existing"),
                          setInputsFormat((prev) => ({
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
                        setMode("new"),
                          setInputsFormat((prev) => ({
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
                    <label htmlFor="existingIndex" className="font-medium mb-1">
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
                      }}
                    >
                      <option value="">-- Choose an index --</option>
                      {existingIndexes.map((index) => (
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
                    onChange={(e) => {
                      setInputsFormat((prev) => ({
                        ...prev,
                        // indexConfig: {
                        //   ...prev.indexConfig,
                        //   [indexName]: {
                        //     ...prev.indexConfig[indexName],
                        //     retentionTime: e.target.value,
                        //   },
                        // },
                        indexConfig: {
                          [indexName]: {
                            ...prev.indexConfig[indexName],
                            retentionTime: e.target.value,
                          },
                        },
                      }));
                    }}
                    placeholder="Enter Retention Days"
                  />
                </div>
              )}
            </div>
          </div>

          {/* {Object.keys(inputsFormat.indexConfig).length > 0 &&
          <IndexConfig key={Object.keys(inputsFormat.indexConfig)[0]} indexName={Object.keys(inputsFormat.indexConfig)[0]} inputsFormat={inputsFormat} setInputsFormat={setInputsFormat} />
        } */}

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

            {inputsFormat.inputs.map((each,index) => (
              <div
                key={index+1}
                className="bg-white border border-gray-300 rounded-xl p-4 shadow"
              >
                <InputConfig
                  cancelConfig={cancelConfig}
                  each={index+1}
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
      )}
    </div>
  );
};

export default Main;
