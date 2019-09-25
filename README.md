# Verify submission service

Microservice that helps verifying the content of submissions

## Installation

Add the following snippet to your `docker-compose.yml`:
```
  export:
    image: lblod/verify-submission-service
    links:
      - database:database
```

## Configuration

The following environment variables can be configured:
* `GRAPH` (default: http://mu.semte.ch/graphs/public): The graph where the triples reside

### Endpoints

This service features two endpoits:
* `/bestuurseenheid/:uri` (param: encoded bestuurseenheid URI): the user can GET all the inzendingen and their statuses for a bestuurseenheid
* `/inzending/:uri` (param: encoded task URI, returned by the service `automatic-submission-service`): the user can GET all the triples related to the inzending and the document from an automatic submission task
