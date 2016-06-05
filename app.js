require('localenv')
const twilio = require('twilio')
const express = require('express')
const bodyParser = require('body-parser')
const scrapeShelters = require('./scrape-shelters')

// Create express app with middleware to parse POST body
var app = express()
app.use(bodyParser.urlencoded({ extended: false }))

// Create a route to respond to a call
app.post('/sms', (req, res) => {
  //Validate that this request really came from Twilio...
  if (twilio.validateExpressRequest(req, process.env.TWILIO_TOKEN)) {
    var twiml = new twilio.TwimlResponse()

    scrapeShelters().then(shelters => {
      const output = '🛌Beds Available:' + shelters.map(shelter => {
        const name = shelter['Shelter Name']
        const phone = shelter['Shelter Hotline'] || shelter['Shelter Main Phone'] ? ' ' + (shelter['Shelter Hotline'] || shelter['Shelter Main Phone']) : ''
        const beds = shelter['Single Spaces Available']
        return `\n• ${name}${phone}: ${beds}`
      })
      twiml.message(output)

      res.type('text/xml')
      res.send(twiml.toString())
    })
    .catch(err => {
      console.log(err)
      res.status(500).send('Error (see console)')
    })
  } else {
    res.status(500).send('you are not twilio.  Buzz off.')
  }
})

const server = app.listen(process.env.port, () =>
  console.log(`Server listening on port ${server.address().port}!`)
)
