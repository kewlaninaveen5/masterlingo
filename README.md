<h1 align="center">✨ Fullstack Chat & Video Calling App ✨</h1>

Whats already built: 
This repo has 2 sub folders: 
1. Frontend
2. Backend

Frontend is built in React. it is simple and fast react. No extremely flashy clicks. But the frontend is optimised for minimum re-renders

Features of Backend:
0. Built in Javascript (migration to typescript coming soon) 
1. Connects to a Cloud Postgres Database (Neon) 
2. ORM used : Prisma
4. sends a JWT token in User's cookies (httponly) for authenitcation


What's Planned to be built:
1. Introduce Redis and store server state like userdata, websocket data there. Also link sessions there. 
2. Migrate from JWT based authentication to Session based authentication
3. migrate from raw Webrtc to Peer.js
4. Move all the webrtc logic into its specific service. 
5. Currently all the model talking is happening directly in the middleware. Migrate all the controllers into services layer and the middlewares should only call controllers through services.
6. add stream and show a demo video

Planned in another Microservice:
1. Another microservice I should make in python fast API to showcase strength in both languages/frameworks
2. along with the service, we also need kafka for communication
3. notifications will move to this microservice completely.
4. both express and fastapi servers should be using the same redis and kafka cluster since this a demo project not a real application. 


Finally:
rebuild the chat and videocall features. 