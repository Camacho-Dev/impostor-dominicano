import { AdMob, BannerAdSize, BannerAdPosition, AdmobConsentStatus } from '@capacitor-community/admob';

// ─── IDs de producción ───────────────────────────────────────────────────────
// IMPORTANTE: Reemplaza estos valores con los IDs reales de tu cuenta AdMob
// una vez que AdMob apruebe tu app. Mientras tanto usa los IDs de prueba.
const IS_TESTING = true; // Cambiar a false cuando AdMob apruebe la app

const AD_IDS = {
  // IDs de prueba oficiales de Google (solo para desarrollo)
  test: {
    banner:        'ca-app-pub-3940256099942544/6300978111',
    interstitial:  'ca-app-pub-3940256099942544/1033173712',
    rewarded:      'ca-app-pub-3940256099942544/5224354917',
  },
  // IDs reales — REEMPLAZAR con los de tu cuenta AdMob
  // Los obtienes en AdMob > Aplicaciones > Tu app > Unidades de anuncios
  production: {
    banner:        'ca-app-pub-1556512509230118/XXXXXXXXXX',
    interstitial:  'ca-app-pub-1556512509230118/XXXXXXXXXX',
    rewarded:      'ca-app-pub-1556512509230118/XXXXXXXXXX',
  },
};

const getAdId = (type) =>
  IS_TESTING ? AD_IDS.test[type] : AD_IDS.production[type];

// ─── Estado interno ───────────────────────────────────────────────────────────
let initialized = false;
let interstitialLoaded = false;
let rewardedLoaded = false;

// ─── Inicialización ───────────────────────────────────────────────────────────
export const initAdMob = async () => {
  if (!window.Capacitor?.isNativePlatform?.()) return;
  if (initialized) return;

  try {
    await AdMob.initialize({
      requestTrackingAuthorization: true,
      testingDevices: [],
      initializeForTesting: IS_TESTING,
    });
    initialized = true;
    console.log('✅ AdMob inicializado');

    // Pre-cargar anuncios inmediatamente
    await preloadInterstitial();
    await preloadRewarded();
  } catch (e) {
    console.error('❌ Error inicializando AdMob:', e);
  }
};

// ─── BANNER ───────────────────────────────────────────────────────────────────
export const showBanner = async () => {
  if (!window.Capacitor?.isNativePlatform?.()) return;
  try {
    await AdMob.showBanner({
      adId: getAdId('banner'),
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: IS_TESTING,
    });
  } catch (e) {
    console.error('Error mostrando banner:', e);
  }
};

export const hideBanner = async () => {
  if (!window.Capacitor?.isNativePlatform?.()) return;
  try {
    await AdMob.hideBanner();
  } catch (e) {}
};

export const removeBanner = async () => {
  if (!window.Capacitor?.isNativePlatform?.()) return;
  try {
    await AdMob.removeBanner();
  } catch (e) {}
};

// ─── INTERSTICIAL ─────────────────────────────────────────────────────────────
export const preloadInterstitial = async () => {
  if (!window.Capacitor?.isNativePlatform?.()) return;
  try {
    await AdMob.prepareInterstitial({
      adId: getAdId('interstitial'),
      isTesting: IS_TESTING,
    });
    interstitialLoaded = true;
    console.log('✅ Intersticial pre-cargado');
  } catch (e) {
    console.error('Error pre-cargando intersticial:', e);
    interstitialLoaded = false;
  }
};

export const showInterstitial = async () => {
  if (!window.Capacitor?.isNativePlatform?.()) return false;
  try {
    if (!interstitialLoaded) {
      await preloadInterstitial();
    }
    await AdMob.showInterstitial();
    interstitialLoaded = false;
    // Pre-cargar el siguiente para la próxima ronda
    setTimeout(() => preloadInterstitial(), 1000);
    return true;
  } catch (e) {
    console.error('Error mostrando intersticial:', e);
    interstitialLoaded = false;
    return false;
  }
};

// ─── RECOMPENSADO ─────────────────────────────────────────────────────────────
export const preloadRewarded = async () => {
  if (!window.Capacitor?.isNativePlatform?.()) return;
  try {
    await AdMob.prepareRewardVideoAd({
      adId: getAdId('rewarded'),
      isTesting: IS_TESTING,
    });
    rewardedLoaded = true;
    console.log('✅ Anuncio recompensado pre-cargado');
  } catch (e) {
    console.error('Error pre-cargando recompensado:', e);
    rewardedLoaded = false;
  }
};

/**
 * Muestra un anuncio recompensado.
 * @returns {Promise<boolean>} true si el usuario completó el anuncio y ganó la recompensa
 */
export const showRewarded = async () => {
  if (!window.Capacitor?.isNativePlatform?.()) return false;
  try {
    if (!rewardedLoaded) {
      await preloadRewarded();
    }
    const result = await AdMob.showRewardVideoAd();
    rewardedLoaded = false;
    // Pre-cargar el siguiente
    setTimeout(() => preloadRewarded(), 1000);
    // result.value === true si el usuario terminó de ver el anuncio
    return result?.value === true || !!result?.reward;
  } catch (e) {
    console.error('Error mostrando recompensado:', e);
    rewardedLoaded = false;
    return false;
  }
};
