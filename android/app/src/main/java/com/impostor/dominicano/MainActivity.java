package com.impostor.dominicano;

import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebViewClient;
import android.webkit.WebResourceRequest;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    /** Capacitor en onCreate() llama setTheme(AppTheme_NoActionBar) y eso hace volver las barras.
     * Forzamos siempre nuestro tema fullscreen para que no se muestren. */
    @Override
    public void setTheme(int resId) {
        super.setTheme(R.style.AppTheme_NoActionBarFullscreen);
    }

    private static final int FLAGS_INMERSIVO = View.SYSTEM_UI_FLAG_FULLSCREEN
        | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION;

    private boolean webViewConfigured = false;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private Runnable reaplicarRunnable;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS);
        aplicarPantallaCompleta();
        View decor = getWindow().getDecorView();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            decor.setOnSystemUiVisibilityChangeListener(new View.OnSystemUiVisibilityChangeListener() {
                @Override
                public void onSystemUiVisibilityChange(int visibility) {
                    aplicarPantallaCompleta();
                }
            });
        }
        // Reaplicar tras el primer layout (Capacitor ya puso el WebView)
        decor.post(new Runnable() {
            @Override
            public void run() {
                aplicarPantallaCompleta();
                programarReaplicaciones();
            }
        });
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) aplicarPantallaCompleta();
    }
    
    /** Oculta barra de estado (hora, batería) y barra de navegación (atrás, inicio). */
    private void aplicarPantallaCompleta() {
        if (getWindow() == null) return;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController ctrl = getWindow().getInsetsController();
            if (ctrl != null) {
                ctrl.hide(android.view.WindowInsets.Type.statusBars() | android.view.WindowInsets.Type.navigationBars());
                ctrl.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        }
        View decor = getWindow().getDecorView();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            decor.setSystemUiVisibility(FLAGS_INMERSIVO);
        }
        try {
            WebView wv = getBridge() != null ? getBridge().getWebView() : null;
            if (wv != null) wv.setSystemUiVisibility(FLAGS_INMERSIVO);
        } catch (Exception e) { /* ignore */ }
    }

    /** Reaplica inmersivo muchas veces; algo en Capacitor/WebView puede restablecer las barras. */
    private void programarReaplicaciones() {
        if (reaplicarRunnable != null) handler.removeCallbacks(reaplicarRunnable);
        reaplicarRunnable = new Runnable() {
            int count = 0;
            @Override
            public void run() {
                aplicarPantallaCompleta();
                if (++count < 40) handler.postDelayed(this, 500);
            }
        };
        handler.postDelayed(reaplicarRunnable, 150);
    }
    
    @Override
    public void onStart() {
        super.onStart();
        configureWebView();
    }
    
    @Override
    public void onResume() {
        super.onResume();
        aplicarPantallaCompleta();
        programarReaplicaciones();
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
                            webView.setSystemUiVisibility(FLAGS_INMERSIVO);
                            webViewConfigured = true;
                            aplicarPantallaCompleta();
                            programarReaplicaciones();
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
