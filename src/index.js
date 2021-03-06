import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {SliderBar} from './components/SliderBar.jsx';
import {SelectBox} from './components/SelectBox.jsx';
import {RadioOption} from "./components/RadioOption.jsx";
import {checkRange, checkNodes} from "./validateUtils";
import {queryInterval, produceDownloadConfig, downloadBlob} from "./configGenerator";
import {nodes, parseMillisecondsIntoReadableTime, traceTypes} from "./constants.js"
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

const Index = () => {

    // states for UI
    const [emissionNodeList, setEmissionNodeList] = useState([]);
    const [receptionNodeList, setReceptionNodeList] = useState([]);
    const [emissionNode, setEmissionNode] = useState("");
    const [receptionNode, setReceptionNode] = useState("");
    const [ER, setER] = useState("");
    const [startIndexNo, setStartIndexNo] = useState(0);
    const [endIndexNo, setEndIndexNo] = useState(0);
    const [minIndex, setMinIndex] = useState(0);
    const [maxIndex, setMaxIndex] = useState(0);
    const [isLoading, setStatus] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [validity, setValidity] = useState({
        enode: true,
        rnode: true,
        type: true,
        start: true,
        end: true
    })

    // Dynamic update of node lists
    useEffect(() => {
        let elist = [];
        let rlist = []
        if (ER === traceTypes.E) {
            elist = nodes.filter((_, i) => i !== 2);
            rlist = [...nodes]
        } else if (ER === traceTypes.R) {
            elist = [...nodes]
            rlist = nodes.filter((_, i) => i !== 2);
        } else if (ER === traceTypes.B) {
            elist = nodes.filter((_, i) => i !== 2);
            rlist = nodes.filter((_, i) => i !== 2);
        }
        setEmissionNode(elist[0]);
        setReceptionNode(rlist[0]);
        setEmissionNodeList(elist);
        setReceptionNodeList(rlist);
    }, [ER]);

    // Dynamic update of Index
    useEffect(() => {
        if (checkNodes(ER, emissionNode, receptionNode)) {
            const range = queryInterval({
                type: ER,
                enode: emissionNode,
                rnode: receptionNode,
            })
            setMaxIndex(range[1]);
            setMinIndex(range[0]);
            setStartIndexNo(range[0]);
            setEndIndexNo(range[0]);

        } else {
            setMaxIndex(0);
            setMinIndex(0);
            setStartIndexNo(0);
            setEndIndexNo(0);
        }
    }, [emissionNode, receptionNode]);

    // Checking input validity
    const isValid = () => {
        let ans = true;
        if (ER == null) {
            ans = false;
            setValidity((prevState => ({...prevState, type: false})));
        } else {
            setValidity((prevState => ({...prevState, type: true})));
        }

        if (!checkNodes(ER, emissionNode, receptionNode)) {
            ans = false;
            setValidity((prevState => ({...prevState, enode: false, rnode: false})));
        } else {
            setValidity((prevState => ({...prevState, enode: true, rnode: true})));
        }

        if (!checkRange(startIndexNo, endIndexNo, maxIndex, minIndex)) {
            ans = false;
            setValidity((prevState => ({...prevState, start: false, end: false})));
        } else {
            setValidity((prevState => ({...prevState, start: true, end: true})));
        }

        return ans;
    };

    const submitForm = () => {
        // TODO: check input and query the database
        if (!isValid()) {
            alert("Please make sure that your input is valid!");
            return;
        }

        const query = {
            "type": ER,
            "enode": emissionNode,
            "rnode": receptionNode,
            "startIndex": startIndexNo,
            "endIndex": endIndexNo
        }

        const qString = JSON.stringify(query, null, 4)

        // check duplicate
        for (const task of tasks) {
            let temp = {
                "type": task.type,
                "enode": task.enode,
                "rnode": task.rnode,
                "startIndex": task.startIndex,
                "endIndex": task.endIndex
            }
            if (JSON.stringify(temp, null, 4) === qString) {
                alert("This task already exists!")
                return
            }
        }

        console.log(`Query Info
=========================
${qString}`);
        setStatus(true);
        let task = produceDownloadConfig(query, () => {
            setStatus(false);
        });
        setTasks([...tasks, task])
    }

    const resetInterface = () => {
        setEmissionNodeList([]);
        setReceptionNodeList([]);
        setEmissionNode("");
        setReceptionNode("");
        setER("");
        setStartIndexNo(0);
        setEndIndexNo(0);
        setMinIndex(0);
        setMaxIndex(0);
        setValidity({
            enode: true,
            rnode: true,
            type: true,
            start: true,
            end: true
        })
    }

    const downloadConfig = () => {
        setStatus(true);
        const blob = new Blob([JSON.stringify(tasks, null, 4)],
            {type: 'application/json'})
        downloadBlob(blob,
            `downloadConfig.json`
        );
        resetInterface();
        setTasks([]);
        setStatus(false);
    }

    const UI = <>
        <div><h1>Welcome to Planet Lab Traces Database!</h1></div>

        <RadioOption
            options={traceTypes}
            selected={ER}
            setSelected={setER}
            title={"Trace type"}
            isValid={validity.type}
        />

        <SelectBox
            selected={emissionNode}
            setSelected={setEmissionNode}
            values={emissionNodeList}
            title={"Emission Node"}
            isValid={validity.enode}
        />

        <SelectBox
            selected={receptionNode}
            setSelected={setReceptionNode}
            values={receptionNodeList}
            title={"Reception Node"}
            isValid={validity.rnode}
        />

        <SliderBar
            title={"Starting Index"}
            min={minIndex}
            max={maxIndex}
            value={startIndexNo}
            setValue={setStartIndexNo}
            isValid={validity.start}
        />

        <SliderBar
            title={"Ending Index"}
            min={minIndex}
            max={maxIndex}
            value={endIndexNo}
            setValue={setEndIndexNo}
            isValid={validity.end}
        />

        <div>
            <span> <strong>
                            {"Time span selected: " + ((endIndexNo - startIndexNo) <= 0 ? "N/A" :
                                `${parseMillisecondsIntoReadableTime((endIndexNo - startIndexNo) * 100)}`)
                            }
            </strong> </span>

        </div>

        <div>
            <span> <strong>
                            {`Number of tasks selected: ${tasks.length}`}
            </strong> </span>

        </div>

        <div>
            <Button
                variant={isLoading || tasks.length === 0 ? "secondary" : "primary"}
                disabled={isLoading}
                onClick={!isLoading && tasks.length ? downloadConfig : null}
            >
                {isLoading ? 'Loading...' : 'Download config'}
            </Button>

            <Button
                variant={isLoading ? "secondary" : "primary"}
                disabled={isLoading}
                onClick={!isLoading ? submitForm : null}
            >
                {isLoading ? 'Loading...' : 'Add'}
            </Button>

            <Button
                variant={isLoading ? "secondary" : "primary"}
                disabled={isLoading}
                onClick={!isLoading ? () => {
                    resetInterface();
                    setTasks([]);
                } : null}
            >
                {isLoading ? 'Loading...' : 'Reset'}
            </Button>
        </div>

    </>;

    return UI;
};


ReactDOM.render(<Index/>, document.getElementById('app'));