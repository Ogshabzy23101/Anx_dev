FROM node:22
WORKDIR /app
COPY . .
ENV API_TOKEN=plaintext-demo-token
RUN npm install
EXPOSE 8080
CMD ["npm", "start"]
