/* eslint-disable camelcase */
// LINK: https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps?hl=zh_TW

// Step 1: Set authorization parameters
import axios from 'axios'
import express from 'express'
import qs from 'qs'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const redirectUri = process.env.REDIRECT_URI

app.get('/', (req, res) => {
  const state = req.headers.referer || process.env.REFERER
  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=https://www.googleapis.com/auth/youtube.readonly&access_type=offline&state=${state}&include_granted_scopes=true&prompt=select_account`
  )
})

app.get('/token', (req, res) => {
  const code = req.query.code as string
  const state = req.query.state as string

  axios({
    baseURL: 'https://oauth2.googleapis.com',
    url: '/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: qs.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    })
  }).then(response => {
    res.redirect(
      `${state}${state.includes('?') ? '&' : '?'}${qs.stringify({
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
        scope: response.data.scope,
        token_type: response.data.token_type
      })}`
    )
  })
})

app.get('/refresh', async (_, res) => {
  const token = await axios({
    baseURL: 'https://oauth2.googleapis.com',
    url: '/token',
    method: 'POST',
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: process.env.REFRESH
    }
  })
    .then(({ data: { access_token } }) => access_token)
    .catch(() => null)

  res.json({ token })
})

export default app
