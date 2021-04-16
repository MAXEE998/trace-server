import {nodesMap, traceTypes} from "./constants";
import db from "./meta_data/processed_output.json"

const processQueryType = (query) => query.type === traceTypes.E ? db[traceTypes.E][query.enode][query.rnode]
    : db[traceTypes.R][query.rnode][query.enode]

const processQueryNodes = (query) => ({...query, "enode": nodesMap[query.enode], "rnode": nodesMap[query.rnode]});

// https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/
function downloadBlob(blob, filename) {
    // Create an object URL for the blob object
    const url = URL.createObjectURL(blob);

    // Create a new anchor element
    const a = document.createElement('a');

    // Set the href and download attributes for the anchor element
    // You can optionally set other attributes like `title`, etc
    // Especially, if the anchor element will be attached to the DOM
    a.href = url;
    a.download = filename || 'download';

    // Click handler that releases the object URL after the element has been clicked
    // This is required for one-off downloads of the blob content
    const clickHandler = () => {
        setTimeout(() => {
            URL.revokeObjectURL(url);
            this.removeEventListener('click', clickHandler);
        }, 150);
    };

    // Add the click event listener on the anchor element
    // Comment out this line if you don't want a one-off download of the blob content
    a.addEventListener('click', clickHandler, false);

    // Programmatically trigger a click on the anchor element
    // Useful if you want the download to happen automatically
    // Without attaching the anchor element to the DOM
    // Comment out this line if you don't want an automatic download of the blob content
    a.click();

    // Return the anchor element
    // Useful if you want a reference to the element
    // in order to attach it to the DOM or use it in some other way
    return a;
}

function queryTimeInterval(query) {
    const log = processQueryType(processQueryNodes(query))
    return [log["min_timestamp"], log["max_timestamp"]]
}

function binarySearch(arr, key, target) {
    let start = 0;
    let end = arr.length;
    let mid = 0;

    while (start < end) {
        mid =  Math.floor((start + end) / 2);
        if (key(arr[mid]) === target) {
            // hit
            return mid;
        } else if (key(arr[mid]) > target) {
            end = mid - 1;
        } else {
            start = mid + 1;
        }
    }

    return mid;
}

function determineRange(query, files) {
    // TODO: use binary search
    let key = d => d[0];
    let start = binarySearch(files, key, query.startTimestamp);
    if (key(files[start]) > query.startTimestamp) start--;
    let end = binarySearch(files, key, query.endTimestamp);
    if (key(files[end]) <= query.endTimestamp) end++;
    console.log([start, end])
    return [start, end];
}

function produceDownloadConfig(query, callback) {
    const files = processQueryType(processQueryNodes(query)).fileID

    // Step 1: determine which files to include
    let [start, end] = determineRange(query, files)

    // Step 2: include fileIDs to the configuration file
    query["fileIDs"] = []
    for (let i = start; i < end; i++) {
        query["fileIDs"].push(files[i][1]);
    }

    // Step 3: output the file for user to download
    const blob = new Blob([ JSON.stringify(query) ], { type: 'application/json' });
    downloadBlob(blob, `downloadConfig_${query.type}_${query.enode}_${query.rnode}_${query.startTimestamp}-${query.endTimestamp}.json`);
    callback();
}

export {queryTimeInterval, produceDownloadConfig}