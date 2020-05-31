# emasperak-API
![License](https://img.shields.io/github/license/irhamdz/emasperak-API?style=flat-square)
![Repo Size](https://img.shields.io/github/repo-size/irhamdz/emasperak-API?style=flat-square) 
[![Github Issue](https://img.shields.io/github/issues/irhamdz/emasperak-API?style=flat-square)](https://github.com/irhamdz/emasperak-API/issues) 

A RESTful API that scrapes the https://logammulia.com to get you today's buy and buyback for emas and perak.

---
### Running Locally
1. Clone this repo: `git clone https://github.com/irhamdz/emasperak-API.git`
2. move to the repo downloaded: `cd emasperak-API`
3. Install dependencies: `npm install` or in shorthand `npm i`
4. run the server : `npm start` or if you want to run in dev mode `npm run dev` 

### Debugging
`DEBUG=* npm run dev`

---

### List of endpoint
##### Emas
- Get last updated emas price:
```http request
GET /emas
Host: localhost:3000
Content-Type: application/json; charset=utf-8
```

##### Perak
- Get last updated perak price:
```http request
GET /perak
Host: localhost:3000
Content-Type: application/json; charset=utf-8
```

---

### Task
- [ ] Add docs (?)
- [X] Add perak API
- [X] Add emas buyback API
- [ ] Add perak buyback API
- [ ] Add another location other than pulogadung - jakarta
- [ ] Add average indonesian inflation API
- [ ] Add USD kurs API
- [X] Deploy to Google App Engine
- [X] Add mongodb (via Mongo Atlas)
- [ ] Add Redis

---

**Notes**
- This API scrapes https://logammulia.com unofficially.
