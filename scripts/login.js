const form = document.getElementById("form");
const inputs = form.querySelectorAll(".input-field");
const progressFill = document.querySelector(".progress-fill");
const progressText = document.querySelector(".progress-fill-text");

function updateButtonProgress() {
    let filled = 0;
    inputs.forEach(input => {
        if (input.value.trim() !== "") {
            filled++;
        }
    });
    const percentage = (filled / inputs.length) * 100;
    progressFill.style.width = percentage + "%";
    progressText.style.width = percentage + "%";
    if (percentage >= 100) {
        progressFill.classList.add("complete");
        console.log("complete")
    }else {
        progressFill.classList.remove("complete");
        console.log("incomplete")
        console.log(percentage)
    }
}


inputs.forEach(input => {
    input.addEventListener("input", updateButtonProgress);
});

function toggleSenha() {
    const input = document.getElementById("senha");
    input.type = input.type === "password" ? "text" : "password";
    const visible = document.querySelector(".visible");
    const invisible = document.querySelector(".invisible");
    console.log(`1: ${visible}\n2: ${invisible}`);
    if (input.type === "text") {
        visible.style.display = "block";
        invisible.style.display = "none";
    } else {
        visible.style.display = "none";
        invisible.style.display = "block";
    }
}