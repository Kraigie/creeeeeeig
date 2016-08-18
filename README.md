# CraigBotV2
Discord bot built using [eris](https://github.com/abalabahaha/eris)

## To run yourself
1. Clone the repo locally
2. Inside the repo run `npm install`
  * You'll likely get some errors. If you don't want voice functionality, ignore them.
  * If you're on linux, install whatever it asks you to.
  * If you're on windows, start praying to the build gods. Try running `npm install --global --production windows-build-tools` and google whatever other problems you run into.
  * If you **_really_** can't figure it out, and are okay with being yelled at and belittled, come bother people [here](https://discord.gg/9UZwzNK)
3. Create an `auth.json` file as described below
4. Run `node bot.js`

## auth.json example
You can choose to omit any of these, excluding token, that you don't wish to use. However, I would also remove their related commands to prevent errors until I implment some way of automatically doing it >B^)
```js
{
  "token": "<discord bot user token>",
  "weather_key": "<open weather api>",
  "yt_key": "<google developers youtube api key>",
  "sc_key": "<souncloud app client id>"
}
```
