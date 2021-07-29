// LINK: https://developer.spotify.com/documentation/general/guides/authorization-guide/
// Authorization Code Flow

import axios, { AxiosError } from 'axios'
import express from 'express'
import qs from 'qs'
import { GetAccessTokenResponse } from '~/@types/server'

const Authorization = process.env.AUTHORIZATION

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const clientId = '67a86f66cf144ec4833135f83004ddd7'
const scope = encodeURIComponent('user-read-private user-read-email')
const redirectUri = 'http://localhost:5000/auth/token'

// 1. Have your application request authorization; the user logs in and authorizes access
app.get('/', (req, res) => {
  const state = req.headers.referer
  res.redirect(
    `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&state=${state}&scope=${scope}&show_dialog=true`
  )
})

// recieve code and state after step 1. Need to send the code and other datas to get access_toekn and refresh_token
// step 1 redirect to here, response query: { code, state }
app.get('/token', (req, res) => {
  const { code, state } = req.query as { code: string; state: string }

  // 2. Have your application request refresh and access tokens; Spotify returns access and refresh tokens
  axios({
    baseURL: 'https://accounts.spotify.com',
    url: '/api/token',
    method: 'POST',
    headers: {
      Authorization,
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    })
  })
    .then((response: GetAccessTokenResponse) => {
      res.redirect(
        `${state}${state.includes('?') ? '&' : '?'}access_token=${
          response.data.access_token
        }&refresh_token=${response.data.refresh_token}&expires_in=${
          response.data.expires_in
        }`
      )
    })
    .catch((error: AxiosError<{ error: string }>) => {
      console.log('[login error]: ', error.response?.data)
      res.redirect(`${state}${state.includes('?') ? '&' : '?'}login_error=true`)
    })
})

export default app
