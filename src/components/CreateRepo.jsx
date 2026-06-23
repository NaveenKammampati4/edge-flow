import React, { useState } from "react";
import axios from "axios";

export default function CreateRepo({token,appId}) {
  const [formData, setFormData] = useState({
    repoName: "",
    branchName: "",
    commitMessage: "",
    description: "",
    visibility: "public",
  });

  const[isRepoUpdated, setIsRepoUpdate]=useState(false);

  console.log("Appid ",appId);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const uploadToGithub = async () => {

    console.log("formdata", formData);
  

  const formData1 = new FormData();
  formData1.append("repoName", formData.repoName);
  formData1.append("repoDescription", formData.description);
  formData1.append("repoVisibility", formData.visibility);
  formData1.append("commitMessage", formData.commitMessage);

  try {
    const response = await axios.post(
      `http://127.0.0.1:5000/upload_github/${appId}/${token}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data);
    setIsRepoUpdate(true);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data:", formData);

    // Upload logic here
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      {
        isRepoUpdated ?<div className="p-2">
            <h3 >
      Do you want to schedule a job in Harness workflow?
    </h3>
    <div className=" flex flex-row justify-center gap-2 mt-4">
        <button
  className="w-15 p-2 bg-blue-700 rounded-2xl"
  onClick={() => {
    window.location.href = "http://52.140.70.19:5000/projects";
  }}
>
  Yes
</button>
        <button className="w-15 p-2 bg-red-700 rounded-2xl">No</button>
    </div>

    <div></div>

        </div>:<div>
        <h2 className="text-2xl font-bold mb-6">Repository Upload</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Repo Name */}
        <div>
          <label className="block mb-1 font-medium">
            Repository Name
          </label>
          <input
            type="text"
            name="repoName"
            value={formData.repoName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="my-awesome-project"
            required
          />
        </div>

        {/* Branch Name */}
        <div>
          <label className="block mb-1 font-medium">
            Branch Name
          </label>
          <input
            type="text"
            name="branchName"
            value={formData.branchName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="main"
            required
          />
        </div>

        {/* Commit Message */}
        <div>
          <label className="block mb-1 font-medium">
            Commit Message
          </label>
          <input
            type="text"
            name="commitMessage"
            value={formData.commitMessage}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Initial commit"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border rounded px-3 py-2"
            placeholder="Describe your repository..."
          />
        </div>

      
        {/* <div>
          <label className="block mb-2 font-medium">
            Visibility
          </label>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={formData.visibility === "public"}
                onChange={handleChange}
              />
              Public
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={formData.visibility === "private"}
                onChange={handleChange}
              />
              Private
            </label>
          </div>
        </div> */}

       
        {/* Submit Button */}
        <button
            onClick={()=>uploadToGithub()}
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Upload Repository
        </button>
      </form>
      </div>
      }


    </div>
  );
}