# One-day project

A flask server which listens to mqtt topics and displays them on a webpage.

## Use

1. `docker pull ghcr.io/tim0-12432/ebay-tracker:latest`
2. `docker run --name ebay-tracker -d -v ebay-tracker_config:/usr/bin/app/config ghcr.io/tim0-12432/ebay-tracker:latest`

## Customize

### Build own image

`sudo docker build . --file Dockerfile --tag tim0-12432/ebay-tracker:<tag>`

### Run own container

`sudo docker run --name ebay-tracker -d -v ebay-tracker_config:/usr/bin/app/config tim0-12432/ebay-tracker:<tag>`
