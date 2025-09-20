import React, { useState, useEffect } from "react";

const TransformsConfig = ({ transforms, setTransforms, updateTransform, newKey }) => {
  const [logFile, setLogFile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [transformedLogs, setTransformedLogs] = useState({});
  const [filterView, setFilterView] = useState("All");

  const handleChange = (index, field, value) => {
    const updated = [...transforms];
    updated[index][field] = value;
    setTransforms(updated);
  };

  const handleDelete = (index) => {
    const updated = transforms.filter((_, i) => i !== index);
    setTransforms(updated);
  };

  const handleReadLogFile = () => {
    if (!logFile) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter(Boolean);
      setLogs(lines);
    };
    reader.readAsText(logFile);
  };

  const applyTransforms = (lines) => {
    const results = {};

    lines.forEach((line) => {
      let modifiedLine = line;
      let routeKey = "_raw";
      let drop = false;

      transforms.forEach((t) => {
        try {
          const regex = new RegExp(t.regex, "g");

          if (t.destKey === "_raw") {
            modifiedLine = t.format
              ? modifiedLine.replace(regex, t.format)
              : modifiedLine.replace(regex, "");
          } else if (t.destKey === "nullQueue") {
            if (regex.test(modifiedLine)) {
              drop = true;
            }
          } else {
            if (regex.test(modifiedLine)) {
              routeKey = t.destKey;
            }
          }
        } catch (err) {
          console.error("Invalid regex:", err);
        }
      });

      if (!drop) {
        if (!results[routeKey]) results[routeKey] = [];
        results[routeKey].push(modifiedLine);
      }
    });

    setTransformedLogs(results);
  };

  useEffect(() => {
    if (logs.length > 0) {
      applyTransforms(logs);
    }
  }, [transforms, logs]);

  return (
    <div className="flex flex-col mt-3">
      <h2 className="font-bold text-2xl">Transforms Config</h2>
      <hr />
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-2.5 md:flex-row mt-4">
        
        <div className="space-y-4">
          {transforms.map((t, index) => (
            <div
              key={index}
              className="border items-start border-gray-200 rounded-2xl p-6 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <h2>
                  Transform:{" "}
                  <span className="font-bold">{t.key}</span>
                </h2>
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 text-white rounded-xl p-2"
                >
                  Delete
                </button>
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-blue-700">REGEX</label>
                <textarea
                  name = "regex"
                  value={t.regex}
                  // onChange={(e) =>
                  //   handleChange(index, "regex", e.target.value)
                  // }
                  onChange={(e) => updateTransform(newKey, "regex", e.target.value)}
                  className="bg-white border border-gray-300 rounded-xl h-20"
                />
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-blue-700">FORMAT</label>
                <input
                  name="format"
                  value={t.format}
                  // onChange={(e) =>
                  //   handleChange(index, "format", e.target.value)
                  // }
                  onChange={(e) => updateTransform(newKey, "format", e.target.value)}
                  className="bg-white border border-gray-300 rounded-xl h-10"
                />
              </div>
              <div className="flex flex-col mt-2">
                <label className="text-blue-700">DEST_KEY</label>
                <input
                  name="destKey"
                  value={t.destKey}
                  // onChange={(e) =>
                  //   handleChange(index, "destKey", e.target.value)
                  // }
                  onChange={(e) => updateTransform(newKey, "destKey", e.target.value)}
                  className="bg-white border border-gray-300 rounded-xl h-10"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start">
          <h1 className="font-semibold text-xl">Transforms Editor</h1>
          <textarea
            className="h-54 w-full overflow-auto resize-none border border-gray-300 rounded-lg p-3 text-sm"
            placeholder="Edit or paste transforms.conf here..."
          />
        </div>

        <div className="flex flex-col max-w">
          <h2 className="font-semibold text-xl">Log File</h2>
          <input
            type="file"
            onChange={(e) => setLogFile(e.target.files[0])}
            className="items-center text-center border border-blue-400 rounded-lg p-2 mt-2"
          />
          <button
            onClick={handleReadLogFile}
            className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded-lg"
          >
            Apply Transforms
          </button>

          <div className="mt-3">
            <h3 className="font-semibold">Transform View</h3>
            <select
              value={filterView}
              onChange={(e) => setFilterView(e.target.value)}
              className="border rounded p-1"
            >
              <option value="All">All</option>
              <option value="Routing">Routing</option>
              <option value="Masking">Masking</option>
              <option value="Filtering">Filtering</option>
            </select>
          </div>

          <div className="flex flex-col mt-2">
            <h3 className="text-xl font-semibold mb-2">Logs Output</h3>
            <div className="h-60 overflow-auto bg-gray-700 text-white rounded-lg p-4 text-sm space-y-4">
              {Object.keys(transformedLogs).map((key) => {
                if (
                  filterView === "All" ||
                  (filterView === "Filtering" && key === "nullQueue") ||
                  (filterView === "Masking" && key === "_raw") ||
                  (filterView === "Routing" &&
                    key !== "_raw" &&
                    key !== "nullQueue")
                ) {
                  return (
                    <div key={key}>
                      <h4 className="font-bold text-green-400 mb-1">
                        {key}:
                      </h4>
                      <pre className="whitespace-pre-wrap">
                        {transformedLogs[key].join("\n")}
                      </pre>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransformsConfig;
