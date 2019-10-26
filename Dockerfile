FROM node:12 as build
WORKDIR /data/
ENV NODE_ENV=production
RUN export SPEEDTESTVERSION="0.10.0.20-1.173ad8d" && \
    export SPEEDTESTARCH="x86_64" && \
    export SPEEDTESTPLATFORM="linux" && \
    mkdir -p bin && \
    curl -v -L https://ookla.bintray.com/download/ookla-speedtest-$SPEEDTESTVERSION-$SPEEDTESTARCH-$SPEEDTESTPLATFORM.tgz | tar -zx -C /data/bin && \
    chmod +x bin/speedtest && \ 
    ls -al bin
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .

FROM node:12 as app
WORKDIR /data/
COPY --from=build --chown=node:node /data/ .
USER node

CMD ["node", "index.js"]