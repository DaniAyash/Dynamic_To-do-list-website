// Function to get cookies
function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
            return value;
        }
    }
    return null;
}

// Get the username from the cookie
const username = getCookie("username");

// Display the username in the to-do page
if (username) {
    document.getElementById("todo-header").innerText = `This is ${username}'s to-do list`;
} else {
    document.getElementById("todo-header").innerText = "To-Do List";
}
