import React, { useState } from "react";

const defaultFile = {
  path: "",
  index: "",
  sourcetype: "",
  source: "",
  host: "",
  recursive: true,
  followSymlink: true,
  alwaysOpenFile: true,
  whitelist: "",
  blacklist: "",
  crcSalt: "<SOURCE>",
  ignoreOlderThan: "0",
  disabled: false,
};

// 🧠 AI ENGINE (IMPROVED)
const inferFromPath = (path = "") => {
  const p = path.toLowerCase();

  if (p.includes("nginx")) return { sourcetype: "nginx:access", index: "web" };
  if (p.includes("apache")) return { sourcetype: "access_combined", index: "web" };
  if (p.includes("syslog")) return { sourcetype: "syslog", index: "os" };
  if (p.includes("error")) return { sourcetype: "errorlog", index: "app" };
  if (p.includes("json")) return { sourcetype: "json", index: "app" };

  return { sourcetype: "log", index: "main" };
};

// 🧠 Smart Suggestions
const suggestions = {
  index: ["main", "web", "os", "app", "security"],
  sourcetype: ["log", "json", "syslog", "nginx:access", "errorlog"],
  host: ["localhost", "prod-server", "dev-server", "default-host"],
};

const SuggestBox = ({ items, onSelect }) => {
  if (!items?.length) return null;

  return (
    <div className="border rounded bg-white shadow p-2 flex flex-wrap gap-2">
      {items.map((s, i) => (
        <button
          key={i}
          onClick={() => onSelect(s)}
          className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
        >
          {s}
        </button>
      ))}
    </div>
  );
};

