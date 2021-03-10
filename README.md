# Lighthouse 검사 챗봇

## 개요
[Lighthouse](https://developers.google.com/web/tools/lighthouse)

## 기능 목록

* __즉시 검사__ - `/lighthouse {url}` 명령어로 빠르게 검사를 실행하거나, `/lighthouse` 명령어로 검사 설정 (검사 카테거리) 수정해서 검사할 수 있습니다
* __검사 스케쥴링__ - `/lighthouse jobs` 명령어로 검사 스케쥴링 기능이 제공합니다
* __ HTML 리포트 템플릿__ - HTML 템플릿을 통해 Lighthouse 검사에 대해 상세한 보고서를 받을 수 있습니다. `src/static/reportTemplate.html`에서 템플릿 파일을 마음대로 커스터마이징이 가능합니다!
* __트렌드 차트 시각화__ - `/lighthouse stats {url}` 명령어로 URL별로 카테거리의 결과를 차트로 확인할 수 있습니다. (`src/static/statsTemplate.html`에서 커스텀 가능!)

## 개발하기
### 준비사항

* **Node.js v10+**

* **설정  필요한 환경변수**  
Regardless of the method you are deploying with, this application relies on a variety of environment variables to be able to function properly. Either use the `export` method, or inject your docker container with env variables depending on what method you are deploying this chatbot with.

|       변수명       |           예시 값           |         설명         |
| ----------------: | :------------------------- | :---------------------------------- |
|              PORT | 3001                       | 챗봇이 이용하는 포트번호                 |
|             TOKEN | xoxb-921212312-125361390560-xxxxxxxxxx | 챗봇이 이용하는 슬랙 토큰 값 (Install App 메뉴에서 설치 후 받는 Oauth 토큰)|
|    MONGO_USERNAME | root                       | MongoDB에 접속하기 위한 username       |
|    MONGO_PASSWORD | test_passwd                | MongoDB에 접속하기 위한 비밀번호        |
|      MONGO_SERVER | 192.168.1.10:27017         | MongoDB 서버의 IP                    |
|    CHATBOT_SERVER | http://192.168.1.10:3001   | 슬랙 모달창이 챗봇 한테 요청보내기 위해 챗봇 IP (혹은 URL) 값 |
|     TZ (optional) | Asia/Seoul                 | 서버에서 이용하는 시간대 (스케쥴링 기능 활용하기 위해 매우 중요합니다) |

### Docker로 개발하기
**0. 로컬 image 빌드하기** (optional)
```
docker build -t wanteddev/lighthouse-bot .
```

**1. MongoDB 실행**
```
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME="root" -e MONGO_INITDB_ROOT_PASSWORD="test_passwd" --name lighthouse-mongo mongo:latest
```

**2. Lighthouse 챗봇 컨테이너 실행**    
예시 `docker run` 명령어:
```
docker run -d -p 3001:3001 -v $PWD/src:/home/app/src -e TZ="Asia/Seoul" -e PORT=3001 -e TOKEN="sd67j1cxepnc7meo3prf3krzgr" -e MONGO_USERNAME="root" -e MONGO_PASSWORD="test_passwd" -e MONGO_SERVER="192.168.1.129:27017" -e CHATBOT_SERVER="http://192.168.1.129:3001" --name lighthouse-bot wanteddev/lighthouse-bot
```

### PM2로 배포하기
**0. [MongoDB 설치 가이드](https://docs.mongodb.com/manual/installation/)에 따라 MongoDB 배포** 
  
**1. 필수적인 환경변수를 셋업**  
```
export PORT=3001
export TOKEN=xoxb-921212312-125361390560-xxxxxxxxxx
export MONGO_USERNAME=root
export MONGO_PASSWORD=test_passwd
export MONGO_SERVER=192.168.1.10:27017
export CHATBOT_SERVER=http://192.168.1.10:3001
export TZ=Asia/Seoul
```

**2. [PM2](https://pm2.keymetrics.io) 설치**  

```
yarn global add pm2
```

**3. 패키지 설치**  
```
yarn
```

**4. pm2로 실행**  
```
pm2 start ecosystem.config.js
```

### Slack app 등록
활성화 필요한 기능들:

#### Interactive Components
챗봇에서 모달창에 input을 받기 위해 Interactive Components 기능이 활성화합니다
**Request URL** 필드에서 `https://${chatbotUrl}/receive_submission`으로 세팅이 필요합니다
#### Slash Commands
챗봇이 사용하기 위해 Slash commands를 필요합니다. (원티드에선 `/lighthouse` 명령어로 사용하고 있습니다!)
#### Bots
챗봇 기본 설정중에 아래 설정들이 활성화하고 있습니다:
* `Always Show My Bot as Online`
* `Show Tabs` > `Messages Tab` (챗봇이 DM으로 사용하기 위함)
#### Permissions
Slack API를 사용하기 위해 아래 3가지 권한을 필요합니다:
* `chat:write`: 메시지 보내기 위함
* `chat:write.public`: 공개 채널에서도 메시지 보개기 위함
* `commands`: 명령어를 등록하고 사용하기 위함

## Troubleshooting
* Ubuntu 서버에서 직접 실행할 때에 검사가 `error while loading shared libraries: libX11-xcb.so.1: cannot open shared object file: No such file or directory`라는 에러로 실패할 경우:
  * 아래 명령어로 Puppeteer를 실행하기 위한 dependency를 설치

  ```
  sudo apt install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
  ```
