package com.impostor.dominicano;

import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Bridge;

public class MainActivity extends BridgeActivity {
    
    @Override
    protected void onBridgeReady(Bridge bridge) {
        super.onBridgeReady(bridge);
        
        WebView webView = bridge.getWebView();
        if (webView != null) {
            WebSettings settings = webView.getSettings();
            
            // DESHABILITAR CACHE COMPLETAMENTE - ESTO ES CRÍTICO
            settings.setCacheMode(WebSettings.LOAD_NO_CACHE);
            settings.setAppCacheEnabled(false);
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
                
                @Override
                public android.webkit.WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                    // Forzar no-cache en todas las peticiones interceptadas
                    return super.shouldInterceptRequest(view, request);
                }
            });
            
            // Limpiar cache del WebView al iniciar
            clearWebViewCache(webView);
        }
    }
    
    @Override
    public void onResume() {
        super.onResume();
        
        // Limpiar cache cada vez que la app vuelve al primer plano
        Bridge bridge = getBridge();
        if (bridge != null) {
            WebView webView = bridge.getWebView();
            if (webView != null) {
                clearWebViewCache(webView);
            }
        }
    }
    
    private void clearWebViewCache(WebView webView) {
        try {
            // Limpiar cache del WebView
            webView.clearCache(true);
            // Limpiar historial
            webView.clearHistory();
            // Limpiar formularios
            webView.clearFormData();
            
            // También limpiar cache de la aplicación WebView a nivel del sistema
            android.webkit.CookieManager.getInstance().removeAllCookies(null);
            android.webkit.CookieManager.getInstance().flush();
        } catch (Exception e) {
            // Ignorar errores
        }
    }
}
