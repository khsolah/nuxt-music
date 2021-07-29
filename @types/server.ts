import { AxiosResponse } from 'axios'

// get access token response type
/* eslint-disable camelcase */
export type GetAccessTokenResponse = AxiosResponse<{
  access_token: string
  refresh_token: string
  expires_in: string
}>
