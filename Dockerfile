FROM node:12-alpine
RUN apk add --no-cache python g++ make

# FROM node:alpine
# ENV PATH="${PATH}:/sbin"
# ENV CI=true

WORKDIR '/app'
COPY package.json .
COPY package-lock.json .
# RUN npm config set unsafe-perm true
# RUN apk add --update python make g++\
#   && rm -rf /var/cache/apk/*
# RUN apk add --update make python3 py3-pip

RUN apk --no-cache --virtual build-dependencies add \
        python \
        make \
        g++

RUN npm ci
RUN npx browserslist@latest --update-db
# RUN npm install
COPY . /app
RUN npm run build
EXPOSE 9000
CMD ["npm", "run", "start:ssr"]

