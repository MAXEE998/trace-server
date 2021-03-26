import {getSendEntry, getSendLog} from './pbfUtils';
import meta_data from './meta_data/meta_data_1000000.json'

const byteSize = str => new Blob([str]).size;
// Client ID and API key from the Developer Console
const CLIENT_ID = '43021998477-ordlnpt5ctomc0r1jsu2d5aoj417hqtn.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBEtKqPhpdn8kynyqujHRAEww6I55CrYg4';

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

var GoogleAuth;
var currentApiRequest = true;

// TODO
const gapiLoaded = (setIsAuthorized, setIsLoading) => {
    gapi.load('client:auth2', () => initClient(setIsAuthorized, setIsLoading));
}

const initClient = (setIsAuthorized, setIsLoading) => {
    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPES,
    }).then(() => {
        GoogleAuth = gapi.auth2.getAuthInstance();
        setIsLoading(false);
        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen((isSignedIn) => updateSigninStatus(isSignedIn, setIsAuthorized));
        // Handle the initial sign-in state.
        updateSigninStatus(GoogleAuth.isSignedIn.get(), setIsAuthorized);
    })
};

const signIn = () => {
    GoogleAuth.signIn();
}

/**
 * Store the request details. Then check to determine whether the user
 * has authorized the application.
 *   - If the user has granted access, make the API request.
 *   - If the user has not granted access, initiate the sign-in flow.
 */
async function sendAuthorizedApiRequest(requestDetails) {
    currentApiRequest = requestDetails;
    const numberOfChunks = meta_data.sent_partitions["0"];
    const fileIDs = meta_data.sent_id;
    let data = [];
    let progress = 0;
    let time_start = Date.now();

    console.log(`progress: ${progress}/${numberOfChunks}`);
    for (const file in fileIDs) {
        let chunk = await getSingleChunk(fileIDs[file]);
        data = chunk.entries;
        progress++;
        console.log(`progress: ${progress}/${numberOfChunks}`);
        outputJson({"entries": data.slice(0, 1000000)}, file);
    }

    console.log(`Time taken: ${Date.now() - time_start}`);
}

/***
 * Output the jsonify data
 * @param data
 */
function outputJson(data, filename) {
    data = [...data.entries.map(item => Object.values(item))]
        .map(e => e.join(","))
        .join("\n");
    filename = filename ? filename : "output.json";
    const x = window.open();
    x.blur();
    window.focus();
    x.document.open();
    let element = x.document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    x.document.close();
    element.click();
    x.close();
}

/***
 * Get a chunk of data from google drive
 * @param fileID fileId of the chunk
 * @returns {Promise<Object>}
 */
async function getSingleChunk(fileID) {
    currentApiRequest = {
        path: `https://www.googleapis.com/drive/v3/files/${fileID}`,
        params: {
            alt: "media"
        }
    }

    const response = await gapi.client.request(currentApiRequest);
    const blob = await new Blob([new Uint8Array(response.body.length).map((_, i) => response.body.charCodeAt(i))]);
    const arraybuf = await blob.arrayBuffer();
    return getSendLog(arraybuf);
}

/**
 * Listener called when user completes auth flow. If the currentApiRequest
 * variable is set, then the user was prompted to authorize the application
 * before the request executed. In that case, proceed with that API request.
 */
function updateSigninStatus(isSignedIn, setIsAuthorized) {
    if (isSignedIn) {
        setIsAuthorized(true);
        if (currentApiRequest) {
            sendAuthorizedApiRequest(currentApiRequest);
        }
    } else {
        setIsAuthorized(false);
    }
}

export {gapiLoaded, signIn};
