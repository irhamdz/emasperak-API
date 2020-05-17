# emasperak-API
A RESTful API that scrapes the https://logammulia.com to get you today's buy and buyback for emas and perak.

---
### Running Locally
1. Clone this repo: `git clone https://github.com/irhamdz/emasperak-API.git`
2. move to the repo downloaded: `cd emasperak-API`
2. Install dependencies: `npm install` or in shorthand `npm i`
3. run the server : `npm start` or if you want to run in dev mode `npm run dev`

---

### List of endpoint
- Emas:
```http request
GET /emas
Host: localhost:3000
Content-Type: application/json; charset=utf-8
```

---

### Task
- [ ] add docs
- [ ] perak API
- [ ] emas buyback API
- [ ] deploy to openshift (?)
- [ ] add mongodb support or firebase (?)

---

**Notes**
- This API scrapes https://logammulia.com unofficially.
