# shelter-text

A node server that responds to text messages with a list of shelter bed availability.

Try it out! Send a text to:

> (720) 999-9616

## Running the server

1. Copy `.env` to `.env.local` and set `TWILIO_TOKEN`
2. Start the server:

  ```sh
  $ node app.js
  ```

## Deploying

1. `heroku config:add TWILIO_TOKEN=MY_TWILIO_TOKEN`
2. `git push heroku master`

## License

ISC © [Raine Revere](https://raine.tech)
