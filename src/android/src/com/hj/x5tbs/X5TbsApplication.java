package com.hj.x5tbs;

import android.app.Application;
import android.content.Context;
import android.util.Log;
import com.tencent.smtt.export.external.TbsCoreSettings;
import com.tencent.smtt.sdk.QbSdk;
import java.util.HashMap;

public class X5TbsApplication extends Application {

    private static final String TAG = "X5TbsApplication";

    @Override
    public void attachBaseContext(Context base) {
        // 在这里调用Context的方法会崩溃
        super.attachBaseContext(base);
        // 在这里可以正常调用Context的方法
    }

    @Override
    public void onCreate() {
        super.onCreate();

        //为X5内核首次初始化耗时开启多进程优化方案
        HashMap map = new HashMap();
        map.put(TbsCoreSettings.TBS_SETTINGS_USE_PRIVATE_CLASSLOADER, true);
        QbSdk.initTbsSettings(map);

        //非wifi情况下，主动下载x5内核
        QbSdk.setDownloadWithoutWifi(true);

        //搜集本地tbs内核信息并上报服务器，服务器返回结果决定使用哪个内核。
        QbSdk.PreInitCallback cb = new QbSdk.PreInitCallback() {
            @Override
            public void onViewInitFinished(boolean status) {
                //x5內核初始化完成的回调，为true表示x5内核加载成功，否则表示x5内核加载失败，会自动切换到系统内核。
                Log.e(TAG," X5TBS內核初始化结果：" + status);
            }

            @Override
            public void onCoreInitFinished() {
                Log.e(TAG," X5TBS內核初始化完成" );
            }
        };

        //x5内核初始化
        QbSdk.initX5Environment(this, cb);

    }
}
