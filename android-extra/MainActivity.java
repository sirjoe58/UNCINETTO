package it.sirjoe.uncinetto;

import android.os.Bundle;
import androidx.activity.OnBackPressedCallback;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(SirJoePlugin.class);
        super.onCreate(savedInstanceState);
        // tasto Indietro: torna alla schermata precedente dell'app; dalla Home chiude
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                getBridge().getWebView().evaluateJavascript("(window.sjIndietro && window.sjIndietro()) ? '1' : '0'", v -> {
                    if (v == null || !v.contains("1")) finish();
                });
            }
        });
    }
}
