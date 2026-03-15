const inputs = document.querySelectorAll(".code-inputs input");
const secretCodeHash = "cG9va2ll"; 

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

  // Versleut de input dezelfde manier als de hash
  const codeHash = btoa(code); 

  if(codeHash === secretCodeHash){
    localStorage.setItem("isAdmin","true"); // login flag
    window.location.href = "admin-dashboard.html";
  } else {
    document.getElementById("error").textContent = "Wrong code 💔";
  }
}

function homer(){
    window.location.href = "index.html";
}