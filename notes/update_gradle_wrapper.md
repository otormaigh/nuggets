---
title: Update Gradle Wrapper
tags:
  - gradle
---

When updating the Gradle version on a project, always run the Gradle Wrapper task to make sure all relevant files are updated. You can either add a preconfigured block within the project to set the version number, or optionally manually add the version to the gradle task params.

* Without project configuration block
Run this command: `./gradlew wrapper --gradle-version=6.5`

* With project configuration block
`build.gradle`
```
wrapper {
  gradleVersion = "6.5"
  distributionType = "all"
}
```

`build.gradle.kts`
```
tasks.withType(Wrapper::class.java) {
  gradleVersion = "6.5"
  distributionType = Wrapper.DistributionType.ALL
}
```

Run this command: `./gradlew wrapper`
