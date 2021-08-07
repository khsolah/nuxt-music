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
const redirectUri =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000/auth/token'
    : 'https://khsolah-nuxt-music.herokuapp.com/auth/token'

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
  })
    .then(response => {
      console.log('[response]: ', response)

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
    .catch(error => {
      console.log('[error]: ', error)
      console.log(error.response.data)
    })
})

export default app
