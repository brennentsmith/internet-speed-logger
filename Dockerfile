FROM node:12 as build
WORKDIR /data/
ENV NODE_ENV=production
RUN export SPEEDTESTVERSION="1.0.0" && \
    export SPEEDTESTARCH="x86_64" && \
    export SPEEDTESTPLATFORM="linux" && \
    mkdir -p bin && \
    curl -Ss -L https://ookla.bintray.com/download/ookla-speedtest-$SPEEDTESTVERSION-$SPEEDTESTARCH-$SPEEDTESTPLATFORM.tgz | tar -zx -C /data/bin && \
    chmod +x bin/speedtest
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

FROM node:12 as app
WORKDIR /data/
COPY --from=build --chown=node:node /data/ .
USER node

CMD ["node", "index.js"]