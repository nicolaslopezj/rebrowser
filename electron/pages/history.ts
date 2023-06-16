import {RebrowserEventData} from './types'

const history: Record<number, (RebrowserEventData & {headers: any})[]> = {}

// adds an history and only keep the last 1000 entries
export function addHistoryEntry(
  index: number,
  entry: RebrowserEventData & {headers: any}
) {
  const entries = history[index] || []
  entries.push(entry)
  if (entries.length > 1000) {
    entries.shift()
  }
  history[index] = entries
}

export function getHistory(index: number) {
  return history[index] || []
}
