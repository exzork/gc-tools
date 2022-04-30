FROM node:16-slim
ADD . /booklist-react
WORKDIR /booklist-react
RUN npm install
RUN npm install -g serve
RUN npm run build
CMD ["npm","install","-g","serve"]
CMD ["serve", "-s", "build"]
EXPOSE 3000