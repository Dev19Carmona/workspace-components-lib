export interface IHttpErrorMessage {
  code: string
  message: string
  type: 'error'
}

export interface IHttpSuccessMessage {
  code: string
  message: string
  type: 'success'
}

export interface IHttpWarningMessage {
  code: string
  message: string
  type: 'warning'
}

export type IHttpMessage = IHttpErrorMessage | IHttpSuccessMessage | IHttpWarningMessage

