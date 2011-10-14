/**
 *
 * this code was inspired by the work done by David Riccitelli
 *
 * Copyright 2011 Aaron K. Saunders, Clearly Innovative Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     <a href="http://www.apache.org/licenses/LICENSE-2.0">http://www.apache.org/licenses/LICENSE-2.0</a>
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var linkedInModule = {};

//
(function() {

    var oAuthAdapter;
    var API_URL = "http://api.linkedin.com/v1/";

    if(Ti.Platform.osname == "iphone") {
        Ti.include('lib/oauth_adapter.js');
        Ti.include('lib/OAuthSimple.js');
    } else if(Ti.Platform.osname == "android") {
        Ti.include('/lib/oauth_adapter-android.js');
        Ti.include('/lib/OAuthSimple.js');
    }
    oAuthAdapter = new OAuthAdapter('qkNmJHi2s9K-_ZN0fEuf7TDcUlomkMiAIs66X1u74m27j-5E4JHtOd1F9L9b0XWn', // secret
    'e9YHHE4Kn9gz2McYEyjGlv_K12w9AFVMlD2XJfBkY_at_SDtq09dbICYUgnNSwXp', 'HMAC-SHA1');

    /* ======================================================================================================
     *
     * PUBLIC FUNCTIONS
     *
     ====================================================================================================== */
    linkedInModule.authorize = function(_callback) {
        setupTokens(_callback);
    }
    linkedInModule.getUser = function(_callback) {
        linkedInModule.authorize(function() {
            getMe(_callback);
        });
    }
    linkedInModule.getConnections = function(_callback) {
        linkedInModule.authorize(function() {
            getConnections(_callback);
        });
    }
    linkedInModule.getShare = function(_callback) {
        linkedInModule.authorize(function() {
            getShare(_callback);
        });
    }
    linkedInModule.getNetworkShares = function(_callback) {
        linkedInModule.authorize(function() {
            getNetworkShares({
                "type" : "SHAR"
            }, _callback);
        });
    }
    linkedInModule.getMyShares = function(_callback) {
        linkedInModule.authorize(function() {
            getNetworkShares({
                "type" : "SHAR",
                "scope" : "self"
            }, _callback);
        });
    }
    linkedInModule.API = function(_url, _params, _callback) {
        linkedInModule.authorize(function() {
            API(_url, _params, _callback);
        });
    }
    linkedInModule.postMessage = function(post_params, _callback) {
        postStatus(post_params, function(e) {
            _callback(e);
        });
    }
    /* ======================================================================================================
     *
     * PRIVATE FUNCTIONS
     *
     ====================================================================================================== */
    function setupTokens(_callback, _messageText) {

        oAuthAdapter.loadAccessToken('linkedin');

        if(oAuthAdapter.isAuthorized() == false) {
            var receivePin = function(e) {
                if(e.linkedInReturnStatus == true) {
                    Ti.API.debug('in recieve pin');
                    // get the access token with the provided pin/oauth_verifier
                    oAuthAdapter.getAccessToken('https://api.linkedin.com/uas/oauth/accessToken');
                    // save the access token

                    oAuthAdapter.saveAccessToken('linkedin');
                }
                if(_callback != null) {
                    _callback(e);
                }
            };
            // show the authorization UI and call back the receive PIN function
            oAuthAdapter.showAuthorizeUI('https://api.linkedin.com/uas/oauth/authorize?' + oAuthAdapter.getRequestToken('https://api.linkedin.com/uas/oauth/requestToken'), receivePin);
        } else {
            if(_callback) {
                _callback(_messageText);
            }
        }
    }

    function api(oauthObject, _callback) {
        var client = Ti.Network.createHTTPClient();
        Ti.API.debug("oauthObject.signed_url " + oauthObject.signed_url);
        client.open('GET', oauthObject.signed_url);

        client.setRequestHeader("Authorization", oauthObject.header);
        client.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");

        client.onload = function(e) {
            // Ti.API.debug(client.responseText);
            if(_callback) {
                _callback(client.responseText);
            }
        }
        client.onerror = function(e) {
            Ti.API.error(JSON.stringify(e));
            if(_callback) {
                _callback(client.responseText);
            }
        }
        client.send();
    }

    function API(_url, _params, _callback) {
        var config = oAuthAdapter.loadAccessToken('linkedin');
        var oauthObject = OAuthSimple().sign({
            path : API_URL + _url,
            action : 'GET',
            parameters : _params,
            signatures : {
                'consumer_key' : 'e9YHHE4Kn9gz2McYEyjGlv_K12w9AFVMlD2XJfBkY_at_SDtq09dbICYUgnNSwXp',
                'shared_secret' : 'qkNmJHi2s9K-_ZN0fEuf7TDcUlomkMiAIs66X1u74m27j-5E4JHtOd1F9L9b0XWn',
                'access_token' : config.accessToken,
                'access_secret' : config.accessTokenSecret
            }
        });
        Ti.API.debug(JSON.stringify(oauthObject));
        api(oauthObject, _callback);

    }

    function getMe(_callback) {
        var config = oAuthAdapter.loadAccessToken('linkedin');
        var oauthObject = OAuthSimple().sign({
            path : 'https://api.linkedin.com/v1/people/~',
            action : 'GET',
            //parameters: 'oauth_token=0d83ceaa-a1d9-4034-aa4c-711e8c0b9307',
            signatures : {
                'consumer_key' : 'e9YHHE4Kn9gz2McYEyjGlv_K12w9AFVMlD2XJfBkY_at_SDtq09dbICYUgnNSwXp',
                'shared_secret' : 'qkNmJHi2s9K-_ZN0fEuf7TDcUlomkMiAIs66X1u74m27j-5E4JHtOd1F9L9b0XWn',
                'access_token' : config.accessToken,
                'access_secret' : config.accessTokenSecret
            }
        });
        Ti.API.debug(JSON.stringify(oauthObject));
        api(oauthObject, _callback);

    }

    function getShare(_callback) {
        var config = oAuthAdapter.loadAccessToken('linkedin');
        var oauthObject = OAuthSimple().sign({
            path : 'https://api.linkedin.com/v1/people/~:(current-share)',
            action : 'GET',
            //parameters: 'oauth_token=0d83ceaa-a1d9-4034-aa4c-711e8c0b9307',
            signatures : {
                'consumer_key' : 'e9YHHE4Kn9gz2McYEyjGlv_K12w9AFVMlD2XJfBkY_at_SDtq09dbICYUgnNSwXp',
                'shared_secret' : 'qkNmJHi2s9K-_ZN0fEuf7TDcUlomkMiAIs66X1u74m27j-5E4JHtOd1F9L9b0XWn',
                'access_token' : config.accessToken,
                'access_secret' : config.accessTokenSecret
            }
        });
        Ti.API.debug(JSON.stringify(oauthObject));
        api(oauthObject, _callback);

    }

    function getNetworkShares(params, _callback) {
        var config = oAuthAdapter.loadAccessToken('linkedin');
        var oauthObject = OAuthSimple().sign({
            path : 'https://api.linkedin.com/v1/people/~/network',
            action : 'GET',
            parameters : params,
            signatures : {
                'consumer_key' : 'e9YHHE4Kn9gz2McYEyjGlv_K12w9AFVMlD2XJfBkY_at_SDtq09dbICYUgnNSwXp',
                'shared_secret' : 'qkNmJHi2s9K-_ZN0fEuf7TDcUlomkMiAIs66X1u74m27j-5E4JHtOd1F9L9b0XWn',
                'access_token' : config.accessToken,
                'access_secret' : config.accessTokenSecret
            }
        });
        Ti.API.debug(JSON.stringify(oauthObject));
        api(oauthObject, _callback);

    }

    function getConnections(_callback) {
        var config = oAuthAdapter.loadAccessToken('linkedin');
        var oauthObject = OAuthSimple().sign({
            path : 'https://api.linkedin.com/v1/people/~/connections',
            action : 'GET',
            //parameters: 'oauth_token=0d83ceaa-a1d9-4034-aa4c-711e8c0b9307',
            signatures : {
                'consumer_key' : 'e9YHHE4Kn9gz2McYEyjGlv_K12w9AFVMlD2XJfBkY_at_SDtq09dbICYUgnNSwXp',
                'shared_secret' : 'qkNmJHi2s9K-_ZN0fEuf7TDcUlomkMiAIs66X1u74m27j-5E4JHtOd1F9L9b0XWn',
                'access_token' : config.accessToken,
                'access_secret' : config.accessTokenSecret
            }
        });
        Ti.API.debug(JSON.stringify(oauthObject));
        api(oauthObject, _callback);

    }


    function postStatus(post_params, _callback) {
        var xml_string = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><share>";
        xml_string += String.format("<comment>%s</comment><content><title>%s</title>", post_params.comment, post_params.content.title);
        xml_string += String.format("<submitted-url>%s</submitted-url><submitted-image-url>%s</submitted-image-url>", post_params.content.submitted_url, post_params.content.submitted_image_url);
        xml_string += String.format("<description>%s</description></content>", post_params.content.description);
        xml_string += String.format("<visibility><code>%s</code></visibility></share>", post_params.visibility.code);

        var config = oAuthAdapter.loadAccessToken('linkedin');
        var oauthObject = OAuthSimple().sign({
            path : 'https://api.linkedin.com/v1/people/~/shares',
            action : 'POST',
            parameters : {
                'body' : xml_string
            },
            signatures : {
                'consumer_key' : 'e9YHHE4Kn9gz2McYEyjGlv_K12w9AFVMlD2XJfBkY_at_SDtq09dbICYUgnNSwXp',
                'shared_secret' : 'qkNmJHi2s9K-_ZN0fEuf7TDcUlomkMiAIs66X1u74m27j-5E4JHtOd1F9L9b0XWn',
                'access_token' : config.accessToken,
                'access_secret' : config.accessTokenSecret
            }
        });
        Ti.API.debug(JSON.stringify(oauthObject));
        var client = Ti.Network.createHTTPClient();
        Ti.API.debug("oauthObject.signed_url " + oauthObject.signed_url);
        client.open('POST', oauthObject.signed_url);

        client.setRequestHeader("Authorization", oauthObject.header);
        client.setRequestHeader("Content-Type", "text/xml;charset=UTF-8");

        client.onload = function(e) {
            Ti.API.debug("Response from LinkedIn:Status" + client.status);
            Ti.API.debug("Response from LinkedIn:" + client.responseXML);
            Ti.API.debug("Response from LinkedIn:" + client.responseText);
            if(client.status < 400) {
                _callback();
            }
            client = null;
        }
        client.onerror = function(e) {
            if(e != null) {
                Ti.API.error("onerror " + JSON.stringify(e));
                alert("onerror " + JSON.stringify(e));
            } else {
                return true;
            }
        }
        client.send(xml_string);

    }

})();
