const API = 'https://lakeside-backend.herokuapp.com/api/';

function iniciarSesion (){
    var usuario = $("#login-name").val();
    var contrasena = $("#login-pass").val();
    var parametros = {
        "email":usuario,
        "password":contrasena,
        
    };
    $.ajax({
        data: parametros,
        type:"POST",
        url: API + "auth/signin",
        cache: false,
        success: function(response){
            console.log(response);
            localStorage.setItem('logged', 1);
            window.location.href = "/inventario.html";
            
        }, error: function(e) {
            Swal.fire(
                'Error!',
                'El usuario o contraseña es incorrecto',
                'error'
              )
        }
      });
}