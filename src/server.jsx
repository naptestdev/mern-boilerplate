import { renderToString } from 'react-dom/server';
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import React from "react"

export function render(url, context) {
    return renderToString(
        <StaticRouter context={context} location={url}>
            <App />
        </StaticRouter>
    );
}
