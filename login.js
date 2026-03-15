const inputs = document.querySelectorAll(".code-inputs input");
const secretCodeHash = "MDMwNjI1"; 

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

  const codeHash = btoa(code); 

  if(codeHash === secretCodeHash){
    localStorage.setItem("isLoggedIn","true"); // login flag
    window.location.href = "home.html";
  } else {
    document.getElementById("error").textContent = "Wrong code 💔";
  }
}