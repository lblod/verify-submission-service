import { app, errorHandler } from 'mu';

import {
  fetchInzendingen,
  fetchInzendingTriples
} from './queries';

app.get('/', function( req, res ) {
  res.send('Hello from verify-submission-service');
} );

app.get('/bestuurseenheid', async function( req, res, next ) {
  try {
    const bestuurseenheidUri = req.query.uri;
    const inzendingen = await fetchInzendingen(bestuurseenheidUri);
    return res.status(200).send({ data: inzendingen });
  } catch (e) {
    console.log(`An error has occured: ${e}`);
    return next(e);
  }
} );

app.get('/inzending', async function( req, res, next ) {
  try {
    const taskUri = req.query.uri;
    console.log(`Trying to retrieve triples harvested by task <${taskUri}>`);
    const content = await fetchInzendingTriples(taskUri);
    return res.status(200).type('text/plain').send(content);
  } catch (e) {
    console.log(`An error has occured: ${e}`);
    return next(e);
  }
} );

app.use(errorHandler);
