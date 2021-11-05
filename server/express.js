const express = require( 'express' );
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fs = require( 'fs' );
const path = require( 'path' );
const React = require( 'react' );
const ReactDOMServer = require( 'react-dom/server' );
const { StaticRouter, matchPath } = require( 'react-router-dom' );

const { SYSTEM_VARS } = require('../config/config');
const srvPort = SYSTEM_VARS['EXTSRVPORT'];
const fetchParams = {
    tid: SYSTEM_VARS['TENANTID'],
    thost: SYSTEM_VARS['TENANTHOST'],
    tport: SYSTEM_VARS['TENANTPORT'],
    layout: SYSTEM_VARS['DEVICELISTLAYOUT'],
    objType: 'Device',
    filter: null,
    token: null
}

// create express application
const app = express();
app.use(cors());
app.use(cookieParser());

// import App component
const { App } = require( '../src/components/app' );

// import routes
const routes = require( './routes' );
const { parse } = require('path');

// serve static assets
app.get( /\.(js|css|map|ico)$/, express.static( path.resolve( __dirname, '../dist' ) ) );

// for any other requests, send `index.html` as a response
app.use( '*', async ( req, res ) => {
    // get matched route
    const matchRoute = routes.find( route => matchPath( req.path, route ) );
    // console.log(req.baseUrl);
    // console.log(typeof matchRoute.component.fetchData);

    // fetch data of the matched component
    let componentData = { 
        token: req.cookies['SMAX_AUTH_TOKEN'] || null,
        requestData: {
            srcObj: {
                id: req.query.srcId || null,
                recType: req.query.srcFile || null
            },
            tgtObj: {
                id: req.query.tgtId || null,
                recType: req.query.tgtFile || null
            },
            queryCoords: {
                mapKey: req.query.mapkey || null,
                mapName: req.query.mapname || null,
                x: req.query.mapx || null,
                y: req.query.mapy || null
            }
        },
        fetchedData: {
            ciColocated: {},
            locationFiles: {}
        }
    }

    if( typeof matchRoute.component.fetchData === 'function' ) {
        fetchParams.token = componentData.token;
        if (componentData.requestData.queryCoords.mapKey !== null) {
            fetchParams.filter = `MapKey_c='${componentData.requestData.queryCoords.mapKey}'`;

            componentData.fetchedData.ciColocated = await matchRoute.component.fetchData( fetchParams );
        }
        
        
        if (componentData.requestData.tgtObj.id !== null) {
            let locFetchParams = fetchParams;
            locFetchParams.objType = 'Location';
            locFetchParams.layout = SYSTEM_VARS['LOCATIONFILELAYOUT'];
            locFetchParams.filter = `Id='${componentData.requestData.tgtObj.id}'`;

            const attData = await matchRoute.component.fetchData( locFetchParams );

            if (attData.entities) {
                const arrArr = JSON.parse(attData.entities[0].properties.LocationAttachments);
                const fileList = arrArr.complexTypeProperties.map((item) => {
                    return {id: item.properties.id, file_name: item.properties.file_name, file_extension: item.properties.file_extension}
                }).filter(item => item.file_extension === 'svg');
    
                componentData.fetchedData.locationFiles = fileList;
            }

        }
    }

    // read `index.html` file
    let indexHTML = fs.readFileSync( path.resolve( __dirname, '../dist/index.html' ), {
        encoding: 'utf8',
    } );

    // get HTML string from the `App` component
    let appHTML = ReactDOMServer.renderToString(
        <StaticRouter location={ req.originalUrl } context={ componentData }>
            <App />
        </StaticRouter>
    );

    // populate `#app` element with `appHTML`
    indexHTML = indexHTML.replace( '<div id="app"></div>', `<div id="app">${ appHTML }</div>` );

    // set value of `initial_state` global variable
    indexHTML = indexHTML.replace(
        'var initial_state = null;',
        `var initial_state = ${ JSON.stringify( componentData ) };`
    );

    // set header and status
    res.contentType( 'text/html' );
    res.status( 200 );

    return res.send( indexHTML );
} );

// run express server on port 9000
app.listen( srvPort, () => {
    console.log( `Express server started at http://localhost:${srvPort}` );
} );