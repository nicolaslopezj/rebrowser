/**
 * @type {() => import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configurtagation
 */
module.exports = async function () {
  return {
    extends: null,
    productName: 'Rebrowser',
    appId: 'com.nicolaslopezj.rebrowser',
    directories: {
      output: 'dist',
      buildResources: 'assets',
    },
    files: ['build/**/*'],
    publish: {
      provider: 'github',
      publishAutoUpdate: true,
    },
    linux: {
      appId: 'com.nicolaslopezj.rebrowser',
      category: 'Utility',
      icon: 'assets/icon.png',
      desktop: {
        Name: 'Rebrowser',
        Comment: 'A browser to connect to your remote servers',
        Terminal: 'false',
      },
      target: [
        {
          target: 'AppImage',
          arch: ['armv7l', 'x64'],
        },
      ],
    },
  }
}
