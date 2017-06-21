# AWS Cognito Web Starter

A simple starter project for using AWS-Cognito SDK in the web browser.

[Try the Demo](https://f1lt3r.github.io/aws-cognito-web-starter/index.html)

## About

This code takes the example code from the [AWS Cognito JavaScript SDK](https://github.com/aws/amazon-cognito-identity-js), and implements it in the most simple way I know how: _an HTML page with 1 JavaScript file_. The purpose of this is to vet the service and API before implementing it in product.

```
./aws-cognito-web-starter/
├── LICENSE
├── index.css
├── index.html
└── index.js
```

## Instructions

### Checkout and Install

```
git clone git@github.com/f1lt3r/aws-congito-web-starter.git
cd aws-congito-web-starter
npm install
```

### Serve Web Page (Optional)

Alternative: [Try the Demo](https://f1lt3r.github.io/aws-cognito-web-starter/index.html)

```
npm install serve -g
serve
```

Open your browser to [http://localhost:5000](http://localhost:5000), or wherever you are serving your code.

### Create your AWS Cognito User Pool

1. Login into you AWS Console
1. Create a Cognito User/Identity pool
1. **DO NOT ENABLE CLIENT SECRET WHEN CREATING YOUR POOL!**
1. Make sure email can be used as an alias (username)
1. Take note of:
	+ Pool Id: General Settings
	+ App Client Id: App Integration > App Client Settings > ID
1. Allow all custom attributes for this test

### Follow the Forms

Follow the web forms from left to right.

1. Configure your Pool and Client Ids
	+ For convenience, these are saved in sessionStorrage and are deleted when you close your tab
2. Sign up a user
3. Confirm registration code sent to email
4. Authenticate the user and receive access token

