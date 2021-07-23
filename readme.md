## Installation

- clone the repo linked to you through email.
- npm install for downloading all dependencies
- create .env file for local environment
- at .env file add VUE_APP_BASE_URL='https://www.googleapis.com/youtube/v3' and VUE_APP_API_KEY="KEY"
- get your own key from https://console.cloud.google.com/ by creating a project and enables Youtube Api V3 and finally create credentials then copy and paste your key.
- npm run build
- npm run serve

## Notes

- due to Youtube policy there are some limitations on using their apis so when u have 403 error go and change your api key by creating a new project.
- In the channel's page i supposed to get channel banner and put it in the page but the channel banner api only have insert option not listing so you will find me putting the same profile picture
