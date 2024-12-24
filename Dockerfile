FROM mcr.microsoft.com/windows/servercore:ltsc2022-KB5041160 as installer

SHELL ["powershell", "-Command", "$ErrorActionPreference = 'Stop';$ProgressPreference='silentlyContinue';"]

RUN Invoke-WebRequest -OutFile nodejs.zip -UseBasicParsing "https://nodejs.org/dist/latest/node-v22.9.0-win-x64.zip"; Expand-Archive nodejs.zip -DestinationPath C:\; Rename-Item "C:\\node-v22.9.0-win-x64" c:\nodejs

FROM mcr.microsoft.com/windows/nanoserver:ltsc2022-KB5041160


WORKDIR C:/nodejs
COPY --from=installer C:/nodejs/ .
RUN SETX PATH C:\nodejs
RUN npm config set registry https://registry.npmjs.org/

# Working dir
WORKDIR /usr/src/app

# Copy files from Build
COPY package*.json ./

# Install Files
RUN npm install 

# Copy SRC
COPY . .

# Open Port
EXPOSE 3000

ENTRYPOINT ["powershell.exe"]
# Docker Command to Start Service
CMD [ "npm", "start" ]