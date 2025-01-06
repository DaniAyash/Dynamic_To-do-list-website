const form = document.getElementById("form");
const firstname = document.getElementById("firstname-input");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const repeatpass = document.getElementById("repeatpass-input");
const errormessage = document.getElementById("error-message")

form.addEventListener('submit', (event) => {
    // event.preventDefault 
    let errors = []

    if(firstname.value === ''){
        errors.push('Firstname is required');
    }
    if(email.value === ''){
        errors.push('Email is required');
    }
    if(password.value === ''){
        errors.push('Password is required');
    }
    if(errors.length > 0){
        event.preventDefault();
        errormessage.innerText = errors.join(". ");
    }
});
