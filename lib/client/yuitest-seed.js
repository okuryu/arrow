/*jslint forin:true sub:true undef: true anon:true, sloppy:true, stupid:true nomen:true, node:true continue:true*/
/*jslint undef: true*/
/*
* Copyright (c) 2012, Yahoo! Inc.  All rights reserved.
* Copyrights licensed under the New BSD License.
* See the accompanying LICENSE file for terms.
*/

// Provided by the fw
// ARROW = {};
// ARROW.autoTest = false; // for self contained app and test, such as html
// ARROW.testParams = {};
// ARROW.appSeed = ""; // YUI min or equivalent
// ARROW.testLibs = [];
// ARROW.scriptType = "test";
// ARROW.testScript = "test-file.js";
// ARROW.actionScript = "action-file.js";
// ARROW.onSeeded = function() { /* add test, hand over to runner */}

ARROW.testBag = ["test"];
ARROW.testReport = null;
ARROW.actionReport = null;
ARROW.actionReported = false;

// try to catch unhandled errors
if ((typeof window !== "undefined") && !window.onerror) {
    window.onerror = function (errorMsg, sourceUrl, lineNumber) {
        console.log("javascript error: " + errorMsg + " at " + lineNumber + ", url: " + sourceUrl);
        return true;
    };
}

(function () {

    function loadScript(url, callback) {
        var script = document.createElement("script");
        script.type = "text/javascript";

        if (script.readyState) { // IE
            script.onreadystatechange = function () {
                if (("loaded" === script.readyState) || ("complete" === script.readyState)) {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { // Others
            script.onload = function() {
                callback();
            };
        }

        script.src = url;
        document.body.appendChild(script);
    }

    function captureConsoleMessages() {

        try {
            if(console) {
                //capturing console log
                console.oldLog = console.log;
                console.log = function(line) {
                    ARROW.consoleLog += "[LOG] " + line + "\n";
                    console.oldLog(line);
                }

                //capturing console info
                console.oldInfo = console.info;
                console.info = function(line) {
                    ARROW.consoleLog += "[INFO] " + line + "\n";
                    console.oldInfo(line);
                }

                //capturing console warn
                console.oldWarn = console.warn;
                console.warn = function(line) {
                    ARROW.consoleLog += "[WARN] " + line + "\n";
                    console.oldWarn(line);
                }

                //capturing console debug
                console.oldDebug = console.debug;
                console.debug = function(line) {
                    ARROW.consoleLog += "[DEBUG] " + line + "\n";
                    console.oldDebug(line);
                }

                //capturing console debug
                console.oldError = console.error;
                console.error = function(line) {
                    ARROW.consoleLog += "[ERROR] " + line + "\n";
                    console.oldError(line);
                }
            }
        } catch (e){

        }

    }

    function onYUIAvailable() {
        var module = ARROW.testParams["module"],
            yuiAddFunc = YUI.add;

        //initializing Arrow console log
        ARROW.consoleLog = "";

        //capturing console messages
        captureConsoleMessages();

        // capture module style tests
        YUI.add = function (name, fn, version, meta) {
            yuiAddFunc(name, fn, version, meta);

            if (module && (name !== module)) {
                return;
            }

            if (("test" === ARROW.scriptType) && (-1 !== name.indexOf("-tests"))) {
                console.log("Found test module: " + name);
                ARROW.testBag.push(name);
            } else if (("action" === ARROW.scriptType) && (-1 !== name.indexOf("-action"))) {
                console.log("Found test action: " + name);
                ARROW.testBag.push(name);
            }
        };

        ARROW.onSeeded();
    }

    if (typeof YUI === "undefined") {
        if ((typeof process !== "undefined") && (typeof require !== "undefined")) {
            YUI = require("yui").YUI;
            onYUIAvailable();
        } else {
            loadScript(ARROW.appSeed, onYUIAvailable);
        }
    } else {
        onYUIAvailable();
    }
})();

