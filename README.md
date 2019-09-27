# Verify submission service

Microservice that helps verifying the content of submissions at a technical level.

## API

This service features two endpoints:

### GET /bestuurseenheid?uri=bestuurseenheid-uri
Get all the submissions and their statuses for a bestuurseenheid

### GET /inzending?uri=automatic-submission-task-uri
Get all knowledge retrieved from a submitted publication based on the task URI as returned by the [automatic-submission-service](http://github.com/lblod/automatic-submission-service)

## Installation

Add the following snippet to your `docker-compose.yml`:
```
  verify-submission:
    image: lblod/verify-submission-service
    environment:
      MU_SPARQL_ENDPOINT: "http://virtuoso:8890/sparql"
```

