# TO DO:
- [x] Game over screen
- [x] remove nickname stuff (from the front and back)
- [x] player disconnected screen (online mode)
- [ ] Landing page (60%)
- [ ] Add a Friends List (to the landing page maybe)
- [ ] Add match history  (to the landing page maybe)
- [ ] all the pages get pushed down (caused by navbar)
- [ ] add a backgound to the site (dark mode or gradiant or SVG oe something)
- [ ] finish tournament page (styling and the nextGame function) [90% done]
- [ ] remove "add friend" button after blocking
- [ ] friend request notification not send until clicked twice
- [ ] !!!!DONT allow empty passwords / spaces  in the settings page
- [ ] i keep gettign redirected to http://127.0.0.1:3000/login when i try to sign up (i think it's caused by the auth middleware detecting an invalid token)
- [ ] unclickable "Forgot your password?" in the login page
- [ ] when clicking "add friend" button the matches are fetched again
- [ ] Frontend can't be dockerized due to axios/fetch 3jina

# build bugs:
      - 42 auth not working (acessss from midlware false undefined)
      - signup not working (keep redirecting to login)

## Modules:

* shared :

      - [x] Framework for the backend (major)
      - [x] Database (minor)

* Salah :

      - [x]  3D graphics (major)
      - [x]  Online multiplayer (major)
      - [x]  AI (major)
      - [x]  Game in the backend (major)  
      - [x]  Customization ? (minor)

* Yahya :

      - [x]  Standard user management, authentication, users across tournaments (major)  
      - [x]  implementing a remote authentication "42 auth" ? (major)

* Simo:

      - [x]  chat (major)

# how to run docker(dev):
- Clone the repo
- cd into the repo
- run `docker build -f ./Dockerfile -t next . `
- run `docker run -p 3000:3000  next`
