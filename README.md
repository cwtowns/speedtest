This is a sample site with a mongo / typegoose node backend and react front end.  Typescript has been added and the build deploys with docker-compose.  nodemon watches the local filesystem for changes and hot reloads.  This avoids the need to redeploy via Docker to realize your changes.  There is also a devcontainer configuration to allow VSCode to launch in the container and edit there.  

Initial Docker setup is taken from [here]( https://zzzachzzz.github.io/blog/dockerizing-a-mern-app-for-development-and-production) and probably has some flaws with my modifications.  I am still new to Docker and this is not meant to be a guide to best practices.  For example, I have not tested or updated the prod side of the Docker configuration.  

The backend site has a basic movies api:

GET  
http://localhost:3000/api/movie

POST  
http://localhost:3000/api/movie  
```
{  
    "name": "Avengers: Endgame",  
    "time": ["14:15", "16:00", "21:30", "23:00"],  
    "rating": 8.8  
}
```

The front end is hosted on http://localhost:8000 and is simply the starter react app and 2 pages for invoking the backend api.  Mostly this is a nice starter project for me to refer back to or clone to get started on a new project 🙂
