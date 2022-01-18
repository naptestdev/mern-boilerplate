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

- I used React 17's renderToString API, and it means that you can upgrade to React 18 :D

To do it, first off, run: `npm i react@rc react-dom@rc` (npm i react@18 react-dom@18 when it reaches its official release), then modify src/server.jsx like this:

`import { renderToString } from 'react-dom/server'` to `import { renderToPipeableStream } from 'react-dom/server'`

`
export function render(url, context) {
    return renderToString(
        <StaticRouter context={context} location={url}>
            <App />
        </StaticRouter>
    );
}
`

to

`
export function render(url, context) {
  const context = {};
  let didError = false;
  return renderToPipeableStream(
    <StaticRouter context={context} location={url}>
      <App />
    </StaticRouter>,
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
app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      let template, render
      if (!isProd) {
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/server.jsx')).render
      }
      else {
        template = indexProd
        render = require('./dist/server/server.js').render
      }
      const context = {}
      const appHtml = render(url, context)
      if (context.url) {
        return res.redirect(context.url)
      }
      const html = template.replace(`<!--content-->`, appHtml)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    }
    catch (e) {
      !isProd && vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  })
`

to

`
app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl
      let template, render
      if (!isProd) {
        template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/server.jsx')).render
      }
      else {
        template = indexProd
        render = require('./dist/server/server.js').render
      }
      const context = {}
      handleErrors(async function () {
        render(url, context)
      })
      if (context.url) {
        return res.redirect(context.url)
      }
    }
    catch (e) {
      !isProd && vite.ssrFixStacktrace(e)
      console.error(e)
      res.status(500).end(e.message)
    }
  });
`

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

