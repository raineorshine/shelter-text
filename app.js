require('localenv')
const twilio = require('twilio')
const express = require('express')
const bodyParser = require('body-parser')
const scrapeShelters = require('./scrape-shelters')

// Create express app with middleware to parse POST body
var app = express()
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.send('Server running. Waiting for Twilio response at /sms.')
})

// Create a route to respond to a call
app.post('/sms', (req, res) => {

  // set the validation options explicitly if we are in production
  const protocol = req.headers['x-forwarded-proto'] || req.protocol
  const url = `${protocol}://${req.hostname}${req.url}`
  const validationOptions = process.env.NODE_ENV !== 'development' ? { url } : undefined

  // validate that the request came from twilio
  if (!twilio.validateExpressRequest(req, process.env.TWILIO_TOKEN, validationOptions)) {
    console.log('Not Twilio')
    return res.status(500).send('Only accepts requests from Twilio.')
  }

  // Create the TwiML response
  var twiml = new twilio.TwimlResponse()

  // scrape the shelter data from United Way
  scrapeShelters().then(shelters => {

    // generate a textable message
    const output = '🛌Beds Available:' + shelters.map(shelter => {
      const name = shelter['Shelter Name']
      const beds = shelter['Single Spaces Available']
      const phone = shelter['Shelter Hotline'] || shelter['Shelter Main Phone']
      const phoneText = phone ? ' ' + phone : ''
      return `\n• ${name}${phoneText}: ${beds}`
    })
    twiml.message(output)

    // send the TwiML response
    res.type('text/xml')
    res.send(twiml.toString())
  })
  .catch(err => {
    console.log('Scrape error', err)
    res.status(500).send('Scrape error (see logs)')
  })
})

const server = app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${server.address().port}!`)
)
