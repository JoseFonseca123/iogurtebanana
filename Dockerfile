FROM node:14

EXPOSE 3001

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install --no-optional && npm cache clean --force

# Bundle app source
COPY . .

CMD [ "forever", "/usr/src/app/index.js" ]
