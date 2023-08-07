# node-red-contrib-procare

Node for retrieving Procare (daycare) media urls and comments

## Devolved

Instead of writing new nodes, the project has devolved to simply using the builtin nodes:

![screenshot](/assets/node-screenshot.png)

This anonymized flow can be imported into Node-RED.

[The import JSON lives here](/flows.json)

## Assumptions

1. You want to retrieve `Primrose` schools' activities
   * The `uri` is initially coded to be `https://api-school.primrose.procareconnect.com`
1. [signal-cli-rest-api](https://github.com/bbernhard/signal-cli-rest-api/tree/master) is installed and running
   * The three Signal-related functions (on the right) currently use `10.10.10.10` - change this for your instance
1. [exiftool](https://exiftool.org/) binary is available on your host
   * The `write-exif` node relies on this
1. You have write permissions to your media destination
   * Currently saving to a directory named `/share/procare/api/`

## Output

Once configured, Node-RED will retrieve media, post it to your family members using Signal, and save the media with an appropriate exif DateTimeOriginal property to your location of choice.

![signal-output](/assets/signal-example.png)
