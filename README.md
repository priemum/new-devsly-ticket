# new-devsly-ticket

## Info
This is made only for devsly server, If you need somewhat like this in your server you can use it

## Requirements
Node >= 16.6.0

## Setup
* After installing node, do `npm i` which installes all packages
* Add the `bot-token` and `mongo-db-link` in *config.json*
* Now add your bot `clientID` and `guildID` in *config.json*
* You can add the roles who need access to the tickets in `supportRoles`
* You can leave `category` as blank, It'll create new one automatically
* `transcript` where it saves transcript

## Run
* do `node deploy-command.js` to add slash commands to you guild. As Guild Takes instant to update. Global takes an hour to update
* then do `node index.js` The bot should be up and running

Dont create any PR as it's not a public project to maintain.
If there is any issue you can create a issue or contact me on discord `White2001#0530`

If you need a good coding service, join our server [Devsly.org](https://discord.gg/3UAFxQDNVu)
