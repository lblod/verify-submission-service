# Verify submission service

Microservice that helps verifying the content of submissions

## API

This service features two endpoits:
* `GET /bestuurseenheid/:uri` (param: encoded bestuurseenheid URI): get all the inzendingen and their statuses for a bestuurseenheid
* `GET /inzending/:uri` (param: encoded task URI, returned by the service `automatic-submission-service`): get all the triples related to the inzending and the document from an automatic submission task

## Installation

Add the following snippet to your `docker-compose.yml`:
```
  verify-submission:
    image: lblod/verify-submission-service
    links:
      - database:database
```

## Configuration

The following environment variables can be configured:
* `GRAPH` (default: http://mu.semte.ch/graphs/public): The graph where the triples reside
