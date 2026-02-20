package com.impostor.dominicano;

import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onStart() {
        super.onStart();
        
        // Prevenir que se abra en navegador externo
        WebView webView = getBridge().getWebView();
        if (webView != null) {
            webView.setWebViewClient(new android.webkit.WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, android.webkit.WebResourceRequest request) {
                    // No permitir navegación fuera de la app
                    String url = request.getUrl().toString();
                    if (url.contains("github.io") && !url.contains("impostor-dominicano")) {
                        return true; // Bloquear navegación
                    }
                    return false; // Permitir navegación dentro de la app
                }
            });
        }
    }
}
