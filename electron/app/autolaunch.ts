import AutoLaunch from 'easy-auto-launch'
import os from 'os'

// auto launch app on startup

const autoLaunchOpts: ConstructorType = {
  name: 'Rebrowser',
}

if (os.platform() === 'linux' && process.env.APPIMAGE) {
  autoLaunchOpts.path = process.env.APPIMAGE
}

const autoLauncher = new AutoLaunch(autoLaunchOpts)

autoLauncher.enable()

//autoLauncher.disable();

autoLauncher
  .isEnabled()
  .then(function (isEnabled) {
    if (isEnabled) {
      return
    }
    autoLauncher.enable()
  })
  .catch(function (err) {
    // handle error
    console.error(err)
  })
