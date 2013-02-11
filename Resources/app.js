/*
 This is a minified javascript module because I have not had a chance to refactor and clean up
 the horrible hacks I have done to make this work, and I don't want to expose the code and then
 spend alot of time responding to issues and/or questions.
 
 This code is released AS IS and I will clean it up, document it better and eventually re-release
 it as a module or open source
 
*/

var linkedInModule = require('linkedin_module-min');

//
// MUST INITIALIZE WITH KEYS
// GET KEYS AT https://developer.linkedin.com/apis
//
linkedInModule.init('SECRET_KEY', 'API_KEY');
    
//For a full list of permissions please visit
//https://developer.linkedin.com/documents/authentication

//Access Contacts
linkedInModule.addPermission('r_network');
//Access full profile
linkedInModule.addPermission('r_fullprofile');


// THESE CALLS WRAP COMMON FUNCTIONS
linkedInModule.getUser(function(_d) {
    Ti.API.info(_d);
});

linkedInModule.getShare(function(_d) {
    Ti.API.info(_d);
});

linkedInModule.getNetworkShares(function(_d) {
    Ti.API.info(_d);
});

linkedInModule.getMyShares(function(_d) {
    Ti.API.info(_d);
});

linkedInModule.getConnections(function(_d) {
    Ti.API.info(_d);
});

// THIS IS A GENERIC CALL TO PASS THE STANDARD REST API URLS
var _url = "people/~/suggestions/to-follow/companies";
linkedInModule.API(_url, null, function(_d) {
    Ti.API.info(_d);
});

// HERE IS AN EXAMPLE USING THAT ENDPOINT TO POST A MESSAGE
var post_params = {
    "comment" : "Testing LinkedIn Appcelerator Module #appcelerator",
    "content" : {
        "title" : "LinkedIn Appcelerator Module coming soon from Clearly Innovative Inc",
        "submitted_url" : "http://www.clearlyinnovative.com",
        "submitted_image_url" : "http://www.clearlyinnovative.com/logo.png",
        "description" : "Javascript wrapper for easily integrating LinkedIn into mobile app"
    },
    "visibility" : {
        "code" : "anyone"
    }
}

 linkedInModule.postMessage(post_params, function(_d) {
     Ti.API.info(_d);
 });
