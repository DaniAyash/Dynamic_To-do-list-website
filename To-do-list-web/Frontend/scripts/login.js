document.addEventListener("DOMContentLoaded", function () {
    // Check if logout flag is set
    if (localStorage.getItem("clearLoginFields") === "true") {
        // Clear the input fields
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";

        // Remove the flag so it doesn't clear every time
        localStorage.removeItem("clearLoginFields");
    }
});