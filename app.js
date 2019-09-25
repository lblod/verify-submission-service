import { app, errorHandler } from 'mu';

import {
  fetchInzendingen,
  fetchInzendingTriples
} from './queries';

app.get('/', function( req, res ) {
  res.send('Hello from verify-submission-service');
} );

app.get('/bestuurseenheid/:uri', async function( req, res ) {
  try {
    const bestuurseenheidUri = req.params.uri;
    const inzendingen = await fetchInzendingen(bestuurseenheidUri);
    if (inzendingen.length > 0) {
      res.status(200).send({inzendingen}).end();
    } else {
      res.status(204).send({inzendingen}).end();
    }
  } catch (e) {
    console.log(`An error has occured: ${e}`)
  }
} );

app.get('/inzending/:uri', async function( req, res ) {
  try {
    const taskUri = req.params.uri;
    const triples = await fetchInzendingTriples(taskUri);
    if (triples.length > 0) {
      res.status(200).send({triples}).end();
    } else {
      res.status(204).send({triples}).end();
    }
  } catch (e) {
    console.log(`An error has occured: ${e}`)
  }
} );

app.use(errorHandler);
