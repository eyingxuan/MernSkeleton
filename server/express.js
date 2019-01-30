import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import cors from 'cors'
import helmet from 'helmet'
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
// import devBundle from './devBundle'; //only for development
import path from 'path';
const CURRENT_WORKING_DIR = process.cwd();
import React from 'react'
import ReactDOMServer from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import MainRouter from './../client/MainRouter'
import { SheetsRegistry } from 'react-jss'
import JssProvider from 'react-jss/lib/JssProvider'
import {MuiThemeProvider, createMuiTheme, createGenerateClassName} from '@material-ui/core'
import { indigo, pink } from '@material-ui/core/colors';
import Template from '../template'

const theme = createMuiTheme({
    palette: {
      primary: {
      light: '#757de8',
      main: '#3f51b5',
      dark: '#002984',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff79b0',
      main: '#ff4081',
      dark: '#c60055',
      contrastText: '#000',
    },
      openTitle: indigo['400'],
      protectedTitle: pink['400'],
      type: 'light'
    }
});


const app = express();
// devBundle.compile(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

app.use('/', userRoutes);
app.use('/', authRoutes);

app.get('*', (req, res) => {
    const sheetsRegistry = new SheetsRegistry();
    const generateClassName = createGenerateClassName();
    const context = {};
    const markup = ReactDOMServer.renderToString(
        <StaticRouter location={req.url} context={context}>
            <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
                    <MainRouter/>
                </MuiThemeProvider>
            </JssProvider>
        </StaticRouter>
    )
    if (context.url) {
        return res.redirect(303, context.url)
    }
    const css = sheetsRegistry.toString();
    res.status(200).send(Template({
        markup: markup,
        css: css
    }));
});

app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            "error": err.name + ":" + err.message
        });
    }
})



export default app