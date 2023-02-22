FROM node:19.3.0 as base
RUN npm install -g pnpm
WORKDIR /home/node/app
COPY package.json ./
RUN pnpm install

FROM base as pre-build
COPY src ./src
COPY public ./public
COPY tsconfig.json ./
COPY config-overrides.js ./
COPY swagger.json ./
RUN pnpm run gen

FROM pre-build as build
ARG API_ENDPOINT
ENV API_ENDPOINT=${API_ENDPOINT}
ARG GENERATE_SOURCEMAP
ENV GENERATE_SOURCEMAP=${GENERATE_SOURCEMAP}
RUN echo > .env
RUN echo API_ENDPOINT=\"${API_ENDPOINT}\" >> .env
RUN echo GENERATE_SOURCEMAP=\"${GENERATE_SOURCEMAP}\" >> .env
RUN pnpm run build

FROM nginx:alpine as web
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /home/node/app/build /etc/nginx/html
