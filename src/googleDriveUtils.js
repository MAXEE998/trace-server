import {getSendEntry} from './pbfUtils';

// Client ID and API key from the Developer Console
const CLIENT_ID = '43021998477-ordlnpt5ctomc0r1jsu2d5aoj417hqtn.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBEtKqPhpdn8kynyqujHRAEww6I55CrYg4';

// Array of API discovery doc URLs for APIs used by the quickstart
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

var GoogleAuth;
var currentApiRequest = true;

// TODO
const gapiLoaded = (setIsAuthorized) => {
    gapi.load('client:auth2', () => initClient(setIsAuthorized));
}

const initClient = (setIsAuthorized) => {
    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPES,
        'discoveryDocs': DISCOVERY_DOCS
    }).then(function () {
        GoogleAuth = gapi.auth2.getAuthInstance();

        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen((isSignedIn) => updateSigninStatus(isSignedIn, setIsAuthorized));
        GoogleAuth.signIn();
        // Handle the initial sign-in state.
        updateSigninStatus(GoogleAuth.isSignedIn.get(), setIsAuthorized);
    })
};

/**
 * Store the request details. Then check to determine whether the user
 * has authorized the application.
 *   - If the user has granted access, make the API request.
 *   - If the user has not granted access, initiate the sign-in flow.
 */
function sendAuthorizedApiRequest(requestDetails) {
    currentApiRequest = requestDetails;

    // TODO: Make API request
    // gapi.client.request(requestDetails)
    console.log("fire");
    gapi.client.drive.files.get({fileId: "1YNufVrbVSOdtCebDv2KVgtuDFiVft0O9", alt: "media"}).then(
        (response) => {
            const data = response.body;
            console.log(getSendEntry(data));
        }
    )

    // Reset currentApiRequest variable.
    currentApiRequest = {};

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

export {gapiLoaded, GoogleAuth};
