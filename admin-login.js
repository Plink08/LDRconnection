const inputs = document.querySelectorAll(".code-inputs input");
const secretCode = "pookie"; // Je eigen admin code

inputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    if(input.value.length === 1 && index < inputs.length - 1){
      inputs[index + 1].focus();
    }
  });
  input.addEventListener("keydown", (e) => {
    if(e.key === "Backspace" && input.value === "" && index > 0){
      inputs[index - 1].focus();
    }
  });
});

function checkCode(){
  let code = "";
  inputs.forEach(input => { code += input.value; });

  if(code === secretCode){
    // Zet flag in localStorage
    localStorage.setItem("isAdmin", "true");
    window.location.href = "admin-dashboard.html";
  } else {
    document.getElementById("error").textContent = "Wrong code 💔";
  }
}

