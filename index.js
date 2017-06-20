const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool

let userPool

const setupUserPool = () => {
	const poolData = {
	    UserPoolId: configForm['UserPoolId'].value,
	    ClientId: configForm['ClientId'].value
	}

	userPool = new AWSCognito
		.CognitoIdentityServiceProvider
		.CognitoUserPool(poolData)
}


const userAttribute = AWSCognito
	.CognitoIdentityServiceProvider
	.CognitoUserAttribute

const signup = event => {
	event.preventDefault()

	if (!userPool) {
		setupUserPool()
	}

	const userAttributes = [
		new userAttribute({
		    Name: 'name',
		    Value: signupForm['name'].value
		}),

		new userAttribute({
		    Name: 'password',
		    Value: signupForm['password'].value
		}),

		new userAttribute({
		    Name: 'email',
		    Value: signupForm['email'].value
		}),

		new userAttribute({
		    Name: 'phone_number',
		    Value: signupForm['phone_number'].value
		}),

		new userAttribute({
		    Name: 'gender',
		    Value: signupForm['gender'].value
		}),

		new userAttribute({
		    Name: 'birthdate',
		    Value: signupForm['birthdate'].value
		})
	]

	userPool.signUp('username', 'password', userAttributes, null, (err, result) => {
	    if (err) {
	        signupForm
	        	.getElementsByClassName('errors')[0]
	        	.innerHTML = err
	        return
	    }

	    cognitoUser = result.user

	    console.log(result)

	    console.log('user name is ' + cognitoUser.getUsername())
	})

	return false
}

signupForm.onsubmit = signup
