# Atlanta Beltline Project

Before getting started, make sure you have [npm  and node.js installed](https://www.npmjs.com/get-npm)!

To run the app, first download the project and install all the project dependencies like so:

```
git clone https://github.com/Holben888/CS4400-AtlantaBeltline-DB.git
cd ./CS4400-AtlantaBeltline-DB
npm run install-frontend
npm run install-backend
```

Then, you can run both parts of the application. To start the backend, do the following:

```
cd ./server
npm run dev
```

...and to start the frontend (using a different terminal window):

```
cd ./client
npm run dev
```

### Summary of functionality

Once everything is running, you should be able to visit `localhost:3000` on your web browser. This will route you to the login screen.

User info is saved in your browser's storage so the app will remember your login when you refresh the page.

To see what the backend returns, you can visit `localhost:3001/test` to call the `test` endpoint. This should show something like the following:

```
{ response: 'App is running!' }
```

For testing future endpoints, you should be able to visit any of them through the browser to see what they return. You can also use `console.log(...)` to print out the result of your queries. These should appear in your terminal where the backend is running.
