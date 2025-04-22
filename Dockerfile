FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --no-frozen-lockfile

COPY . .

EXPOSE 3000
# CMD ["sh", "-c", "pnpm seed && pnpm start"]
CMD ["pnpm", "start"]