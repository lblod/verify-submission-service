import { sparqlEscapeUri } from 'mu';
import { querySudo as query } from '@lblod/mu-auth-sudo';

const publicGraph = process.env.PUBLIC_GRAPH || 'http://mu.semte.ch/graphs/public';

async function fetchInzendingen(bestuurseenheidUri) {
  return await query(`
    PREFIX meb: <http://rdf.myexperiment.org/ontologies/base/>
    PREFIX adms: <http://www.w3.org/ns/adms#>
    PREFIX pav: <http://purl.org/pav/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX eli: <http://data.europa.eu/eli/ontology#>

    CONSTRUCT {
      ?inzending a meb:Submissions ;
        adms:status ?inzendingStatus .
    }
    WHERE {
      GRAPH ${sparqlEscapeUri(publicGraph)} {
        ?inzending a meb:Submissions ;
          pav:createdBy ${sparqlEscapeUri(bestuurseenheidUri)} ;
          adms:status ?inzendingStatus ;
          dct:subject ?document .
        ?document eli:date_publication ?publicationDate .
      }
    }
    ORDER BY DESC(?publicationDate)
  `);
}

export {
  fetchInzendingen
};
