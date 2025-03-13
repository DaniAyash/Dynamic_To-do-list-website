const form = document.getElementById("form");
const firstname = document.getElementById("firstname-input"); // Only for signup
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const repeatpass = document.getElementById("repeatpass-input"); // Only for signup

form.addEventListener("submit", async (event) => {
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

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const errormessage = document.getElementById("error-message");

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log(result);

        if (result.error) {
            errormessage.innerText = result.error; // Show errors
        } else if (result.redirect) {
            window.location.href = result.redirect; // Redirect user
        }
    } catch (error) {
        console.error("Error:", error);
        errormessage.innerText = "An error occurred. Please try again.";
    }
});