##For my own convenience

# cordova-plugin-hj-x5tbs
Changes Cordova default WebView to [Tencent X5Tbs WebView](http://x5.tencent.com/)


## Supported Platforms

- Android


## Installation

``cordova plugin add cordova-plugin-hj-x5tbs``


## x5sdk

``tbs_sdk_thirdapp_v4.3.0.1020_43633_sharewithdownload_withoutGame_obfs_20190111_105200.jar``

[update download](https://x5.tencent.com/tbs/sdk.html)


## AndroidManifest.xml

```xml
<application android:name="com.hj.x5tbs.X5TbsApplication">
<service android:name="com.tencent.smtt.export.external.DexClassLoaderProviderService" android:label="dexopt" android:process=":dexopt" ></service>
</application>

```
```xml
			<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
			<uses-permission android:name="android.permission.INTERNET" />
			<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
			<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
			<uses-permission android:name="android.permission.READ_PHONE_STATE" />
			<uses-permission android:name="android.permission.READ_SETTINGS" />
			<uses-permission android:name="android.permission.WRITE_SETTINGS" />
			<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS" />
			<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
			<uses-permission android:name="android.permission.GET_TASKS" />
```

## Application

auto extends


## extends

https://github.com/offbye/cordova-plugin-x5engine-webview


## x5debug

``http://debugx5.qq.com``
