#!/usr/bin/env node

module.exports = function (context) {
    var path = context.requireCordovaModule('path'),
        fs = context.requireCordovaModule('fs'),
        pluginDir = context.opts.plugin.dir,
        projectRoot = context.opts.projectRoot;
		ConfigParser = context.requireCordovaModule('cordova-common').ConfigParser,
        config = new ConfigParser(path.join(context.opts.projectRoot, "config.xml")),
        packageName = config.android_packageName() || config.packageName();
		
    if (context.opts.cordova.platforms.indexOf("android") === -1) {
        throw new Error("Android platform has not been added.");
    }

    var originalApplicationName;
    var manifestFile = path.join(projectRoot, 'platforms/android/app/src/main/AndroidManifest.xml');
    if (fs.existsSync(manifestFile)) {
        fs.readFile(manifestFile, 'utf8', function (err, manifestData) {
            if (err) {
                throw new Error('Unable to find AndroidManifest.xml: ' + err);
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
                        originalApplicationName = strs[1];
                    }
                }
            }
            var filename = 'X5TbsApplication.java';
            var AppFliePath = path.join(pluginDir, 'src/android/src/com/hj/x5tbs/', filename);
            var appClass = 'com.hj.x5tbs.X5TbsApplication';
            if (originalApplicationName === appClass) {
                return;
            }
            if (originalApplicationName) {
				if(originalApplicationName.substr(0, 1) == "."){
					if (!packageName) {
						console.error("Package name could not be found!");
						return ;
					}
					originalApplicationName = packageName + originalApplicationName;
				}else if(originalApplicationName.indexOf(".")==-1){
					if (!packageName) {
						console.error("Package name could not be found!");
						return ;
					}
					originalApplicationName = packageName + "." + originalApplicationName;
				}
                // found application in AndroidManifest.xml, change it and let our app extends it
                // 继承
                fs.readFile(AppFliePath, { encoding: 'utf-8' }, function (err, data) {
                    if (err) {
                        throw new Error('before_plugin_add Unable to find '+appClass+': ' + err);
                    }
					if(data.search(/extends\s+android.app.Application/)!=-1){
						data = data.replace(/extends\s+android.app.Application {/gm, `extends ${originalApplicationName} {`);
						fs.writeFileSync(AppFliePath, data);
					}else if(data.search(/extends\s+Application/)!=-1){
						data = data.replace(/extends\s+Application {/gm, `extends ${originalApplicationName} {`);
						fs.writeFileSync(AppFliePath, data);
					}
                });
                var updateAppName = matchsAppName[0].replace(/"[^"]*"/, `"${appClass}"`);
                var updateApp = matchsApp[0].replace(regAppName, updateAppName);
                manifestData = manifestData.replace(regApp, updateApp);
            } else {
                // found no application in AndroidManifest.xml, create it
                manifestData = manifestData.replace(/<application/g, '<application android:name="' + appClass + '"');
            }
            fs.writeFile(manifestFile, manifestData, 'utf8', function (err) {
                if (err) throw new Error('Unable to write into AndroidManifest.xml: ' + err);
            });
        });
    } else {
        throw new Error("AndroidManifest.xml is not existsSync.");
    }
};
