# Linkedin PDF Reader

## Description

This is a simple PDF reader that allows you to read PDFs from your Linkedin profile.

## Installation

1. Clone the repository
2. Install dependencies.

```bash
npm install
```

3. Run the application.

```bash
node server.js
```

## Usage

1. Use Postman or any other API testing tool to send a POST request to the following endpoint:

```bash
HTTP Method: POST

http://localhost:3000/upload
```

Note: Use the multipart/form-data option to send the file.

The application will extract the content using `regex` and will create a JSON file with the main sections, creating an ouput of the file into the `output` folder.
