# Deployment

Build the web client with npm run build --workspace=@kenoracric/web and deploy as a Vite SPA with rewrite-to-index routing. Deploy API as a Node service with MongoDB and a required JWT secret. Configure VITE_API_URL, MONGODB_URI, JWT_ACCESS_SECRET, and CLIENT_URL in the hosting environment. Android APKs are built with the Android Gradle project under android/android after the React Native native project is generated and Android Studio tooling is installed.


