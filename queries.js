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
      ?inzending a meb:Submission ;
        adms:status ?status .
      ?inzendingStatus skos:prefLabel ?statusLabel .
    }
    WHERE {
      GRAPH ${sparqlEscapeUri(publicGraph)} {
        ?inzending a meb:Submission ;
          pav:createdBy ${sparqlEscapeUri(bestuurseenheidUri)} ;
          adms:status ?status ;
          dct:subject ?document .
        ?inzendingStatus skos:prefLabel ?statusLabel .
        ?document eli:date_publication ?publicationDate .
      }
    }
    ORDER BY DESC(?publicationDate)
  `);
}

async function fetchInzendingTriples(taskUri) {
  return await query(`
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
        mu:uuid ?uuidInzending ;
        pav:createdBy ?organization ;
        pav:providedBy ?publisher ;
        dct:subject ?submittedResource ;
        adms:status ?status ;
        prov:atLocation ?url ;
        nie:hasPart ?file ;
        melding:authenticityType ?authenticityType ;
        dct:description ?beschrijving ;
        rdfs:comment ?opmerking .
      ?submittedResource a foaf:Document ;
        mu:uuid ?uuidDocument ;
        eli:date_publication ?publicationDate ;
        eli:passed_by ?passedBy ;
        eli:is_about ?subject ;
        elod:financialYear ?reportYear ;
        eli:first_date_entry_in_force ?firstDateInForce ;
        eli:date_no_longer_in_force ?dateNoLongerInForce ;
        lblodBesluit:chartOfAccount ?chartOfAccount ;
        lblodBesluit:taxRate ?taxRate ;
        lblodBesluit:taxType ?taxType ;
        lblodBesluit:hasAdditionalTaxRate ?hasAdditionalTaxRate .
    }
    WHERE {
      GRAPH ${sparqlEscapeUri(publicGraph)} {
        ${sparqlEscapeUri(taskUri)} prov:generated ?inzending .
        ?inzending a meb:Submission ;
          mu:uuid ?uuidInzending ;
          pav:createdBy ?organization ;
          pav:providedBy ?publisher ;
          dct:subject ?submittedResource ;
          adms:status ?status ;
          prov:atLocation ?url ;
          nie:hasPart ?file ;
          melding:authenticityType ?authenticityType ;
          dct:description ?beschrijving ;
          rdfs:comment ?opmerking .
        ?submittedResource a foaf:Document ;
          mu:uuid ?uuidDocument ;
          eli:date_publication ?publicationDate ;
          eli:passed_by ?passedBy ;
          eli:is_about ?subject ;
          elod:financialYear ?reportYear ;
          eli:first_date_entry_in_force ?firstDateInForce ;
          eli:date_no_longer_in_force ?dateNoLongerInForce ;
          lblodBesluit:chartOfAccount ?chartOfAccount ;
          lblodBesluit:taxRate ?taxRate ;
          lblodBesluit:taxType ?taxType ;
          lblodBesluit:hasAdditionalTaxRate ?hasAdditionalTaxRate .
      }
    }
  `);
}
export {
  fetchInzendingen,
  fetchInzendingTriples
};
