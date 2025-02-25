const form = document.getElementById("form");
const firstname = document.getElementById("firstname-input");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const repeatpass = document.getElementById("repeatpass-input");
const errormessage = document.getElementById("error-message");

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

    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data),
        });
    
        const result = await response.json();
    
        if (result.missingFields) {
            errormessage.innerText = result.missingFields; // Display missing fields error 
        } else if (result.redirect) {
            window.location.href = result.redirect; // Redirect to login page ("/")
        }
    } catch (error) {
        console.error("Signup error:", error);
        errormessage.innerText = "An error occurred. Please try again.";
    }    
});
