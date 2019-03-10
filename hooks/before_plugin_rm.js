#!/usr/bin/env node

module.exports = function (context) {
    var path = context.requireCordovaModule('path'),
        fs = context.requireCordovaModule('fs'),
        pluginDir = context.opts.plugin.dir;
        projectRoot = context.opts.projectRoot;
		ConfigParser = context.requireCordovaModule('cordova-common').ConfigParser,
        config = new ConfigParser(path.join(context.opts.projectRoot, "config.xml")),
        packageName = config.android_packageName() || config.packageName();
		
    if (context.opts.cordova.platforms.indexOf("android") === -1) {
        throw new Error("Android platform has not been added.");
    }

    var originalApplicationName;
    var defaultApplicationName = "android.app.Application";
    var finalApplicationName;
    var manifestFile = path.join(projectRoot, 'platforms/android/app/src/main/AndroidManifest.xml');
    if (fs.existsSync(manifestFile)) {
        fs.readFile(manifestFile, 'utf8', function (err, manifestData) {
            if (err) {
                console.error('Unable to find AndroidManifest.xml: ' + err);
                return;
            }

            var regApp = /<application[^>]*>/gm;
            var regAppName = /android[ ]*:[ ]*name[ ]*=[ ]*"[.$\w]*"/g;
            var matchsApp = manifestData.match(regApp);
            var matchsAppName;
            if (matchsApp && matchsApp.length === 1) {
                matchsAppName = matchsApp[0].match(regAppName);
                if (matchsAppName && matchsAppName.length === 1) {
                    var strs = matchsAppName[0].split(/"/);
                    if (strs && strs.length === 3) {
                        finalApplicationName = strs[1];
                    }
                }
            }
            var filename = 'X5TbsApplication.java';
            var AppFliePath = path.join(projectRoot, 'platforms/android/app/src/main/java/com/hj/x5tbs/', filename);
            var appClass = 'com.hj.x5tbs.X5TbsApplication';
            if (!finalApplicationName || (finalApplicationName !== appClass)) {
                return;
            }
            fs.readFile(AppFliePath, { encoding: 'utf-8' }, function (err, data) {
                if (err) {
                    throw new Error('before_plugin_rm Unable to find '+appClass+': ' + err);
                }
                originalApplicationName = data.match(/extends [\w$.]+ {/g)[0].split(/ /)[1];
                if (originalApplicationName === defaultApplicationName) {
                    // original no application
                    manifestData = manifestData.replace("android:name=\"" + appClass + "\"", "");
                } else {
                    // reset original application
                    var updateAppName = matchsAppName[0].replace(/"[^"]*"/, `"${originalApplicationName}"`);
                    var updateApp = matchsApp[0].replace(regAppName, updateAppName);
                    manifestData = manifestData.replace(regApp, updateApp);
                }
                fs.writeFile(manifestFile, manifestData, 'utf8', function (err) {
                    if (err) throw new Error('Unable to write into AndroidManifest.xml: ' + err);
                });
            });
        });
    } else {
        console.error("AndroidManifest.xml is not existsSync.");
    }
};
