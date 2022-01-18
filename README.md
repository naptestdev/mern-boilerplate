# MERN Stack Boilerplate

A Boilerplate that needs only one deployment

## How it works?

- On development
  - Client is on localhost:3000
  - Server is on localhost:5000
  - Client request to /api route and is redirected through a proxy by vite
- On production
  - Client: static files sent through the express server
  - Server lives on the /api route

## How to use

- Clone the project
- Run `npm i` then `cd client` and `npm i`
- Add `MONGODB_URI` variable to .env file
- Go to the root folder and run `npm run dev`

## Technology included

- Server
  - Express
  - Mongoose
  - Dotenv
  - Cors
  - Concurrently
  - Nodemon
- Client
  - Vite
  - React
  - React-router-dom
  - Axios
  - SWR

## Deployment

- Just go to [heroku](https://heroku.com/), select the repository, add .env and deploy! No more configuration is required!
