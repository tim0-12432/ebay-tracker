const nconf = require('nconf');
const axios = require('axios');
const cheerio = require('cheerio');
const mqtt = require('mqtt');
const cron = require('node-cron');


nconf.env().file({ file: 'config/config.json' });


function sendMqtt(mqttClient, category, message) {
    mqttClient.publish(`ebay_tracker/cat/${category.replace(/ /g, "_")}`, message, { qos: 1, retain: true });
}


function stripChars(str) {
    return str.replace(/[\$\€]/gi, '')
            .replace(/ö/g, "oe")
            .replace(/Ö/g, "Oe")
            .replace(/ü/g, "ue")
            .replace(/Ü/g, "Ue")
            .replace(/ä/g, "ae")
            .replace(/Ä/g, "Ae")
            .trim();
}


function readEbay(mqttClient) {
    const categories = nconf.get('categories');
    const ebayUrl = nconf.get('ebayUrl');

    for (const category of categories) {
        axios.get(`${ebayUrl}/s-${category.replace(/ /g, "-")}/k0`)
            .then((response) => {
                const $ = cheerio.load(response.data);
                const items = $('#srchrslt-content').find('.aditem-main');
                const results = [];
                items.each((index, element) => {
                    const item = {
                        title: stripChars($(element).find('.text-module-begin').text()),
                        price: stripChars($(element).find('.aditem-main--middle--price').text()),
                        url: ebayUrl + $(element).find('.text-module-begin > a').attr('href'),
                        location: stripChars($(element).find('.aditem-main--top--left').text()),
                        sending: stripChars($(element).find('.text-module-end > span').text())
                    };
                    if (nconf.get('debug')) {
                        console.debug(`${index} - ${JSON.stringify(item)}`);
                    }
                    results.push(item);
                });
                sendMqtt(mqttClient, category, JSON.stringify(results));
            })
            .catch((error) => {
                console.error(error);
            });
    }
}


let mqttIsAvailable = false;
const client = mqtt.connect({host: nconf.get('mqtt').host, port: nconf.get('mqtt').port, debug: nconf.get('debug')});
client.on("connect", () => {
    console.info(new Date().toISOString() + ": Connected to MQTT broker on " + `${nconf.get('mqtt').host}:${nconf.get('mqtt').port}!`);
    client.publish("ebay_tracker/status", "online");
    mqttIsAvailable = true;
});
client.on("disconnect", () => {
    console.info(new Date().toISOString() + ": Disconnected from MQTT broker!");
    mqttIsAvailable = false;
});
client.on("error", (error) => {
    console.error(error);
});

cron.schedule(nconf.get('cronJob'), () => {
    if (mqttIsAvailable) {
        console.log(new Date().toISOString() + ": Starting run...");
        readEbay(client);
    }
});
