// Config

const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool

const userAttribute = AWSCognito
	.CognitoIdentityServiceProvider
	.CognitoUserAttribute

// Cross-Form Interfaces

let userPool
let cognitoUser

// User Pool Management

if (sessionStorage.UserPoolId) {
	configForm['UserPoolId'].value = sessionStorage.UserPoolId
}

if (sessionStorage.ClientId) {
	configForm['ClientId'].value = sessionStorage.ClientId
}

const setUserPool = () => {
	const UserPoolId = configForm['UserPoolId'].value
	const ClientId = configForm['ClientId'].value

	sessionStorage.UserPoolId = UserPoolId
	sessionStorage.ClientId = ClientId

	const poolData = {
		UserPoolId,
		ClientId
	}

	userPool = new AWSCognito
		.CognitoIdentityServiceProvider
		.CognitoUserPool(poolData)

	if (userPool) {
		return true
	}

	return false
}

setUserPool()

const setupUserPool = () => {
	if (configForm['UserPoolId'].value &&
		configForm['ClientId'].value) {
		setUserPool()
		return true
	}

	if (sessionStorage.UserPoolId &&
		sessionStorage.ClientId) {
		configForm['UserPoolId'].value = sessionStorage
			.UserPoolId

		configForm['UserPoolId'].value = sessionStorage
			.UserPoolId

		setUserPool()
		return true
	}

	return false
}

const userPoolIsConfigured = () => {
	if (userPool)  {
		return true
	}

	return setupUserPool()
}

const userPoolWarning = () => {
	alert('You must configure the UserPoolId & ClientId to continue!')
}

const configure = event => {
	event.preventDefault()
	sessionStorage.UserPoolId = configForm['UserPoolId'].value
	sessionStorage.ClientId = configForm['ClientId'].value
	const configured = setUserPool()

	if (configured) {
		alert('UserPool configured')
	}
}

configForm.onsubmit = configure

// Normal User Flow Forms

const signup = event => {
	event.preventDefault()

	if (!userPoolIsConfigured()) {
		userPoolWarning()
	}

	const birthdate = signupForm['birthdate'].value
	const email = signupForm['email'].value
	const gender = signupForm['gender'].value
	const name = signupForm['name'].value
	const password = signupForm['password'].value
	const phoneNumber = signupForm['phone_number'].value

	// console.log(birthdate)
	// console.log(email)
	// console.log(gender)
	// console.log(name)
	// console.log(password)
	// console.log(phoneNumber)

	const userAttributes = [
		new userAttribute({
		    Name: 'name',
		    Value: name
		}),

		new userAttribute({
		    Name: 'email',
		    Value: email
		}),

		new userAttribute({
		    Name: 'phone_number',
		    Value: phoneNumber
		}),

		new userAttribute({
		    Name: 'birthdate',
		    Value: birthdate
		}),

		new userAttribute({
		    Name: 'gender',
		    Value: gender
		}),
	]

    const errors = signupForm
    	.getElementsByClassName('errors')[0]
    const success = signupForm
    	.getElementsByClassName('success')[0]

	userPool.signUp(email, password, userAttributes, null, (err, result) => {
	    if (err) {
	    	success.innerHTML = ''
	    	errors.innerHTML = err
	        return
	    }

	    errors.innerHTML = ''
	    success.innerHTML = JSON.stringify(result, null, 2)
	})

	return false
}

signupForm.onsubmit = signup

// Registration Confirmation Form

const confirmRegistration = event => {
	event.preventDefault()

	if (!userPoolIsConfigured()) {
		userPoolWarning()
	}

	const email = confirmRegistrationForm['email'].value
	const code = confirmRegistrationForm['code'].value

	console.log(email)
	console.log(code)

    if (!cognitoUser) {
		const userData = {
	        Username : email,
	        Pool: userPool
	    }

		cognitoUser = new AWSCognito
			.CognitoIdentityServiceProvider
			.CognitoUser(userData)
    }

    const errors = confirmRegistrationForm
    	.getElementsByClassName('errors')[0]
    const success =confirmRegistrationForm
    	.getElementsByClassName('success')[0]

	cognitoUser.confirmRegistration(code, true, (err, result) => {
	    if (err) {
	    	success.innerHTML = ''
	    	errors.innerHTML = err
	        return
	    }

	    errors.innerHTML = ''
	    success.innerHTML = JSON.stringify(result, null, 2)
	})

	return false
}

confirmRegistrationForm.onsubmit = confirmRegistration

// Authenticate User (login)

const authenticateUser = event =>  {
	event.preventDefault()

	if (!userPoolIsConfigured()) {
		userPoolWarning()
	}

	const form = authenticateUserForm

	const email = form['email'].value
	const password = form['password'].value

	const identityPoolId = configForm['UserPoolId'].value
	const clientId = configForm['ClientId'].value

	console.log(email)
	console.log(password)

    const authenticationData = {
        Username : email,
        Password : password,
    }

    const authenticationDetails = new AWSCognito
		.CognitoIdentityServiceProvider
		.AuthenticationDetails(authenticationData)

    if (!cognitoUser) {
		const userData = {
	        Username : email,
	        Pool: userPool
	    }

		cognitoUser = new AWSCognito
			.CognitoIdentityServiceProvider
			.CognitoUser(userData)
    }

    const errors = form.getElementsByClassName('errors')[0]
    const success = form.getElementsByClassName('success')[0]

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: result => {

            success.innerHTML = ('access token + ' + result.getAccessToken().getJwtToken())

            // POTENTIAL: Region needs to be set if not already set previously elsewhere.
            // AWS.config.region = '<region>';

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: identityPoolId,
                Logins : {
                    'cognito-idp.us-east-1.amazonaws.com/us-east-1_gplidiDbz': result.getIdToken().getJwtToken()
                }
            })

            // Instantiate aws sdk service objects now that the credentials have been updated.
            // example: var s3 = new AWS.S3()
        },

        onFailure: err => {
            alert(err)
        }
    })
}

authenticateUserForm.onsubmit = authenticateUser

// Get user attributes

const getUserAttributes = event => {
	event.preventDefault()

	if (!userPoolIsConfigured()) {
		userPoolWarning()
	}
    if (!cognitoUser) {
    	alert('You need to Login or Register first!')
    }

    const form = getUserAttributesForm
    const errors = form.getElementsByClassName('errors')[0]
    const success = form.getElementsByClassName('success')[0]

    cognitoUser.getUserAttributes((err, result) => {
        if (err) {
            errors.innerHTML = err
            return
        }

        let html = ''
        for (i = 0; i < result.length; i++) {
        	html += 'attribute:' + result[i].getName() + ', value: ' + result[i].getValue()
        }

        success.innerHTML = result
    });
}

getUserAttributesForm.onsubmit = getUserAttributes
