# MERN Stack Boilerplate

A boilerplate made to work with MongoDB + Express.js + React.js + Node.js + Vite. Unlike many others, you only need ONE deployment.

## How to make it work?

Just add the `MONGODB_URI` variable to the .env file, run `npm i` and then `npm run dev`. It should start on port 5000, unless you add the PORT variable to the .env file.

## Dependencies used

  - Express
  - Mongoose
  - Dotenv
  - Cors
  - Concurrently //you can remove this actually
  - Nodemon
  - Vite
  - React
  - React-router-dom
  - Axios
  - SWR

## Deployment

- Just go to [heroku](https://heroku.com/) (or whatever you want to use), select the repository, and deploy :)

## React 18

- The fact I didn't follow Vite's docs and did the whole SSR thing myself using React 17's renderToString API instead means that you can upgrade to React 18 :D

To do it, first off, run: `npm i react@rc react-dom@rc` (npm i react@18 react-dom@18 when it reaches its official release), then modify server.js like this:

`import { renderToString } from 'react-dom/server'` to `import { renderToPipeableStream } from 'react-dom/server'`

`
const renderApp = (req, res) => {
  const context = {};
  let didError = false;
  const html = "<!DOCTYPE html>" + renderToString(
    <Html>
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    </Html>
  );
  return { context, html }
}
`

to

`
const renderApp = (req, res) => {
  const context = {};
  let didError = false;
  const html = renderToPipeableStream(
    <Html>
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    </Html>,
    ,
    {
      onCompleteShell() {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        pipe(res);
      },
      onError(x) {
        didError = true;
        console.error(x);
      }
    }
  );
}
`

and add this function:

`
function handleErrors(fn) {
  return async function (req, res, next) {
    try {
      return await fn(req, res);
    }
    catch (x) {
      next(x);
    }
  };
}
`

then modify this part:

`
app.get("*", (req, res) => {
      try {
        const { context, html } = renderApp(req, res);
        if (context.url) {
          return res.redirect(context.url);
        }
        else {
          return res.status(200).send(html);
        }
      }
      catch (e) {
        vite.ssrFixStacktrace(e)
        console.error(e)
        res.status(500).end(e.message)
      }
});
`
(there are two of them)

to

`
app.get('/*', handleErrors(async function (req, res) {
  renderApp(req, res);
}));
`
(much better, don't you think so?),

then in client.jsx, change

`
ReactDOM.hydrate(
  <Html>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Html>,
  document
);
`

to

`
ReactDOM.hydrateRoot(
  document,
  <Html>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Html>
)
`

and then you are good to go! Remember, I haven't test this myself, but you can try.

Also, this might be really buggy sometimes, I forked it and modified it, so yeah.

