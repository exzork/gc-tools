FROM node:18-slim
ADD . /gc_tools
WORKDIR /gc_tools
RUN ["yarn", "install"]
RUN ["yarn", "run", "build"]
CMD ["yarn","global","add","serve"]
CMD ["serve", "-s", "build"]
EXPOSE 3000