import { app, errorHandler } from 'mu';

import {
  fetchInzendingen,
  fetchInzendingTriples
} from './queries';

app.get('/', function( req, res ) {
  res.send('Hello from verify-submission-service');
} );

app.get('/bestuurseenheid/:uri', async function( req, res, next ) {
  try {
    const bestuurseenheidUri = req.query.uri;
    const inzendingen = await fetchInzendingen(bestuurseenheidUri);
    if (inzendingen.length) {
      return res.status(200).send({inzendingen});
    } else {
      return res.status(204).send({inzendingen});
    }
  } catch (e) {
    console.log(`An error has occured: ${e}`);
    return next(e);
  }
} );

app.get('/inzending', async function( req, res, next ) {
  try {
    const taskUri = req.query.uri;
    const triples = await fetchInzendingTriples(taskUri);
    if (triples.length) {
      return res.status(200).send({triples});
    } else {
      return res.status(204).send();
    }
  } catch (e) {
    console.log(`An error has occured: ${e}`);
    return next(e);
  }
} );

app.use(errorHandler);
