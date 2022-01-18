//CommonJS
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const { createServer: createViteServer } = require('vite')

const PostRoute = require("./routes/PostRoute");

//ESM - will be compiled into CommonJS by Babel.
import { renderToString } from 'react-dom/server';
import { StaticRouter } from "react-router-dom/server";
import App from "./src/App";
import Html from "./src/Html"
import React from "react"

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

async function createServer() {
  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })
  app.use(vite.middlewares)

  if (process.env.NODE_ENV !== "production") {
    app.use(cors({ origin: true, credentials: true }));
  }

  app.use(express.json());

  app.enable("trust proxy");

  mongoose.connect(process.env.MONGODB_URI, {}, () =>
    console.log("Connected to MongoDB Database")
  );

  app.use("/api/post", PostRoute);

  if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/dist"));
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
  }
  else {
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
  }
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server is listening on port ${port}`));
}

createServer()
