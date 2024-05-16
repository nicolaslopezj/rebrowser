export interface RebrowserAction {
  type:
    | 'navigate'
    | 'makeRequest'
    | 'wait'
    | 'reload'
    | 'setLocalStorageItem'
    | 'reset'
    | 'executeScript'
    | 'executeRequest'
  requestMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  requestBody?: string
  requestHeaders?: any
  takeHeadersFromRequestThatStartsWith?: string
  duration?: number
  localStorageKey?: string
  localStorageValue?: string
  url?: string
  code?: string
  frame?: string
}

export interface RebrowserInstruction {
  _id: string
  actions: RebrowserAction[]
}

export interface RebrowserRequestResponse {
  instructions: RebrowserInstruction[]
}

export interface RebrowserRule {
  urlMatch: string
  omit: boolean
  filterJSONPaths?: string[]
}

export interface RebrowserRulesRequestResponse {
  rules: RebrowserRule[]
}

export interface RebrowserEventData {
  version: string
  device: string
  arch: string
  url: string
  body: string
  requestBody?: string
  requestMethod?: string
  status: number
  page: string
}
