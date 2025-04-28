FROM node:22-alpine AS base

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine AS prod

WORKDIR /app

COPY --from=base /app/build ./build
COPY --from=base /app/public ./public
COPY --from=base /app/package.json ./
COPY --from=base /app/package-lock.json ./

RUN npm ci --omit=dev

EXPOSE 80

ENV NODE_ENV=production
ENV PORT=80

CMD ["npm", "start"]
