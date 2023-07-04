async function requestPermissions() {
  const grant = await Notification.requestPermission()
  console.log(grant)
}

export interface Params {
  title: string
  body: string
}

export async function showNotification(params: Params) {
  await requestPermissions()

  new Notification(params.title, {body: params.body})
}
