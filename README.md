# Steffes Mobile App

## Main Features
- **Lot Management**
  - Create and edit lots
  - View lot details and history
  - Photo capture and management for lots
  - Photo tagging
  - Azure integration

- **Inventory Tracking**
  - N/A

- **Approvals System**
  - N/A

- **Account Management**
  - N/A


## Setup & Running the App

### Prerequisites
- Node.js
- Expo CLI (`npm install -g expo-cli`)

### Running the App
1. Install dependencies:
   ```bash
   npm install
   npx expo install
   ```
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
3. Use Expo Go app on your phone or an emulator to run the app

## Azure Functions (Local Development)

The project includes local Azure Functions in the `/AzureFunctions` directory. These functions are currently running locally and haven't been deployed to Azure.

### Running Azure Functions Locally
1. Navigate to the AzureFunctions directory:
   ```bash
   cd AzureFunctions
   ```
2. Install dependencies:
   ```bash
   npm install
   npm run build
   ```
3. Start the functions locally:
   ```bash
   func start
   ```

### Important Note
- The Azure Functions are currently running locally for development
- They need to be deployed to Azure for production use
- Make sure the functions are running locally when testing the mobile app
- The mobile app is configured to connect to these local functions

## Development Workflow
1. Start the Azure Functions locally
2. Start the Expo app
3. Make changes and test locally
4. When ready for production, deploy the Azure Functions to Azure




# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
