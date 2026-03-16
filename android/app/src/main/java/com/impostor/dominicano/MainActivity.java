package com.impostor.dominicano;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsetsController;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    
    private boolean webViewConfigured = false;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        aplicarPantallaCompleta();
    }
    
    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) aplicarPantallaCompleta();
    }
    
    /** Oculta barra de estado (hora, batería) y barra de navegación (atrás, inicio) para pantalla completa. */
    private void aplicarPantallaCompleta() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController ctrl = getWindow().getInsetsController();
            if (ctrl != null) {
                ctrl.hide(android.view.WindowInsets.Type.statusBars() | android.view.WindowInsets.Type.navigationBars());
                ctrl.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            View decor = getWindow().getDecorView();
            int flags = View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;
            decor.setSystemUiVisibility(flags);
        }
    }
    
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
            // Esperar un poco para que el bridge esté listo
            getBridge().getWebView().post(new Runnable() {
                @Override
                public void run() {
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
            });
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
