import { Folder, File } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import CreateRepo from "./CreateRepo";

const CreateApp = ({token, setIsCreateApp, inputsFormat }) => {
    const [isFilesVIew, setIsFilesView] = useState(false);
    const [selectedFile, setSelectedFile] = useState("");
    const [inputText, setInputText] = useState("");
    const [indexesText, setIndexesText] = useState("");
    const [propsText, setPropsText] = useState("");
    const [inputTextView, setInputTextView] = useState("");
    const [indexesTextView, setIndexesTextView] = useState("");
    const [propsTextView, setPropsTextView] = useState("");
    const [appId, setAppId]=useState("");
    const [isGithub, setIsGithub]=useState(false);

    const handleSelect = () => {

        const texts = Object.keys(inputsFormat.props);
        console.log("texts ", texts);
        const propsKeys = Object.keys(inputsFormat.props[texts[0]]);
        const propss = inputsFormat.props[texts[0]];
        let propsText = "";
        for (let key of Object.keys(propss)) {
            propsText = propsText + key + ":" + propss[key] + "\n";
        }
        setPropsText(propsText);
        setPropsTextView(propsText);
        let inputs = inputsFormat.inputs[0];
        let inputsText = "";

        console.log("inpts ", inputs);
        for (let key of Object.keys(inputs)) {
            inputsText = inputsText + key + ":" + inputs[key] + "\n";
        }

        setInputText(inputsText)
        setInputTextView(inputsText)

        const indexes = inputsFormat.indexConfig
        console.log("indexes config ", indexes);

        let indexKeys = Object.keys(indexes)[0];

        let indexesConfigText = "indexName:" + indexKeys + "\n" + "retentionTime:" + indexes[indexKeys]["retentionTime"];

        console.log("indexesConfigText", indexesConfigText);
        setIndexesText(indexesConfigText);
        setIndexesTextView(indexesConfigText);

    }

    useEffect(() => {
        handleSelect();
    }, [inputsFormat])

    const getSelectedValue = () => {
        if (selectedFile === "indexes.conf") {
            return indexesText;
        }
        else if (selectedFile === "inputs.conf") {
            return inputText;
        }
        else if (selectedFile === "props.conf") {
            return propsText;
        }
    }
    const getSelectedValueView = () => {
        if (selectedFile === "indexes.conf") {
            return indexesTextView;
        }
        else if (selectedFile === "inputs.conf") {
            return inputTextView;
        }
        else if (selectedFile === "props.conf") {
            return propsTextView;
        }
    }

    const handleChangeText = (e) => {
        if (selectedFile === "indexes.conf") {
            setIndexesText(e.target.value)
        }
        else if (selectedFile === "inputs.conf") {
            setInputText(e.target.value)
        }
        else if (selectedFile === "props.conf") {
            setPropsText(e.target.value)
        }
    }

    const handleSubmit = () => {
        axios.post('http://127.0.0.1:5000/create_appr', {
            "appName": "TestApp",
            "inputs": inputText,
            "indexConfig": indexesText,
            "props": propsText,
            "transform": {
                "set_index": {
                    "REGEX": ".",
                    "DEST_KEY": "_MetaData:Index",
                    "FORMAT": "test_index"
                }
            }
        })
            .then(response => {
                console.log(response.data);
                alert("saved successfully");
                setAppId(response.data.app_id)
            })
            .catch(error => {
                console.error(error);
            });
    }
    return (
        <div>
            {isGithub && <Modal><CreateRepo token={token} appId={appId}/></Modal>}
            <button onClick={() => setIsCreateApp(false)}>Back</button>

            <div className="relative w-[100%] bg-gray-100 min-h-screen p-[20px] grid grid-cols-[15%_40%_40%] gap-[20px]">
                <div className="h-screen bg-white rounded-2xl p-2">
                    <div className="flex flex-row gap-1">
                        <Folder />
                        <h2>File Browser</h2>
                    </div>
                    <div onClick={() => setIsFilesView(!isFilesVIew)} className="flex flex-row gap-1 mt-5 mb-2 cursor-pointer">
                        <Folder />
                        <p className="text-blue-700 cursor-pointer">Local</p>
                    </div>

                    {isFilesVIew && <div className=" flex flex-col pl-2 gap-2">
                        <div onClick={() => setSelectedFile("indexes.conf")} className="cursor-pointer flex flex-row gap-1">
                            <File />
                            <p>indexes.conf</p>
                        </div>
                        <div onClick={() => setSelectedFile("inputs.conf")} className="cursor-pointer flex flex-row gap-1">
                            <File />
                            <p>inputs.conf</p>
                        </div>
                        <div onClick={() => setSelectedFile("props.conf")} className="cursor-pointer flex flex-row gap-1">
                            <File />
                            <p>props.conf</p>
                        </div>
                    </div>}

                    <button onClick={()=>setIsGithub(true)}>Upload to github</button>
                </div>
                <div className="h-screen bg-white rounded-2xl">
                    <div className="text-2xl p-2.5">
                        <h2>View: {selectedFile} </h2>

                    </div>
                    <hr className="" />
                    <div className=" w-[100%] p-2.5">
                        <textarea value={getSelectedValueView()} className="bg-gray-500 w-[100%] h-[500px] text-white" />

                    </div>
                </div>
                <div className="h-screen bg-white rounded-2xl">
                    <div className="text-2xl p-2.5">
                        <h2>Edit: {selectedFile} </h2>

                    </div>
                    <hr className="" />
                    <div className=" w-[100%] p-2.5">
                        <textarea value={getSelectedValue()} className="bg-gray-500 w-[100%] h-[500px] text-white" onChange={(e) => handleChangeText(e)} />

                    </div>
                </div>
                <button onClick={() => handleSubmit()} className="bg-blue-500 py-2 px-4 border-amber-50 rounded-2xl fixed bottom-2 right-10 border-2">Save</button>
            </div>


        </div>
    )
}

export default CreateApp;