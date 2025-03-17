const form = document.getElementById("signup-form");
const username = document.getElementById("firstname-input");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const repeatpassword = document.getElementById("repeatpass-input");
const errormessage = document.getElementById("error-message"); // Now correctly defined

form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    errormessage.innerText = ""; // Clear previous errors

    if (email.value.trim() === "" || password.value.trim() === "") {
        errormessage.innerText = "Email and password are required";
        return;
    }
    if (password.value.trim() !== repeatpassword.value.trim()) {
        errormessage.innerText = "Passwords do not match";
        return;
    }

    const formData = {
        username: username.value.trim(),
        email: email.value.trim(),
        password: password.value.trim()
    };

    try {
        const response = await fetch("/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        console.log(result);

        if (result.error) {
            errormessage.innerText = result.error; // Show error message
        } else if (result.redirect) {
            window.location.href = result.redirect; // Redirect user to /todo
        }
    } catch (error) {
        console.error("Error:", error);
        errormessage.innerText = "An error occurred. Please try again.";
    }
});
