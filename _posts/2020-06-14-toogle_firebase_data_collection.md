---
layout: post
title: Toggle Firebase data collection
date: 2020-06-14 19:42:00 +0100
tags:
  - android
  - firebase
---

You can (and should) disable Firebase on local builds. You more that likely have a debuggable build that is released in some form or other (QA) that you want to have Firebase enabled on, so that you can remotely monitor the build. Doing it in the following way will allow you to better tailor the build with the relevant settings rather and basing it off the `BuildConfig.DEBUG` flag.

The `collection_deactivated` flag will permanently disable each feature. This means that even if you programatically enable it again within the app, that will have no effect, it will always be disabled. `collection_enabled` is the temporary solution to that. So for example, by default you can have everything disabled, but only enable them when a user consents to let you do so. This is always a good idea, GDPR, user privacy etc. always give the user control over their data.

The main reason to disable all of this on local debug builds is to help improve re-build performance, doing this will prevent Firebase from trying to generate whatever stuff it needs to set itself up.

```groovy
app/build.gradle
----------------
apply plugin: 'com.google.gms.google-services'
apply plugin: 'com.google.firebase.firebase-perf'
apply plugin: 'com.google.firebase.crashlytics'

android {
  buildTypes {
    debug {
      manifestPlaceholders = [
        deactivate_firebase: 'true',
        enable_firebase: 'false'
      ]
      firebaseCrashlytics {
        mappingFileUploadEnabled false // True by default but only needed on proguarded builds
      }
      FirebasePerformance {
        instrumentationEnabled false // True by default
      }
    }

    release {
      manifestPlaceholders = [
        deactivate_firebase: 'false',
        enable_firebase: 'true'
      ]
    }

    qa {
      initWith(release) // Inherits release config
    }
  }
}

dependencies {
  implementation 'com.google.firebase:firebase-analytics:<version>'
  implementation 'com.google.firebase:firebase-crashlytics:<version>'
  implementation 'com.google.firebase:firebase-perf:<version>'
}
```

```xml
AndroidManifest.xml
-------------------
<manifest>
  <application>

    <meta-data
      android:name="firebase_analytics_collection_deactivated"
      android:value="${deactivate_firebase}" />
    <meta-data
      android:name="firebase_analytics_collection_enabled"
      android:value="${enable_firebase}" />
    <meta-data
      android:name="firebase_crashlytics_collection_deactivated"
      android:value="${deactivate_firebase}" />
    <meta-data
      android:name="firebase_crashlytics_collection_enabled"
      android:value="${enable_firebase}" />
    <meta-data
      android:name="firebase_performance_collection_deactivated"
      android:value="${deactivate_firebase}" />
    <meta-data
      android:name="firebase_performance_collection_enabled"
      android:value="${enable_firebase}" />

  </application>
</manifest>
```
