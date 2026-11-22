FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run lint && npm run build && npm run seo:audit

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=4000 ANALYTICS_FILE=/app/data/analytics-live.json \
    NG_ALLOWED_HOSTS=converterallai.com,localhost,127.0.0.1
WORKDIR /app
COPY --from=build /app/dist/converterallai ./dist/converterallai
RUN mkdir data && chown node:node data
USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s CMD ["node", "-e", "fetch('http://127.0.0.1:'+process.env.PORT+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["node", "dist/converterallai/server/server.mjs"]
