export interface RebrowserAction {
  type: 'navigate' | 'makeRequest'
  requestMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  requestBody?: string
  requestHeaders?: any
  takeHeadersFromRequestThatStartsWith?: string
  url?: string
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
  url: string
  body: string
  status: number
  page: string
}
