package com.qinglist.app;

import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatDelegate;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
        registerPlugin(FileExportPlugin.class);
        super.onCreate(savedInstanceState);

        int background = ContextCompat.getColor(this, R.color.appBackground);
        getWindow().setBackgroundDrawable(new ColorDrawable(background));
        WebView webView = getBridge() != null ? getBridge().getWebView() : null;
        if (webView != null) {
            webView.setBackgroundColor(background);
            webView.getSettings().setSupportZoom(false);
            webView.getSettings().setBuiltInZoomControls(false);
            webView.getSettings().setDisplayZoomControls(false);
        }
    }
}
