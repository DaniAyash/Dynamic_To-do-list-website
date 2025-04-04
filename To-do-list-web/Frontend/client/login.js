const form = document.getElementById("login-form");
const email = document.getElementById("email-input");
const password = document.getElementById("password-input");
const errormessage = document.getElementById("error-message"); // Now correctly defined

form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    errormessage.innerText = ""; // Clear previous errors

    if (email.value.trim() === "" || password.value.trim() === "") {
        errormessage.innerText = "Email and password are required";
        return;
    }

    const formData = {
        email: email.value.trim(),
        password: password.value.trim()
    };

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        console.log(result);

        if (result.error) {
            errormessage.innerText = result.error; // Show error message
        } else if (result.conn) {
            errormessage.innerHTML = `
            <p>${result.conn} <br> 
            <a href="#" onClick="manualLogout()">Click here to logout manually</a></p>
            </p>`;
        } else if (result.redirect) {
            window.location.href = result.redirect; // Redirect user to /todo
        }
        
    } catch (error) {
        console.error("Error:", error);
        errormessage.innerText = "An error occurred. Please try again.";
    }
});

async function manualLogout() {
    const emailInput = document.getElementById("email-input").value.trim();

    if (!emailInput) {
        alert("Please enter your email.");
        return;
    }

    const response = await fetch("/manualLogout", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }) // Pass the email
    });

    const data = await response.json();
    
    if (data.error) {
        alert(data.error);
    } else if (data.success) {
        alert(data.message);
        window.location.reload(); // Reload the page
    }
}
