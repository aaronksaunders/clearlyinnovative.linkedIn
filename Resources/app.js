Ti.include('linkedin_module.js');

/*
linkedInModule.getUser(function(_d) {
    //Ti.API.info(_d);
});

linkedInModule.getShare(function(_d) {
    //Ti.API.info(_d);
});

linkedInModule.getNetworkShares(function(_d) {
    //Ti.API.info(_d);
});

linkedInModule.getMyShares(function(_d) {
    //Ti.API.info(_d);
});

linkedInModule.getConnections(function(_d) {
    //Ti.API.info(_d);
});
*/
var _url = "people/~/suggestions/to-follow/companies";
linkedInModule.API(_url, null, function(_d) {
    Ti.API.info(_d);
});
var post_params = {
    "comment" : "LinkedIn Appcelerator Module",
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
/*
 linkedInModule.postMessage(post_params, function(_d) {
 Ti.API.info(_d);
 });
 */