# One-day project

A ebay tracker which tracks the latest products and prices from 'ebay Kleinanzeigen' and sends it to the MQTT broker for home automation.

## Use

1. `docker pull ghcr.io/tim0-12432/ebay-tracker:latest`
2. `docker run --name ebay-tracker -d -v ebay-tracker_config:/usr/src/app/config ghcr.io/tim0-12432/ebay-tracker:latest`

## Customize

### Build own image

`sudo docker build . --file Dockerfile --tag tim0-12432/ebay-tracker:<tag>`

### Run own container

`sudo docker run --name ebay-tracker -d -v ebay-tracker_config:/usr/src/app/config tim0-12432/ebay-tracker:<tag>`
