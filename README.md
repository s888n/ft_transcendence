# ft_transcendence
**Table of Contents:**
- [Description](#description)
- [Tech Stack](#tech-stack)
- [Modules](#modules)
- [Setup](#setup)

## Description

[ft_transcendence](./assets/en.subject.pdf) is a web application that allows users to play a 3D version of the classic Pong game. The game is implemented using NextJS and ThreeJS and the backend is implemented using Django. Users can play against each other Localy , remotely, play against an AI opponent, create tournaments,and customize the game. The project also includes user management, authentication, and live chat.
## Tech Stack

| Category  | Technology |
| ------------- | ------------- |
| **Languages** | ![typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) |
| **Frontend**  | ![nextjs](https://img.shields.io/badge/next%20js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![Threejs](https://img.shields.io/badge/ThreeJs-black?style=for-the-badge&logo=three.js&logoColor=white) ![tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)|
| **Backend** | ![django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=green)  ![django rest framework](https://img.shields.io/badge/django%20rest-ff1709?style=for-the-badge&logo=django&logoColor=white)|
| **Database** | ![postgresql](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) |
| **Authentication** | ![jwt](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white) |
| **Containerization** | ![docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) |
| **Networking** | ![nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white) |
| **Machine Learning** | ![tensorflow](https://img.shields.io/badge/Tensorflow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white) ![Keras](https://img.shields.io/badge/Keras-D00000?style=for-the-badge&logo=Keras&logoColor=white)|
| **Caching** | ![redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white) |
| **Tools** | ![git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white) ![vscode](https://img.shields.io/badge/VSCode-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white) ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white) ![Firefox](https://img.shields.io/badge/Firefox_Browser-FF7139?style=for-the-badge&logo=Firefox-Browser&logoColor=white)|

## Modules

- required:

| Module | Type | Description | Done |
| --- | --- | --- | --- |
| **Backend Framework** | Major | Use Django as a backend Framework | ✅ |
| **User Management** | Major | Standard user management, authentication, users across tournaments| ✅ |
| **Advanced 3D Techniques** | Major | The Pong game is implemented using Three.js | ✅ |
| **Remote Players** | Major | Users can play against each other remotely | ✅ |
| **Remote Authentication** | Major | OAuth 2.0 authentication with 42  | ✅ |
| **Live Chat** | Major | Users can send direct messages to other users | ✅ |
| **AI Opponent** | Major | Machine Learning AI Opponent trained with Reinforcement Learning | ✅ |
| **Server-Side Pong** | Major | Replacing Basic Pong with Server-Side Pong | ✅ |
| **Game Customization Options** | Minor | Users can customize the game | ✅ |
| **Database Backend** | Minor | Use PostgreSQL as a database backend | ✅ |
| **Browser Compatibility** | Minor | The Web App should be compatible with all major browsers | ✅ |

- stuff i added:

| Module | Description |Done |
| --- | --- | --- |
| **Real-Time Notifications** | Users can receive real-time notifications (game invites, new chat Messages...) | ✅ |
| **AI Difficulty Levels** | Users can select the difficulty level of the AI | ✅ |
| **Resumable Games** | Users can resume games and tournaments where they left off | ✅ |
| **Games History** | Users can see All the games they played (local, online, tournament, AI) | ✅ |
## Setup
1. Clone the repository
```bash
git clone https://github.com/s888n/ft_transcendence.git
```
2. Change the directory
```bash
cd ft_transcendence
```
3. replace `YOUR_IP` with your IP address in `example.env` and `frontend/example.env.production` files and rename them to `.env` and `.env.production` respectively.
4. Run the following command to start the project
```bash
docker compose up
```

**Note:** `Login with 42` will not work for you as it requires a 42 API key. You can replace the 42 OAuth with your own OAuth.

