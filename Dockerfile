FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

ENV PRISMA_CLIENT_OUTPUT="../dist/generated/prisma"

RUN npm run prisma:generate:prod

RUN npm run build 

ENV PORT=5000

EXPOSE 5000

CMD ["npm","start"]