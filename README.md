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
> docker run -p 3000:3000 gcr.io/apollo-creabo-dev/decir-webapp:latest

## Deploy on cloudrun (which is being used)
### prepare gcloud
> gcloud auth login
> gcloud config set project apollo-creabo-dev (or prod)

### Build and deploy to cloudrun
> docker build -t gcr.io/apollo-creabo-dev/decir-webapp:latest . --platform linux/amd64 
> docker push gcr.io/apollo-creabo-dev/decir-webapp:latest
> gcloud run deploy decir-webapp --region=us-central1 --image gcr.io/apollo-creabo-dev/decir-webapp:latest --min-instances=1 --port=3000 --no-use-http2
### Build and deploy to kubernetes
1. create .env file
2. Build image and push (make sure to change to apollo-creabo-prod for production env)
> docker build -t gcr.io/apollo-creabo-dev/decir-webapp:latest . --platform linux/amd64 
> docker push gcr.io/apollo-creabo-dev/decir-webapp:latest
3. Select cluster
gcloud container clusters get-credentials web2-frontend
4. Deploy
kubectl apply -f deployment/prod/deployment.yml