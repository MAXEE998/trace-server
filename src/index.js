import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {SliderBar} from './SliderBar.jsx';
import {SelectBox} from './SelectBox.jsx';
import {RadioOption} from "./RadioOption.jsx";
import {checkRange} from "./validateUtils";
import {gapiLoaded} from "./googleDriveUtils";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';


String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
};


const nodes = [
    "ple4.ipv6.lip6.fr (France)",
    "planetlab1.jhu.edu (USA, Maryland)",
    "planetlab2.csuohio.edu (USA, Ohio)",
    "75-130-96-12.static.oxfr.ma.charter.com (USA, Massachussets)",
    "planetlab1.cnis.nyit.edu (USA, New York)",
    "saturn.planetlab.carleton.ca (Canada, Ontario)",
    "planetlab-03.cs.princeton.edu (USA, New Jersey)",
    "prata.mimuw.edu.pl (Poland)",
    "planetlab3.upc.es (Spain)",
    "pl1.eng.monash.edu.au (Australia)"
];

const traceTypes = {
    E: "emission",
    R: "reception"
};

const Index = () => {
    // states for UI
    const [selectedNode, setSelectedNode] = useState(nodes[0]);
    const [ER, setER] = useState(null);
    const [startSeqNo, setStartSeqNo] = useState(0);
    const [endSeqNo, setEndSeqNo] = useState(0);
    const [minSeq, setMinSeq] = useState(0);
    const [maxSeq, setMaxSeq] = useState(100);
    const [isLoading, setStatus] = useState(false);
    const [validity, setValidity] = useState({
        node: true,
        type: true,
        start: true,
        end: true
    })

    // states for gapi
    const [isAuthorized, setIsAuthorized] = useState(false);

    // Load the gapi.js script for Google Drive API
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/api.js";
        script.async = true;
        script.onload = () => gapiLoaded(setIsAuthorized);

        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        // TODO: update minSeq and maxSeq

    }, [selectedNode, ER]);

    // Checking input validity
    const isValid = () => {
        let ans = true;
        if (ER == null) {
            ans = false;
            setValidity((prevState => ({...prevState, type: false})));
        } else {
            setValidity((prevState => ({...prevState, type: true})));
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

        console.log(`Query Info
=========================
Nodes: ${selectedNode}
Type: ${ER}
StartSeqNo: ${startSeqNo}
EndSeqNo: ${endSeqNo}`);
        setStatus(true);
        setTimeout(() => {
            setStatus(false);
        }, 1000);
    }

    const UI = <>
        <div><h1>Welcome to Planet Lab Traces Database!</h1></div>

        <SelectBox
            selected={selectedNode}
            setSelected={setSelectedNode}
            values={nodes}
            title={"Node"}
            isValid={validity.node}
        />

        <RadioOption
            options={traceTypes}
            selected={ER}
            setSelected={setER}
            title={"Trace type"}
            isValid={validity.type}
        />

        <SliderBar
            title={"Starting sequence number"}
            min={minSeq}
            max={maxSeq}
            value={startSeqNo}
            setValue={setStartSeqNo}
            isValid={validity.start}
        />

        <SliderBar
            title={"Ending sequence number"}
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

    const googleLoginPrompt = <div><h1>Please sign in to google drive first!</h1></div>

    return (
        isAuthorized ? UI : googleLoginPrompt
    );
};


ReactDOM.render(<Index/>, document.getElementById('app'));