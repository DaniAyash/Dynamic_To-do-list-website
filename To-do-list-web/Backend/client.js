const form = document.getElementById("form");
const firstname = document.getElementById("firstname-input"); // Only for signup
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const repeatpass = document.getElementById("repeatpass-input"); // Only for signup
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
    
    let endpoint = ""; // Define the API endpoint

    if (window.location.pathname.includes("signup")) {
        // If user is on signup page
        if (!data.firstname || !data.email || !data.password || !data.repeatpass) {
            errormessage.innerText = "All fields are required";
            return;
        }
        if (data.password !== data.repeatpass) {
            errormessage.innerText = "Passwords do not match";
            return;
        }
        endpoint = "/signup"; // Use signup API
    } else {
        // If user is on login page
        if (!data.email || !data.password) {
            errormessage.innerText = "Email and password are required";
            return;
        }
        endpoint = "/login"; // Use login API
    }

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

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