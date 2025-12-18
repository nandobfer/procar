const { withAndroidManifest } = require("@expo/config-plugins")

module.exports = function androiManifestPlugin(config) {
    return withAndroidManifest(config, async (config) => {
        let androidManifest = config.modResults.manifest

        androidManifest.application[0].$["android:largeHeap"] = "true"

        return config
    })
}

/**
Usage:
1. Add this file to your project (eg: ./plugins/withAndroidMainActivityAttributes.js)
2. Specify the plugin file in App Config:
  
   "plugins": [
      [
        ... some plugin ...
      ],
      [
        "./plugins/withAndroidMainActivityAttributes" <--
      ],
      [
        ... another plugin ...
      ]
    ],
  
 3. Build your Expo App using EAS Build
 4. Proceed developing as usual.
 
 Notes:
 - You can use ClassyShark to check the AndroidManifest of the EAS-built `apk` file, and search for the largeHeap flag.
 - Many "online-first snobs" on the internet discourage the largeHeap flag, however being essential for offline-first use cases. When having largeHeap enabled, always profile your RAM usage, and tackle memory leaks as soon as possible.

*/
