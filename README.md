This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Local development
1. Create .env from sample
2.run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Run by docker
> docker build -t nextjs-docker .      
> npm docker run -p 3000:3000 nextjs-docker

## Deploy on cloudrun (which is being used)
### prepare gcloud
> gcloud auth login
> gcloud config set project apollo-creabo-dev

### Build and deploy
> docker build -t gcr.io/apollo-creabo-dev/decir-webapp:latest . --platform linux/amd64 
> docker push gcr.io/apollo-creabo-dev/decir-webapp:latest
> gcloud run deploy decir-webapp --region=us-central1 --image gcr.io/apollo-creabo-dev/decir-webapp:latest --min-instances=1 --port=3000 --no-use-http2