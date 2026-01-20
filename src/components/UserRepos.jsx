import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserRepos = () => {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
  }, []);

  const loginWithGitHub = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  const loadUserData = async () => {
    try {
      const userRes = await fetch("http://localhost:8080/api/my", {
        credentials: "include",
      });

      if (!userRes.ok) {
        if (userRes.status === 401) {
          setLoading(false);
          return;
        }
        throw new Error("Failed to load user");
      }

      const userData = await userRes.json();
      setUser(userData);

      const repoRes = await fetch("http://localhost:8080/api/my/repos", {
        credentials: "include",
      });

      if (repoRes.ok) {
        setRepos(await repoRes.json());
      }

      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={loginWithGitHub}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Login with GitHub
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome {user.login}</h1>
      <button
        onClick={async () => {
          await fetch("http://localhost:8080/logout", {
            method: "POST",
            credentials: "include",
          });
          navigate("/");
        }}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
};

export default UserRepos;

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const UserRepos = () => {
//   const [user, setUser] = useState(null);
//   const [repos, setRepos] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedRepo, setSelectedRepo] = useState(null);
//   const [currentPath, setCurrentPath] = useState("");
//   const [currentFiles, setCurrentFiles] = useState([]);
//   const [pathStack, setPathStack] = useState([]);
//   const [fileContent, setFileContent] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [fileType, setFileType] = useState("text");
//   const [fileData, setFileData] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     loadUserData();
//   }, []);

//   const loadUserData = async () => {
//     try {
//       const userRes = await fetch("http://localhost:8080/api/my", {
//         credentials: "include", // Sends session cookie for auth
//       });

//       if (!userRes.ok) {
//         if (userRes.status === 401) {
//           navigate("/");
//           return;
//         }
//         throw new Error("Failed to load user");
//       }
//       const userData = await userRes.json();
//       setUser(userData);

//       const repoRes = await fetch("http://localhost:8080/api/my/repos", {
//         credentials: "include",
//       });

//       if (repoRes.ok) {
//         const repoData = await repoRes.json();
//         setRepos(repoData);
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadFolder = async (repoFullName, newPath = "") => {
//     if (!repoFullName) {
//       console.error("repoFullName is required");
//       return;
//     }

//     const [owner, repoName] = repoFullName.split("/"); // Always safe

//     try {
//       const url = newPath
//         ? `http://localhost:8080/api/repos/${owner}/${repoName}/contents?path=${encodeURIComponent(
//             newPath
//           )}`
//         : `http://localhost:8080/api/repos/${owner}/${repoName}/contents`;

//       const res = await fetch(url, { credentials: "include" });

//       if (!res.ok) {
//         console.error("API Error:", res.status, await res.text());
//         setCurrentFiles([]);
//         return;
//       }

//       const files = await res.json();
//       setCurrentPath(newPath);
//       setCurrentFiles(Array.isArray(files) ? files : []);

//       setPathStack((prev) => {
//         const newStack = prev.filter((p) => p !== newPath);
//         if (newPath) newStack.push(newPath);
//         return newStack;
//       });
//     } catch (error) {
//       console.error("loadFolder failed:", error);
//       setCurrentFiles([]);
//     }
//   };

//   //   const loadRepoFiles = async (repoFullName) => {
//   //     const [owner, repoName] = repoFullName.split("/");
//   //     const res = await fetch(
//   //       `http://localhost:8080/api/repos/${owner}/${repoName}/contents`,
//   //       {
//   //         credentials: "include",
//   //       }
//   //     );
//   //     const files = await res.json();
//   //     setRepoFiles(files);
//   //     setSelectedRepo(repoFullName);
//   //   };

//   const loadRepoFiles = async (repoFullName) => {
//     setSelectedRepo(repoFullName);
//     setCurrentPath("");
//     setCurrentFiles([]);
//     setPathStack([]);

//     // Wait for state update, then load
//     await loadFolder(repoFullName, "");
//   };
//   const openFolder = (folderName) => {
//     const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
//     loadFolder(selectedRepo, newPath); // Pass selectedRepo
//   };
//   const goBack = () => {
//     if (pathStack.length > 0) {
//       const prevPath = pathStack[pathStack.length - 2] || "";
//       loadFolder(prevPath);
//     }
//   };

//   //   const loadFileContent = async (path) => {
//   //     const [owner, repoName] = selectedRepo.split("/");
//   //     const res = await fetch(
//   //       `http://localhost:8080/api/repos/${owner}/${repoName}/contents/${path}`,
//   //       {
//   //         credentials: "include",
//   //       }
//   //     );
//   //     const fileData = await res.json();
//   //     setSelectedFile(path);
//   //     setFileContent(fileData.decodedContent || "Binary file (cannot display)");
//   //   };

//   const loadFileContent = async (filePath) => {
//     const [owner, repoName] = selectedRepo.split("/");

//     try {
//       const res = await fetch(
//         `http://localhost:8080/api/repos/${owner}/${repoName}/file?path=${encodeURIComponent(
//           filePath
//         )}`,
//         { credentials: "include" }
//       );

//       const data = await res.json();
//       setFileData(data); // ← SAVE FULL DATA
//       setSelectedFile(filePath);

//       if (data.isTextFile === true) {
//         setFileContent(data.decodedContent);
//         setFileType("text");
//       } else {
//         setFileContent(data.decodedContent || "Binary file");
//         setFileType("binary");
//       }
//     } catch (error) {
//       setFileContent("Error: " + error.message);
//       setFileType("error");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-xl">Loading your repositories...</div>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="text-red-500 text-xl">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-6xl mx-auto px-4 py-6">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-2xl font-bold text-gray-900">
//                 Your Repositories
//               </h1>
//               <p className="text-gray-600">
//                 Welcome back, {user?.login || "User"}!
//               </p>
//             </div>
//             <button
//               //   onClick={handleLogout}
//               className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {repos.map((repo) => (
//             // <div
//             //   key={repo.id}
//             //   className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all border"
//             // >
//             //   <h3 className="text-xl font-semibold mb-2 truncate">
//             //     {repo.name}
//             //   </h3>
//             //   <p className="text-gray-600 mb-3 truncate">{repo.fullName}</p>
//             //   <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
//             //     <span>{repo.visibility}</span>
//             //     {repo.fork && (
//             //       <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
//             //         Fork
//             //       </span>
//             //     )}
//             //   </div>
//             //   <a
//             //     href={repo.htmlUrl}
//             //     target="_blank"
//             //     rel="noopener noreferrer"
//             //     className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-600 transition-colors block"
//             //   >
//             //     View on GitHub
//             //   </a>
//             // </div>

//             <div className="flex gap-2">
//               <a
//                 href={repo.htmlUrl}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg text-center hover:bg-gray-600"
//               >
//                 GitHub
//               </a>
//               <button
//                 onClick={() => loadRepoFiles(repo.fullName)}
//                 className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
//               >
//                 View Files
//               </button>
//             </div>
//           ))}
//         </div>
//         {repos.length === 0 && (
//           <div className="text-center py-12">
//             <p className="text-xl text-gray-500">No repositories found.</p>
//           </div>
//         )}
//         {selectedRepo && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="bg-white rounded-xl w-full max-w-4xl max-h-screen flex flex-col">
//               {/* Header with path & navigation */}
//               {/* Header with path & navigation */}
//               <div className="p-4 border-b flex items-center gap-4">
//                 <button
//                   onClick={() => {
//                     setSelectedRepo(null);
//                     setPathStack([]);
//                   }}
//                   className="text-xl font-bold"
//                 >
//                   ←
//                 </button>
//                 <div className="flex items-center gap-2 text-sm text-gray-600 min-w-0 flex-1">
//                   <span>Root</span>
//                   {pathStack.map(
//                     (
//                       p,
//                       index // ← ADD "index" key
//                     ) => (
//                       <span key={`path-${index}`}> / {p.split("/").pop()}</span> // ✅ Unique key
//                     )
//                   )}
//                   {currentPath && (
//                     <span>
//                       / <strong>{currentPath.split("/").pop()}</strong>
//                     </span>
//                   )}
//                 </div>
//                 <button
//                   onClick={goBack}
//                   disabled={pathStack.length === 0}
//                   className="px-4 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
//                 >
//                   Back
//                 </button>
//               </div>

//               {/* Files & Folders */}
//               <div className="flex-1 overflow-y-auto p-4">
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//                   {currentFiles.map((item) => (
//                     <div
//                       key={item.path}
//                       onClick={() => item.type === "dir" && openFolder(item.name)}
//                       className="p-3 border rounded-lg hover:bg-gray-50"
//                     >
//                       <div className="flex items-center gap-2 mb-1">
//                         <span
//                           className={`w-4 h-4 ${
//                             item.type === "dir"
//                               ? "text-blue-500"
//                               : "text-green-500"
//                           }`}
//                         >
//                           {item.type === "dir" ? "📁" : "📄"}
//                         </span>
//                         <span className="font-medium truncate">
//                           {item.name}
//                         </span>
//                       </div>
//                       <div className="text-xs text-gray-500">
//                         {item.type === "dir"
//                           ? "Folder"
//                           : `${(item.size / 1024).toFixed(1)} KB`}
//                       </div>
//                       {item.type !== "dir" && (
//                         <button
//                           onClick={() => loadFileContent(item.path)}
//                           className="w-full mt-2 text-xs bg-indigo-500 text-white py-1 px-2 rounded hover:bg-indigo-600"
//                         >
//                           View
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 {currentFiles.length === 0 && (
//                   <div className="text-center py-12 text-gray-500">
//                     Empty folder
//                   </div>
//                 )}
//               </div>
//                 {selectedFile && (
//           <div className="border-t p-4 bg-gray-50">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="font-mono text-lg truncate">{selectedFile}</h3>
//               <button
//                 onClick={() => setSelectedFile(null)}
//                 className="px-4 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
//               >
//                 Close
//               </button>
//             </div>

//             {fileType === "text" ? (
//               // Text file: Syntax-highlighted code
//               <pre className="bg-white border rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-96 whitespace-pre-wrap">
//                 {fileContent}
//               </pre>
//             ) : (
//               // Binary: Download link + info
//               <div className="p-6 text-center text-gray-600">
//                 <div className="text-lg mb-4">{fileContent}</div>
//                 {data.download_url && (
//                   <a
//                     href={data.download_url}
//                     target="_blank"
//                     className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 inline-block"
//                   >
//                     Download File
//                   </a>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//             </div>
//           </div>
//         )}

//       </div>
//     </div>
//   );
// };

// export default UserRepos;
