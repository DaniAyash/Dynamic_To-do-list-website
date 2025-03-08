const form = document.getElementById("form");
const firstname = document.getElementById("firstname-input"); // Only for signup
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const repeatpass = document.getElementById("repeatpass-input"); // Only for signup
const errormessage = document.getElementById("error-message");

form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission
    let errors = [];

    if (firstname.value.trim() === "") {
        errors.push("Firstname is required");
    }
    if (email.value.trim() === "") {
        errors.push("Email is required");
    }
    if (password.value.trim() === "") {
        errors.push("Password is required");
    }
    if (repeatpass.value.trim() === "") {
        errors.push("Repeat password is required");
    }
    if (password.value !== repeatpass.value) {
        errors.push("Passwords do not match");
    }

    if (errors.length > 0) {
        errormessage.innerText = errors.join(". ");
        return; // Stop submission if there are errors
    }
});