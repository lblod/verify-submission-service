import { query, sparqlEscapeUri } from 'mu';
import request from 'request';

async function fetchInzendingen(bestuurseenheidUri) {
  const result = await query(`
    PREFIX meb: <http://rdf.myexperiment.org/ontologies/base/>
    PREFIX adms: <http://www.w3.org/ns/adms#>
    PREFIX pav: <http://purl.org/pav/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX eli: <http://data.europa.eu/eli/ontology#>
    PREFIX prov: <http://www.w3.org/ns/prov#>

    SELECT ?task ?created ?modified ?inzending ?document
    WHERE {
      GRAPH ?g {
        ?task prov:generated ?inzending ;
          dct:created ?created ;
          dct:modified ?modified .
        ?inzending a meb:Submission ;
          pav:createdBy ${sparqlEscapeUri(bestuurseenheidUri)} .
        OPTIONAL { ?inzending dct:subject ?document . }
      }
    }
    ORDER BY DESC(?created)
  `);
  return result.results.bindings.map(b => {
    return {
      created: b['created'].value,
      modified: b['modified'].value,
      submission: b['inzending'].value,
      submittedResource: b['document'].value
    };
  });
}

async function fetchInzendingTriples(taskUri) {
  return await constructQuery(`
    PREFIX meb: <http://rdf.myexperiment.org/ontologies/base/>
    PREFIX adms: <http://www.w3.org/ns/adms#>
    PREFIX pav: <http://purl.org/pav/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX eli: <http://data.europa.eu/eli/ontology#>
    PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
    PREFIX prov: <http://www.w3.org/ns/prov#>
    PREFIX nie: <http://www.semanticdesktop.org/ontologies/2007/01/19/nie#>
    PREFIX melding: <http://lblod.data.gift/vocabularies/automatische-melding/>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX eli: <http://data.europa.eu/eli/ontology#>
    PREFIX elod: <http://linkedeconomy.org/ontology#>
    PREFIX lblodBesluit: <http://lblod.data.gift/vocabularies/besluit/>

    CONSTRUCT {
      ?inzending a meb:Submission ;
        pav:createdBy ?organization ;
        pav:providedBy ?publisher ;
        dct:subject ?submittedResource ;
        adms:status ?status ;
        prov:atLocation ?url ;
        nie:hasPart ?file .
      ?submittedResource a foaf:Document ;
        eli:date_publication ?publicationDate ;
        eli:passed_by ?passedBy ;
        eli:is_about ?subject ;
        elod:financialYear ?reportYear ;
        eli:first_date_entry_in_force ?firstDateInForce ;
        eli:date_no_longer_in_force ?dateNoLongerInForce ;
        lblodBesluit:chartOfAccount ?chartOfAccount ;
        lblodBesluit:taxRate ?taxRate ;
        lblodBesluit:taxType ?taxType ;
        lblodBesluit:hasAdditionalTaxRate ?hasAdditionalTaxRate ;
        melding:authenticityType ?authenticityType ;
        dct:description ?beschrijving ;
        rdfs:comment ?opmerking .
    }
    WHERE {
      GRAPH ?g {
        ${sparqlEscapeUri(taskUri)} prov:generated ?inzending .
        ?inzending a meb:Submission ;
          mu:uuid ?uuidInzending .
          ?inzending dct:subject ?submittedResource .
          OPTIONAL { ?inzending pav:createdBy ?organization . }
          OPTIONAL { ?inzending pav:providedBy ?publisher . }
          OPTIONAL { ?inzending adms:status ?status . }
          OPTIONAL { ?inzending prov:atLocation ?url . }
          OPTIONAL { ?inzending nie:hasPart ?file . }
        ?submittedResource a foaf:Document ;
          mu:uuid ?uuidDocument .
          OPTIONAL { ?submittedResource eli:date_publication ?publicationDate . }
          OPTIONAL { ?submittedResource eli:passed_by ?passedBy . }
          OPTIONAL { ?submittedResource eli:is_about ?subject . }
          OPTIONAL { ?submittedResource elod:financialYear ?reportYear . }
          OPTIONAL { ?submittedResource eli:first_date_entry_in_force ?firstDateInForce . }
          OPTIONAL { ?submittedResource eli:date_no_longer_in_force ?dateNoLongerInForce . }
          OPTIONAL { ?submittedResource melding:authenticityType ?authenticityType . }
          OPTIONAL { ?submittedResource lblodBesluit:chartOfAccount ?chartOfAccount . }
          OPTIONAL { ?submittedResource lblodBesluit:taxRate ?taxRate . }
          OPTIONAL { ?submittedResource lblodBesluit:taxType ?taxType . }
          OPTIONAL { ?submittedResource lblodBesluit:hasAdditionalTaxRate ?hasAdditionalTaxRate . }
          OPTIONAL { ?submittedResource dct:description ?beschrijving . }
          OPTIONAL { ?submittedResource rdfs:comment ?opmerking . }
      }
    }
  `);
}

async function constructQuery(query) {
  const format = 'text/plain'; // N-triples format
  const options = {
    method: 'POST',
    url: process.env.MU_SPARQL_ENDPOINT,
    headers: {
      'Accept': format
    },
    qs: {
      format: format,
      query: query
    }
  };

  return new Promise ( (resolve,reject) => {
    return request(options, function(error, response, body) {
      if (error)
        reject(error);
      else
        resolve(body);
    });
  });
}

export {
  fetchInzendingen,
  fetchInzendingTriples
};
