import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {SliderBar} from './SliderBar.jsx';
import {SelectBox} from './SelectBox.jsx';
import {RadioOption} from "./RadioOption.jsx";
import {checkRange, checkNodes} from "./validateUtils";
import {queryTimeInterval, produceDownloadConfig} from "./configGenerator";
import {nodes, traceTypes} from "./constants.js"
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
    const [startSeqNo, setStartSeqNo] = useState(0);
    const [endSeqNo, setEndSeqNo] = useState(0);
    const [minSeq, setMinSeq] = useState(0);
    const [maxSeq, setMaxSeq] = useState(0);
    const [isLoading, setStatus] = useState(false);
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
        }
        setEmissionNode(elist[0]);
        setReceptionNode(rlist[0]);
        setEmissionNodeList(elist);
        setReceptionNodeList(rlist);
    }, [ER]);

    // Dynamic update of timestamp
    useEffect(() => {
        if (checkNodes(ER, emissionNode, receptionNode)) {
            const range = queryTimeInterval({
                type: ER,
                enode: emissionNode,
                rnode: receptionNode,
            })
            setMaxSeq(range[1]);
            setMinSeq(range[0]);
            setStartSeqNo(range[0]);
            setEndSeqNo(range[0]);

        } else {
            setMaxSeq(0);
            setMinSeq(0);
            setStartSeqNo(0);
            setEndSeqNo(0);
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

        if (!checkRange(startSeqNo, endSeqNo, maxSeq, minSeq)) {
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
            "startTimestamp": startSeqNo,
            "endTimestamp": endSeqNo
        }

        console.log(`Query Info
=========================
Type: ${query.type}
Emission Node: ${query.enode}
Reception Node: ${query.rnode} 
Start Timestamp: ${query.startTimestamp}
End Timestamp: ${query.endTimestamp}`);
        setStatus(true);
        produceDownloadConfig(query, () => {
            setStatus(false);
        });


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
            title={"Starting timestamp"}
            min={minSeq}
            max={maxSeq}
            value={startSeqNo}
            setValue={setStartSeqNo}
            isValid={validity.start}
        />

        <SliderBar
            title={"Ending timestamp"}
            min={minSeq}
            max={maxSeq}
            value={endSeqNo}
            setValue={setEndSeqNo}
            isValid={validity.end}
        />

        <div>
            <Button
                variant={isLoading ? "secondary" : "primary"}
                disabled={isLoading}
                onClick={!isLoading ? submitForm : null}
            >
                {isLoading ? 'Loading...' : 'Query'}
            </Button>
        </div>

    </>;

    return UI;
};


ReactDOM.render(<Index/>, document.getElementById('app'));