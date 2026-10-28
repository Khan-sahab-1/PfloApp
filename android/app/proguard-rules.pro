# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native Gesture Handler
-dontwarn com.swmansion.gesturehandler.**
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Reanimated
-dontwarn com.swmansion.reanimated.**
-keep class com.swmansion.reanimated.** { *; }

# Vision Camera
-dontwarn com.mrousavy.camera.**
-keep class com.mrousavy.camera.** { *; }

# Camera Kit
-dontwarn com.rncamerakit.**
-keep class com.rncamerakit.** { *; }
