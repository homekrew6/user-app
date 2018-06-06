package com.HomeKrew.User;

import android.app.Application;

import com.facebook.react.ReactApplication;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.imagepicker.ImagePickerPackage;
import com.airbnb.android.react.maps.MapsPackage;
//import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
//import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.magus.fblogin.FacebookLoginPackage;
//import com.reactnative.ivpusic.imagepicker.PickerPackage;
//import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.surialabs.rn.geofencing.GeoFencingPackage;
import java.util.Arrays;
import java.util.List;
import com.facebook.react.modules.i18nmanager.I18nUtil;
public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNGoogleSigninPackage(),
            new MapsPackage(),
            new PickerPackage(),
            new ImagePickerPackage(),
            new FacebookLoginPackage(),
            //new PickerPackage(),
            //new FBSDKPackage(),
            new RNI18nPackage(),
            new VectorIconsPackage(),
            new FIRMessagingPackage(),
            new GeoFencingPackage()
            //new ReactNativePushNotificationPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    I18nUtil sharedI18nUtilInstance = I18nUtil.getInstance();
    sharedI18nUtilInstance.allowRTL(getApplicationContext(), true);
  }
}
