import React from "react"

const Html = (props) => {
    return (
        <html lang="en">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Vite App</title>
            </head>
            <body>
                <div id="app">{props.children}</div>
                <script type="module" src="/src/client.jsx"></script>
            </body>
        </html>
    )
}

export default Html