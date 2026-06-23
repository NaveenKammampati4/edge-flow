import { Folder, File, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";
import CreateRepo from "./CreateRepo";
import UniversalForwarder from "./UniversalForwarder";

const CreateApp = ({token, setIsCreateApp, inputsFormat, hecTokenDetails, ufTokenDetails, sourceMode, indexContent,uftTokenContext }) => {
    const [isFilesVIew, setIsFilesView] = useState(false);
    const [selectedFile, setSelectedFile] = useState("");
    const [inputText, setInputText] = useState("");
    const [indexesText, setIndexesText] = useState("");
    const [propsText, setPropsText] = useState("");
    const [inputTextView, setInputTextView] = useState("");
    const [indexesTextView, setIndexesTextView] = useState("");
    const [propsTextView, setPropsTextView] = useState("");
    const [transformText, setTransfromText]=useState("");
    const [transformTextView, setTransfromTextView]=useState("");
    const [appId, setAppId]=useState("");
    const [isGithub, setIsGithub]=useState(false);
    const [indexContentText, setIndexContentText]=useState("");
    const[indexContentTextEdit, setIndexContentTextEdit]=useState("");


    console.log("inputs format ",inputsFormat);

    console.log("universal forwarder "+ufTokenDetails.generatedConfig)

    const handleSelect = () => {

        if(sourceMode=="CONF"){
        const texts = Object.keys(inputsFormat.props);
        const propsKeys = Object.keys(inputsFormat.props[texts[0]]);
        const propss = inputsFormat.props[texts[0]];
        let propsText = `[${inputsFormat.inputs[0].sourceType}]\n`;
        for (let key of Object.keys(propss)) {
            if(key!=="timePrefix"){
                 propsText = propsText + key + " = " + propss[key] + "\n";
            }
           
        }
        propsText=propsText+""
        setPropsText(propsText);
        setPropsTextView(propsText);
        let inputs = inputsFormat.inputs[0];
        let inputsText = `[monitor://${inputs.filePaths}]\n`

        let transformKeys=Object.keys(inputsFormat.transform);

        console.log("transform value", propss);
        console.log("transform value", transformKeys);
        let transformValue= propss[transformKeys[0]];
        let transformText=`[${transformValue}]\n`
        let transfromJson=inputsFormat.transform[transformKeys[0]]
        for(let val of Object.keys(transfromJson)){
            transformText=transformText+val+" = "+transfromJson[val]+"\n";
        }

        setTransfromText(transformText);
        setTransfromTextView(transformText);

        console.log("inpts ", inputs);
        for (let key of Object.keys(inputs)) {{}
            if(key!=="id" && key!=="customFields" && key!=="protocol" && key!=="filePath" && key!=="filePaths" && key!=="sourceType"){
         inputsText = inputsText + key + " = " + inputs[key] + "\n";
            }
            else if(key==="sourceType"){
                inputsText=inputsText+"sourcetype = "+inputs[key]+"\n"
            }
   
        }
        inputsText = inputsText
    + "followTail = 0\n"
    + "ignoreOlderThan = 7d\n"
    + "alwaysOpenFile = 0\n"
    + "initCrcLength = 256";


        setInputText(inputsText)
        setInputTextView(inputsText)
        }
        else if(sourceMode=="HEC"){
            let inputsText="[monitor:///var/log/syslog]\n"+"Token Name="+hecTokenDetails.tokenName+"\n"+"indexName="+hecTokenDetails.indexName+"\n"+"sourceType="+hecTokenDetails.sourceType+"\n"+"disabled=false"+"\n";
            setInputText(inputsText)
            setInputTextView(inputsText)
        }
        else if(sourceMode=="UF"){
            // let inputsText="";
            // for(let val of ufTokenDetails){
            //     let textVal="[monitor:"+val+"]\n"+"index="+ufTokenDetails.indexName+"\n"+"sourceType="+ufTokenDetails.sourceType+"\n"+"disabled=false\n";
            //     inputsText=inputsText+textVal+"\n\n"
            // }
            setInputText(uftTokenContext);
             setInputTextView(uftTokenContext)
        }

        const indexes = inputsFormat.indexConfig
        console.log("indexes config ", indexes);

        let indexKeys = Object.keys(indexes)[0];

        console.log("indexKeys "+indexKeys);

        let indexesConfigText ="\n"+ "indexName=" + indexKeys + "\n" + "retentionTime=" + inputsFormat.retentionDays+"\n";
        let indexName=inputsFormat.indexName
        console.log("indexesConfigText", indexesConfigText);
        setIndexesText(indexesConfigText);
        setIndexesTextView(indexesConfigText);

        let indexContents=indexContent+"\n\n"+"["+indexName+"]\n"+"homePath=volume:_splunk_home\\"+indexName+"\db\n"+
        "coldPath = volume:_splunk_home\\"+indexName+"\colddb\n"+
        "thawedPath = volume:_splunk_home\\"+indexName+"\\thaweddb\n"
        +"frozenTimePeriodInSecs = "+inputsFormat.retentionDays * 24 * 60 * 60;
        setIndexContentText(indexContents);
        setIndexContentTextEdit(indexContents);

    }

    useEffect(() => {
        handleSelect();
    }, [inputsFormat])

    const getSelectedValue = () => {
        if (selectedFile === "indexes stanza") {
            return indexContentText;
        }
        else if (selectedFile === "inputs stanza") {
            return inputText;
        }
        else if (selectedFile === "props stanza") {
            return propsText;
        }
        else if (selectedFile === "transform stanza") {
            return transformText;
        }
    }
    const getSelectedValueView = () => {
        if (selectedFile === "indexes stanza") {
            return indexContentTextEdit;
        }
        else if (selectedFile === "inputs stanza") {
            return inputTextView;
        }
        else if (selectedFile === "props stanza") {
            return propsTextView;
        }
        else if(selectedFile==="transform stanza"){
            return transformTextView;
        }
    }

    const handleChangeText = (e) => {
        if (selectedFile === "indexes.conf") {
            setIndexContentTextEdit(e.target.value)
        }
        else if (selectedFile === "inputs.conf") {
            setInputText(e.target.value)
        }
        else if (selectedFile === "props.conf") {
            setPropsText(e.target.value)
        }
        else if(selectedFile==="transform.conf"){
            setTransfromText(e.target.value);
        }
    }

    const handleSubmit = () => {
        axios.post('http://127.0.0.1:5000/create_appr', {
            "appName": "TestApp",
            "inputs": inputText,
            "indexConfig": indexesText,
            "props": propsText,
            "transform": transformText
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
        <div className="bg-gray-100 min-h-screen">
            {isGithub && <Modal><CreateRepo token={token} appId={appId}/></Modal>}
            <ArrowLeft onClick={() => setIsCreateApp(false)}/>
            

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
                        <div onClick={() => setSelectedFile("indexes stanza")} className="cursor-pointer flex flex-row gap-1">
                            <File />
                            <p>indexes.conf</p>
                        </div>
                        <div onClick={() => setSelectedFile("inputs stanza")} className="cursor-pointer flex flex-row gap-1">
                            <File />
                            <p>inputs.conf</p>
                        </div>
                        {sourceMode=="CONF" && <div onClick={() => setSelectedFile("props stanza")} className="cursor-pointer flex flex-row gap-1">
                            <File />
                            <p>props.conf</p>
                        </div>}
                         {sourceMode=="CONF" && <div onClick={() => setSelectedFile("transform stanza")} className="cursor-pointer flex flex-row gap-1">
                            <File />
                            <p>Transform.conf</p>
                        </div>}
                    </div>}

                    <button className="bg-blue-600 text-white border-0 p-2 rounded-2xl mt-3" onClick={()=>setIsGithub(true)}>Upload to github</button>
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