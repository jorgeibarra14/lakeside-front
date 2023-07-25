// const API = 'https://lakeside-backend.herokuapp.com/api/';
const API = 'http://localhost:8080/api/';

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
        beforeSend: function(e) {
            let timerInterval
            Swal.fire({
            title: 'Cargando',
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading()
            },
            willClose: () => {
                clearInterval(timerInterval)
            }
            }).then((result) => {
            
            })

        },
        success: function(response){
            console.log(response);
            localStorage.setItem('user', JSON.stringify(response));
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