const UniversalForwarder = ({ setUfTokenDetails, ufTokenDetails }) => {
  const [ufToken, setUfToken] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeField, setActiveField] = useState(null);

  // 🧠 UPDATE FILE
  const updateFile = (index, field, value) => {
    const updated = [...ufTokenDetails.files];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    if (field === "path") {
      const inferred = inferFromPath(value);

      updated[index].sourcetype =
        updated[index].sourcetype || inferred.sourcetype;

      updated[index].index =
        updated[index].index || inferred.index;
    }

    setUfTokenDetails((prev) => ({ ...prev, files: updated }));
  };

  // ➕ ADD FILE
  const addFile = () => {
    setUfTokenDetails((prev) => {
      const last = prev.files?.[prev.files.length - 1];

      return {
        ...prev,
        files: [
          ...prev.files,
          {
            ...defaultFile,
            index: prev.indexName || last?.index || "main",
            sourcetype: prev.sourceType || last?.sourcetype || "log",
            host: prev.host || last?.host || "default-host",
          },
        ],
      };
    });
  };

  // ❌ REMOVE
  const removeFile = (index) => {
    setUfTokenDetails((prev) => {
      const updated = prev.files.filter((_, i) => i !== index);
      return {
        ...prev,
        files: updated.length ? updated : [{ ...defaultFile }],
      };
    });
  };

  const resetAll = () => {
    setUfToken(false);
    setCopied(false);

    setUfTokenDetails({
      indexName: "",
      sourceType: "",
      host: "",
      files: [{ ...defaultFile }],
    });
  };

  const applyDefaults = (file) => ({
    ...file,
    index: file.index || ufTokenDetails.indexName || "main",
    sourcetype: file.sourcetype || ufTokenDetails.sourceType || "log",
    host: file.host || ufTokenDetails.host || "default-host",
  });

  const files = (ufTokenDetails.files || []).map(applyDefaults);

  // 🧾 CONF BUILDER
  const buildConf = () =>
    files
      .filter((f) => f.path)
      .map(
        (f) => `
[monitor://${f.path}]
index = ${f.index}
sourcetype = ${f.sourcetype}
source = ${f.source || f.path}
host = ${f.host}
disabled = ${f.disabled ? "true" : "false"}
recursive = ${f.recursive}
followSymlink = ${f.followSymlink}
alwaysOpenFile = ${f.alwaysOpenFile}
crcSalt = ${f.crcSalt}
ignoreOlderThan = ${f.ignoreOlderThan}
${f.whitelist ? `whitelist = ${f.whitelist}` : ""}
${f.blacklist ? `blacklist = ${f.blacklist}` : ""}
`.trim()
      )
      .join("\n\n");

  const confText = buildConf();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(confText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleDownload = () => {
    const blob = new Blob([confText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inputs.conf";
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow flex flex-col gap-5">

      <h2 className="text-xl font-bold text-center">
        Splunk UF Builder
      </h2>

      {/* HELP TEXT */}
      <p className="text-sm text-gray-500">
        Index = storage • Sourcetype = log format • Host = machine name
      </p>

      {/* GLOBAL DEFAULTS */}
      <div className="border p-4 rounded bg-gray-50 flex flex-col gap-2">
        <input
          value={ufTokenDetails.indexName}
          placeholder="Default Index (main, web, os)"
          onFocus={() => setActiveField("index")}
          onChange={(e) =>
            setUfTokenDetails((p) => ({ ...p, indexName: e.target.value }))
          }
          className="border p-2 rounded"
        />

        {activeField === "index" && (
          <SuggestBox
            items={suggestions.index}
            onSelect={(v) =>
              setUfTokenDetails((p) => ({ ...p, indexName: v }))
            }
          />
        )}

        <input
          value={ufTokenDetails.sourceType}
          placeholder="Default Sourcetype"
          onChange={(e) =>
            setUfTokenDetails((p) => ({ ...p, sourceType: e.target.value }))
          }
          className="border p-2 rounded"
        />

        <input
          value={ufTokenDetails.host || ""}
          placeholder="Default Host"
          onFocus={() => setActiveField("host")}
          onChange={(e) =>
            setUfTokenDetails((p) => ({ ...p, host: e.target.value }))
          }
          className="border p-2 rounded"
        />

        {activeField === "host" && (
          <SuggestBox
            items={suggestions.host}
            onSelect={(v) => setUfTokenDetails((p) => ({ ...p, host: v }))}
          />
        )}
      </div>

      {/* TEMPLATES */}
      <div className="flex gap-2 flex-wrap">
        {[
          ["/var/log/syslog", "Syslog"],
          ["/var/log/nginx/access.log", "Nginx"],
          ["/opt/app/error.log", "App Logs"],
        ].map(([path, label]) => (
          <button
            key={label}
            onClick={() =>
              setUfTokenDetails((p) => ({
                ...p,
                files: [...p.files, { ...defaultFile, path }],
              }))
            }
            className="bg-black text-white px-3 py-1 rounded"
          >
            {label}
          </button>
        ))}
      </div>

      {/* FILES */}
      {files.map((file, index) => (
        <div key={index} className="border p-4 rounded bg-white shadow-sm">

          <div className="flex justify-between mb-2">
            <b>File #{index + 1}</b>
            <button onClick={() => removeFile(index)} className="text-red-600">
              ❌ Remove
            </button>
          </div>

          <input
            value={file.path}
            placeholder="Full path (e.g. /var/log/nginx/access.log)"
            onFocus={() => setActiveField(`path-${index}`)}
            onChange={(e) => updateFile(index, "path", e.target.value)}
            className="border p-2 rounded w-full"
          />

          {activeField === `path-${index}` && (
            <div className="text-xs text-gray-500 mt-1">
              Suggested: /var/log/syslog, /var/log/nginx/access.log, /opt/app/error.log
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mt-2">
            <input
              value={file.index}
              placeholder="Index"
              onFocus={() => setActiveField("index")}
              onChange={(e) => updateFile(index, "index", e.target.value)}
              className="border p-2 rounded"
            />

            <input
              value={file.sourcetype}
              placeholder="Sourcetype"
              onFocus={() => setActiveField("sourcetype")}
              onChange={(e) =>
                updateFile(index, "sourcetype", e.target.value)
              }
              className="border p-2 rounded"
            />
          </div>
        </div>
      ))}

      {/* ACTIONS */}
      <div className="flex gap-2">
        <button onClick={addFile} className="bg-blue-600 text-white flex-1 py-2 rounded">
          + Add File
        </button>
        <button onClick={resetAll} className="bg-red-600 text-white flex-1 py-2 rounded">
          Reset
        </button>
      </div>

      {/* OUTPUT */}
      <div className="flex gap-2">
        <button onClick={() => setUfToken(true)} className="bg-green-600 text-white flex-1 py-2 rounded">
          Generate
        </button>

        <button onClick={handleCopy} className="bg-gray-700 text-white flex-1 py-2 rounded">
          {copied ? "Copied ✓" : "Copy"}
        </button>

        <button onClick={handleDownload} className="bg-blue-800 text-white flex-1 py-2 rounded">
          Download
        </button>
      </div>

      {/* OUTPUT */}
      {ufToken && (
        <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
          {confText}
        </pre>
      )}
    </div>
  );
};

export default UniversalForwarder;