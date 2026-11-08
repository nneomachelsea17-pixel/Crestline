
// PASSWORD SHOW AND HIDE

document.querySelectorAll(".eye").forEach(button => {
    button.addEventListener("click", () => {

        const password = button.parentElement.querySelector("input");

        if (password.type === "password") {
            password.type = "text";
            button.textContent = "Hide";
        } else {
            password.type = "password";
            button.textContent = "Show";
        }

    });
});
