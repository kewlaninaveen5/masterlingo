<h1 align="center">✨ Fullstack Chat & Video Calling App ✨</h1>

backend starts with npm start, frontend starts with npm run dev 

(expecting you are in root directory)
To start the backend -> 
1. Run command `cd backend`
2. run command `npm install`
3. run command `npm start`

To start the frontend -> 
1. Run command `cd frontend`
2. run command `npm install`
3. run command `npm run dev`

Project uses prisma and I will create a seed data job soon so that we can setup the test users immediately. 

Whats already built: 
This repo has 2 sub folders: 
1. Frontend
2. Backend
3. Microservices (under development)

Frontend is built in React. it is simple and fast react. No extremely flashy clicks. But the frontend is optimised for minimum re-renders

Features of Backend:
0. Built in Javascript (migration to typescript coming soon) 
1. Connects to a Cloud Postgres Database (Neon) 
2. ORM used : Prisma
3. Auth is Session ID based (JWT never reaches frontend)
4. Uses Redis for session, websocket data storage and scalability.
5. Chat is currently one to one only.


What's Planned to be built:
1. Chatting user should not have access to other user's private details like "id" - rest all is fine.  
2. Migrate from JWT based authentication to Session based authentication
3. Migrate all the model communication into services layer. 
4. add some kind of stream and show a demo video
5. Generate AI enabled news fetching application that fetches news in your learning language. You will also be able to fetch news in any other selected language. 
6. I intend to use micoservices architecture, Webhooks, Kafka, GraphQL, MQTT, SSE in this service. its gonna be my star performer!  


I hope some real language learner/user finds this news feature useful! 