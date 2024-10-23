import {WebContentsView} from 'electron'

export async function getFrame(view: WebContentsView, frame?: string, tries = 0) {
  if (!frame) return view.webContents.mainFrame
  const frames = view.webContents.mainFrame.frames
  const found = frames.find(f => f.url.includes(frame))
  if (found) return found

  if (tries > 10) return

  await new Promise(resolve => setTimeout(resolve, 1000))
  return getFrame(view, frame, tries + 1)
}
