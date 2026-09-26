# Solid Pod Browser

A standalone React prototype for browsing and managing resources in a [Solid](https://solidproject.org/) Pod.

The project was created as a focused browser component before integration into a larger application. It demonstrates authentication with a Solid identity provider and common file-management operations against a user's Pod.

## Features

- Sign in with a Solid identity provider using OIDC
- Discover the authenticated user's Pod storage
- Browse folders and resources
- Navigate through nested containers
- Create folders
- Upload files
- Download files using the authenticated Solid session
- Responsive, lightweight web interface

## Tech stack

- React
- JavaScript
- Inrupt Solid Client
- Inrupt Solid authentication and React UI libraries
- CSS
- Create React App

## Run locally

### Prerequisites

- Node.js and npm
- A Solid identity / Pod from a compatible provider

### Installation

```bash
npm install
npm start
```

The app starts at `http://localhost:3000` by default.

## Project structure

```text
public/
src/
  components/
    FileActions.js       # Folder creation controls
    FileTable.js         # Resource list and file/folder actions
    FileUploader.js      # File selection and upload controls
    FolderNavigator.js   # Current Pod path and back navigation
  services/
    solidPodService.js   # Solid data-access and file-management operations
  App.js                 # Application state, authentication and orchestration
  App.css                # Component styling
  index.js               # React entry point and Solid SessionProvider
  index.css              # Global styles
```

The UI is split into focused React components, while Solid-specific data access is isolated in a service module. `App.js` coordinates authentication, navigation state, and user actions rather than containing the full interface implementation.

