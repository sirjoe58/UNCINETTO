package it.sirjoe.uncinetto;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.provider.Settings;
import android.view.WindowManager;
import android.webkit.WebView;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;

/* Funzioni native per SirJoe Uncinetto: cartella condivisa con FolderSync, stampa, link, schermo acceso */
@CapacitorPlugin(name = "SirJoe")
public class SirJoePlugin extends Plugin {

    private File cartella() {
        File d = new File(Environment.getExternalStorageDirectory(), "SirJoeUncinetto");
        if (!d.exists()) d.mkdirs();
        return d;
    }

    private boolean accesso() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) return Environment.isExternalStorageManager();
        return getContext().checkSelfPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE) == android.content.pm.PackageManager.PERMISSION_GRANTED;
    }

    @PluginMethod
    public void haAccesso(PluginCall call) {
        JSObject r = new JSObject(); r.put("ok", accesso()); call.resolve(r);
    }

    @PluginMethod
    public void chiediAccesso(PluginCall call) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                Intent i = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION, Uri.parse("package:" + getContext().getPackageName()));
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(i);
            } else {
                getActivity().requestPermissions(new String[]{ android.Manifest.permission.WRITE_EXTERNAL_STORAGE, android.Manifest.permission.READ_EXTERNAL_STORAGE }, 77);
            }
        } catch (Exception e) {
            Intent i = new Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION);
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
        }
        call.resolve();
    }

    private static String nomeSicuro(String n) { return new File(n == null ? "dati.json" : n).getName(); }

    @PluginMethod
    public void leggi(PluginCall call) {
        try {
            File f = new File(cartella(), nomeSicuro(call.getString("nome")));
            JSObject r = new JSObject();
            if (!f.exists()) { r.put("testo", null); call.resolve(r); return; }
            FileInputStream in = new FileInputStream(f);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192]; int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            in.close();
            r.put("testo", new String(out.toByteArray(), StandardCharsets.UTF_8));
            call.resolve(r);
        } catch (Exception e) { call.reject(e.getMessage()); }
    }

    @PluginMethod
    public void scrivi(PluginCall call) {
        try {
            File f = new File(cartella(), nomeSicuro(call.getString("nome")));
            File tmp = new File(f.getPath() + ".tmp");
            FileOutputStream out = new FileOutputStream(tmp);
            out.write(call.getString("testo", "").getBytes(StandardCharsets.UTF_8));
            out.close();
            if (f.exists()) f.delete();
            if (!tmp.renameTo(f)) throw new Exception("Impossibile salvare il file");
            call.resolve();
        } catch (Exception e) { call.reject(e.getMessage()); }
    }

    @PluginMethod
    public void apriLink(PluginCall call) {
        Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(call.getString("url")));
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(i);
        call.resolve();
    }

    @PluginMethod
    public void stampa(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            WebView wv = getBridge().getWebView();
            PrintManager pm = (PrintManager) getActivity().getSystemService(Context.PRINT_SERVICE);
            PrintDocumentAdapter ad = wv.createPrintDocumentAdapter("SirJoe Uncinetto");
            pm.print("SirJoe Uncinetto", ad, new PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).build());
            call.resolve();
        });
    }

    @PluginMethod
    public void schermoAcceso(PluginCall call) {
        boolean si = Boolean.TRUE.equals(call.getBoolean("si", false));
        getActivity().runOnUiThread(() -> {
            if (si) getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            else getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            call.resolve();
        });
    }
}
