FROM node:20-alpine AS builder
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build:api

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=builder /app ./

EXPOSE 5000

CMD ["npm", "run", "start:api"]
