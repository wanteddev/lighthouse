# Lighthouse Auditing Bot 

## Summary
This project creates a containerized auditing environment for Google's [Lighthouse](https://developers.google.com/web/tools/lighthouse) tool.
Bringing all the benefits of running your tests in a stable environment without the overhead of updating CI/CD pipelines and code

![](/readme.png)

## Features
* __Ad-hoc Auditing__ - Quickly run an audit of a website with the `/lighthouse {url}` command, or simply type `/lighthouse` to launch a dialog with all available options
* __Job Scheduling__ - With the `/lighthouse jobs` command, you can schedule an auditing job to be run whenever necessary
* __Customizeable HTML Reports__ - Always be able to view the full detailed report from Lighthouse as an HTML file, which is provided by a template in this project, and customize parts of the template (in `src/static/reportTemplate.html`) to your heart's content!
* __Trend Charts__ - Track changes in each of the audit categories over time for a given URL by running the `/lighthouse stats {url}` command and clicking the link to an intuitive dashboard (also provided as an HTML template that can be customized in `src/static/statsTemplate.html`)

## Development
### Pre-requisites & Notes

* **Node.js v12+**

Regardless of the method you are deploying with, this application relies on a variety of environment variables to be able to function properly. Either use the `export` method, or inject your docker container with env variables depending on what method you are deploying this chatbot with.

|       Variable Name       |           Example Value           |         Explanation         |
| ----------------: | :------------------------- | :---------------------------------- |
|              PORT | 3001                       | The port being used by this chatbot                 |
|             TOKEN | xoxb-921212312-125361390560-xxxxxxxxxx | The OAuth token value received after installing the Slack App |
|    MONGO_USERNAME | root                       | Auth username for a mongodb server       |
|    MONGO_PASSWORD | test_passwd                | Auth password for a mongodb server        |
|      MONGO_SERVER | 192.168.1.10:27017         | The endpoint for a mongodb server              |
|    CHATBOT_SERVER | http://192.168.1.10:3001   | IP to be used by this chatbot (needed to set URL endpoints in Message Attachments) |
|     TZ (optional) | Asia/Seoul                 | The timezone value that will be used on server (important for job scheduling) |


### Developing with Docker
**0. Build local Lighthouse bot image**
```
docker build -t wanteddev/lighthouse-bot .
```

**1. Run mongodb (as a separate container)**  
```
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME="root" -e MONGO_INITDB_ROOT_PASSWORD="test_passwd" --name lighthouse-mongo mongo:latest
```

**2. Run Lighthouse bot container**  
Note: Ensure you have the environment variables set when running the container  
  
Example `run` command:
```
docker run -d -p 3001:3001 -v $PWD/src:/home/app/src -e TZ="Asia/Seoul" -e PORT=3001 -e TOKEN="xoxb-921212312-125361390560-xxxxxxxxxx" -e MONGO_USERNAME="root" -e MONGO_PASSWORD="test_passwd" -e MONGO_SERVER="192.168.1.129:27017" -e CHATBOT_SERVER="http://192.168.1.129:3001" --name lighthouse-bot wanteddev/lighthouse-bot
```


### Developing with PM2
**0. Follow the [installation guide for MongoDB](https://docs.mongodb.com/manual/installation/) to set up your MongoDB instance** 
  
**1. Set values for all required environment variables**  
```
export PORT=3001
export TOKEN=xoxb-921212312-125361390560-xxxxxxxxxx
export MONGO_USERNAME=root
export MONGO_PASSWORD=test_passwd
export MONGO_SERVER=192.168.1.10:27017
export CHATBOT_SERVER=http://192.168.1.10:3001
export TZ=Asia/Seoul
```

**2. Globally install [PM2](https://pm2.keymetrics.io)**  

```
yarn global add pm2
```

**3. Install dependencies**  
```
yarn
```

**4. Run chatbot with pm2**  
```
pm2 start ecosystem.config.js
```
**5. [Register a slash command](https://docs.mattermost.com/developer/slash-commands.html#custom-slash-command) in Mattermost that sends a `GET` request to the `/lighthouse` endpoint**  
![](documentation/img/lighthouse-slashcmd.png)

## Deployment
Deploying this chatbot is done in the same way as the [development environment setup](#development), with the exception that you would set the `NODE_ENV` variable to `production`, as well as not do any volume binding to the host when running the chatbot with Docker.
 
## Slack App registration
As we're open-sourcing this project, the responsibility to deploy and manage each application and data stored in it falls upon whoever ultimately deploys it.
We're sharing the configurations used in our private Slack App so that others may reference it and apply it to their own auditing environments!

#### Interactive Components
In order to use the inputs and options inside of the custom auditing functionality, you need to activate the "Interactive Components" functionality, and set the Request URL value as below:
**Request URL**: `https://${chatbotUrl}/receive_submission`
#### Slash Commands
As the main method of accessing the chatbot server, we have registered a Slash command as follows:
* Command: `/lighthouse`
* Request URL: `https://${chatbotUrl}/lighthouse`
* Short Description: `Use Lighthouse Audit Commands`
* Usage Hint: `help`

#### Bots
Some of the settings we've activated for our chatbot include:
* `Always Show My Bot as Online`
* `Show Tabs` > `Messages Tab` (So that you can run audits in a DM)

#### Permissions
In order to post messages, this chatbot requires the following 3 permissions:
* `chat:write`: Basic messaging permissions
* `chat:write.public`: Ability to post messages in channels the bot is not a member of
* `commands`: Ability to add slash commands that people can use

## Troubleshooting
* The audit command fails with an `error while loading shared libraries: libX11-xcb.so.1: cannot open shared object file: No such file or directory` error on Ubuntu
  * Run the command below to install dependencies needed to launch Puppeteer from your host

  ```
  sudo apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm-dev
  ```

### Current Tasks
- [x] Implementing trend charts for audit results to be accessed with `/lighthouse stats {url}`
- [x] Styling audit trends dashboard 
- [x] Add usernames to schedule schemas so that they can be easily viewed through `/lighthouse schedule list`
- [x] Implementing `/lighthouse schedule info {id}` to get full details of a given job
- [ ] Add unit testing with Jest or AVA
- [ ] Write documentation to make command usage clearer
- [ ] Add more comprehensive logging
- [x] Investigate the possibility of using workers to run audits so that multiple audits can run simultaneously
- [x] Add a configurable number of past audits to be fetched from `stats` command
  - e.g. `/lighthouse stats https://google.com limit 15` 

## Blog
 - [로컬에서 lighthouse 테스트 하는 방법 (한국어)](https://medium.com/wantedjobs/wanteddev-lighthouse-%EC%89%AC%EC%9A%B4-%EC%82%AC%EC%9A%A9%EB%B2%95-feat-pm2-mongo-db-cc07d9d3b520)
