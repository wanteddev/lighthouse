# Base image built from Dockerfile.base (Chrome Stable + Node LTS)
FROM jakejarvis/chrome-headless:latest

LABEL "com.github.actions.name"="Lighthouse Audit"
LABEL "com.github.actions.description"="Run tests on a webpage via Google's Lighthouse tool"


LABEL version="0.0.1"
LABEL repository="https://github.com/jakejarvis/lighthouse-action"
LABEL homepage="https://jarv.is/"
LABEL maintainer="Jake Jarvis <jake@jarv.is>"

# Download latest Lighthouse build from npm
# Cache bust to ensure latest version when building the image
ARG CACHEBUST=1
RUN npm install -g lighthouse

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]