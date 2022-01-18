//CommonJS
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const fs = require("fs");
const path = require("path")

const PostRoute = require("./routes/PostRoute");

const isTest = process.env.NODE_ENV === 'test';
const isProd = process.env.NODE_ENV === 'production';

let root = process.cwd()

async function createServer() {
  const resolve = (p) => path.resolve(__dirname, p)
  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : ''
  const vite = await require('vite').createServer({
    root,
    logLevel: isTest ? 'error' : 'info',
    server: {
      middlewareMode: 'ssr',
    }
  })

  app.use(vite.middlewares)

  if (!isProd) {
    app.use(cors({ origin: true, credentials: true }));
  }

  app.use(express.json());

  app.enable("trust proxy");

  mongoose.connect(process.env.MONGODB_URI, {}, () =>
    console.log("Connected to MongoDB Database")
  );

  app.use("/api/post", PostRoute);

  if (isProd) {
    app.use(express.static("dist/client"));
  }

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
  return { app, vite }
}

if (!isTest) {
  const port = process.env.PORT || 5000;
  createServer().then(({ app }) =>
    app.listen(port, () => console.log(`Server is listening on port ${port}`))
  )
}

exports.createServer = createServer