package com.impostor.dominicano;

import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    private boolean webViewConfigured = false;
    
    @Override
    public void onStart() {
        super.onStart();
        configureWebView();
    }
    
    @Override
    public void onResume() {
        super.onResume();
        configureWebView();
        clearWebViewCache();
    }
    
    private void configureWebView() {
        if (webViewConfigured) {
            return;
        }
        
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                
                // DESHABILITAR CACHE COMPLETAMENTE - ESTO ES CRÍTICO
                settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
                settings.setDomStorageEnabled(true);
                
                // Configurar WebViewClient para forzar no-cache en todas las peticiones
                webView.setWebViewClient(new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                        String url = request.getUrl().toString();
                        // No permitir navegación fuera de la app
                        if (url.contains("github.io") && !url.contains("impostor-dominicano")) {
                            return true; // Bloquear navegación
                        }
                        return false; // Permitir navegación dentro de la app
                    }
                });
                
                webViewConfigured = true;
            }
        } catch (Exception e) {
            // Intentar de nuevo en el siguiente ciclo
            webViewConfigured = false;
        }
    }
    
    private void clearWebViewCache() {
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                // Limpiar cache del WebView
                webView.clearCache(true);
                // Limpiar historial
                webView.clearHistory();
                // Limpiar formularios
                webView.clearFormData();
                
                // También limpiar cache de la aplicación WebView a nivel del sistema
                android.webkit.CookieManager.getInstance().removeAllCookies(null);
                android.webkit.CookieManager.getInstance().flush();
            }
        } catch (Exception e) {
            // Ignorar errores
        }
    }
}
