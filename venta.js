const API = 'https://lakeside-backend.herokuapp.com/api/';
const SERVER_UPLOADS = 'https://lakeside-backend.herokuapp.com/uploads/';
// const API = 'http://localhost:8080/api/';
// const SERVER_UPLOADS = 'http://localhost:8080/uploads/';

$( function() {
    const isLoggedIn = localStorage.getItem('logged');
    const user = JSON.parse(localStorage.getItem('user'));
    if(user.roles[0] != 'ROLE_VENDEDOR') {
        document.getElementById('inventario').style.display = 'block';
    
      }
    if(user != null && user != undefined) {
        const sesion =  parseJwt(user.accessToken); 
    
        if (sesion && Date.now() >= sesion.exp * 1000) {
          window.location.href = '/';
        }
    } else {
        window.location.href = '/';

    }

    
    $('#username').text(user.username)
    obtenerProductos();
    $('#productos').append('<img src="assets/img/logo1.png" style="width: 80%; margin-left: 10%" alt="">');
    
} );
function logout() {
    localStorage.clear();
    window.location = '/';
}
function obtenerProductos() {
    let prods;
    let arrayProds = [];
    $.ajax({
      
        type:"GET",
        url: API + "producto",
        cache: false,
        success: function(response){

            prods = response;
            $.each( prods, function( index, value ){
                console.log(value.nombre);
                arrayProds.push(value.nombre);
            });           
        }
      });

      $( "#buscador" ).autocomplete({
        source: arrayProds
    });
      
}
function limpiar() {
    $('#productos').empty();
    $('#productos').append('<img src="assets/img/logo1.png" style="width: 80%; margin-left: 10%" alt="">');

}
function comprar(id, precio) {
    console.log(id);
    const user = JSON.parse(localStorage.getItem('user'));
    $('#exampleModal').modal('toggle');
    $('#productoId').val(id);
    $('#userId').val(user.id);
    $('#precio').val(precio);

}
function setTotal() {
    var cantidad = $('#cantidad').val();
    var precio = $('#precio').val();
    var chequeo = $('#chequeo:checked').length > 0;

    let total = cantidad * precio;
    if(chequeo) {
        total += 200;
    }
    $('#total-a-pagar').val(total);


}
function vender() {
    Swal.fire({
        title: 'Está seguro de vender el producto?',
        text: "No se podrá devolver el producto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, vender!'
      }).then((result) => {
        if (result.isConfirmed) {
            var productoId = $('#productoId').val();

            $.ajax({
              
                type:"GET",
                url: API + "producto/"+productoId,
                cache: false,
                success: function(r){
                  
               var userId = $('#userId').val();
               var cliente = $('#nombre').val();
               var cantidad = $('#cantidad').val();
               var chequeo = $('#chequeo:checked').length > 0;
        
               var total = 0;
        
        
               if(r.stock < cantidad) {
                    Swal.fire(
                      'Error!',
                      'La cantidad requerida es mayor que el stock actual.',
                      'error'
                    )
               } else {
                total += cantidad * r.precio;
                
                if(chequeo) {
                    
                        total += 200;
                }
                let params = {
                productoId,userId, cliente, cantidad, monto: total, stock: r.stock, cantidad, precio: r.precio, chequeo
                };
                $('#total-a-pagar').append(total);
                $.ajax({
              
                    type:"POST",
                    url: API + "venta",
                    data: params,
                    cache: false,
                    success: function(r){
                        $('#exampleModal').modal('toggle');
                        Swal.fire({
                            title: 'Éxito?',
                            text: "Se ha realizado la venta!",
                            icon: 'success',
                            showCancelButton: false,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Continuar'
                          }).then((result) => {
                            if (result.isConfirmed) {
                                window.location = 'ticket.html?id='+ r.id;
                            }
                          })
                    }
                  
                    });
                    
                }
            }
              });
        }
      })


}
function buscar() {
    let valor = $('#buscador').val();
    $.ajax({
      
        type:"GET",
        url: API + "producto/search/"+ valor,
        cache: false,
        success: function(response){

            prods = response;
            $('#productos').empty();
            $.each( prods, function( index, value ){
                $('#productos').append(
                    `<div class="col-md-4 contenedor-prod" onclick="comprar(${value.id}, ${value.precio})">
                    <div class="bbb_deals">
                    <div class="bbb_deals_title">${value.nombre}</div>
                        <div class="bbb_deals_slider_container">
                            <div class=" bbb_deals_item">
                                <div class="bbb_deals_image"><img src="${SERVER_UPLOADS + value.foto}" alt=""></div>
                                <div class="bbb_deals_content">
                                    <div class="bbb_deals_info_line d-flex flex-row justify-content-start">
                                        <div class="bbb_deals_item_category"><a href="#" class="modelo">${value.modelo}</a></div>
                                    </div>
                                    <div class="bbb_deals_info_line d-flex flex-row justify-content-start">
                                        <div class="bbb_deals_item_name">$ ${value.precio}</div>
                                    </div>
                                    <div class="available">
                                        <div class="available_line d-flex flex-row justify-content-start">
                                            <div class="available_title">Disponibles: <span>${value.stock}</span></div>
                                            <div class="sold_stars ml-auto"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> </div>
                                        </div>
                                        <div class="available_bar"><span style="width:17%"></span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
                );
            });           
        }
      });
}
function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  };