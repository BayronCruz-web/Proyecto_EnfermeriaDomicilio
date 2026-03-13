function validarFormulario(){

    let nombre = document.getElementById("nombre").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let email = document.getElementById("email").value.trim();
    let mensaje = document.getElementById("mensaje").value.trim();
    let formMessage = document.getElementById("formMessage");

    if(nombre === "" || telefono === "" || email === "" || mensaje === ""){
        formMessage.style.color = "red";
        formMessage.textContent = "Por favor complete todos los campos.";
        return false;
    }

    formMessage.style.color = "green";
    formMessage.textContent = "Mensaje enviado correctamente.";

    return false; 
}