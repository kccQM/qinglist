package com.qinglist.app;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;

import androidx.activity.result.ActivityResult;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "FileExport")
public class FileExportPlugin extends Plugin {
    @PluginMethod
    public void save(PluginCall call) {
        String fileName = call.getString("fileName", "qinglist-backup.json");
        Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("application/json");
        intent.putExtra(Intent.EXTRA_TITLE, fileName);
        startActivityForResult(call, intent, "saveResult");
    }

    @ActivityCallback
    private void saveResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK) {
            call.reject("cancelled");
            return;
        }
        Intent data = result.getData();
        Uri uri = data != null ? data.getData() : null;
        if (uri == null) {
            call.reject("missing uri");
            return;
        }
        String json = call.getString("data", "");
        try (OutputStream stream = getContext().getContentResolver().openOutputStream(uri)) {
            if (stream == null) throw new IllegalStateException("stream");
            stream.write(json.getBytes(StandardCharsets.UTF_8));
            stream.flush();
            JSObject ret = new JSObject();
            ret.put("uri", uri.toString());
            call.resolve(ret);
        } catch (Exception error) {
            call.reject("write failed");
        }
    }
}
