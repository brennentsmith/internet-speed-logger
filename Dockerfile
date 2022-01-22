FROM node:16 as build
WORKDIR /data/
ENV NODE_ENV=production
RUN export SPEEDTESTVERSION="1.1.1" && \
    export SPEEDTESTARCH="x86_64" && \
    export SPEEDTESTPLATFORM="linux" && \
    mkdir -p bin && \
    curl -Ss -L https://install.speedtest.net/app/cli/ookla-speedtest-$SPEEDTESTVERSION-$SPEEDTESTPLATFORM-$SPEEDTESTARCH.tgz | tar -zx -C /data/bin && \
    chmod +x bin/speedtest
COPY . .
RUN npm ci

FROM node:16 as app
COPY --from=build /data/ .
CMD ["npm", "start"]
