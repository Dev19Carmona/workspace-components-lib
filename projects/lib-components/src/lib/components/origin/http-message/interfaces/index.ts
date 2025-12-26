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

export type IHttpMessage = IHttpErrorMessage | IHttpSuccessMessage

