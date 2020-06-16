---
title: Proguarding the New Way
tags:
  - android
  - proguard
---

Proguarding your builds is relatively easy and should always be done. Although device storage and data plans nowadays are not as constrained as they used to be, that still doesn't mean we should 'abuse' the users resources because we were too lazy to add a few lines of code to our project.

Believe it or not, there are two different ways to proguard a build. The old way and the secret way. Officially, the secret way doesn't really exist ([this](https://google.github.io/android-gradle-dsl/current/com.android.build.gradle.internal.dsl.BuildType.html#com.android.build.gradle.internal.dsl.BuildType:postprocessing) is the only 'official' reference I can find, it's been marked as 'incubating' for at least the last year or two), in the Android documentation on proguarding a project, the old way is still referenced.

I can't remember how I came across this new set of APIs, but ever since then it's what I've used and it hasn't let me down.


#### Old way
This is the way you are probably used to seeing. (NOTE: `consumerProguardFiles` should only be used in library modules so that it can expose its rules to an app module. `proguardFiles` should only be used in an app module. Both do not need to be defined in the same config).

This will, minify (proguard) your build, strip out any unused resources and use the applied rule files to prevent any breakages.
```groovy
buildTypes {
  release {
    minifyEnabled true
    shrinkResources true
    proguardFiles getDefaultProguardFiles('', proguard-rules.pro)
    consumerProguardFiles 'consumer-rules.pro'
  }
}
```


#### New (secret) way
Introducing the 'new' (not really) `postprocessing` block. It basically does the same as the above, but in a more defined and scoped way. You also have access to a more fine grained config. (NOTE: In library modules, `removeUnusedResources` should always be set to `false`, you'll get a warning if you set it to `true`, read the warning, it'll explain) The `proguardFiles` line from the above has been split up into `proguardFiles` which is your app specific rules and an `optimizeCode` flag which if set to `true` will apply the `proguard-android-optimize.txt` rules as-well.
```groovy
buildTypes {
  release {
    postprocessing {
      proguardFiles 'proguard-rules.pro'
      consumerProguardFiles 'consumer-rules.pro'
      removeUnusedResources = true
      removeUnusedCode = true
      optimizeCode = true
      obfuscate = true
    }
  }
}
```
