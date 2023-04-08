# Project Setup
    npm init -y  
    npm i -g typescript  
    tsc --init  
    npm i -D concurrently nodemon  
    npm i dotenv  
    npm i --save-dev @types/node  
    npm i pkg -g  


### In **tsconfig.json** file:   
    "outDir": "./build",  
    "rootDir": "./src",       

### In **package.json** file:
    "scripts": {
        "start:build": "tsc -w",
        "start:run": "nodemon build/index.js",
        "start": "concurrently npm:start:*",
        "start:compile": "tsc"
    },

### Run project with nodemon in watch mode: 
    npm start


# Creating a build:

### Compile *.ts* to *.js*:
    npm run start:compile

### Create *.exe* file for win x64:
     pkg build/index.js --targets=latest-win-x64 --output build/surgard-spammer

### Create *.exe* file for win x86:
     pkg build/index.js --targets=latest-win-x86 --output build/surgard-spammer-x86

    