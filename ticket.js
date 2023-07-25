// const API = 'https://lakeside-backend.herokuapp.com/api/';
const API = 'http://localhost:8080/api/';

$(document).ready(function() {
    obtenerTicket();
});
function obtenerTicket() {
    var urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    $.ajax({
        type:"GET",
        url: API + "venta/" + id,
        cache: false,
        success: function(r){
const date = new Date(r.createdAt);
            $('#fecha').append(
                date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear() 
            );
           $('#tbody').append(
               `                
            <tr>
                <td>${r.producto.nombre}</td>
                <td class="medio">x${r.cantidad}</td>
               <td class="derecha">$${r.precio}</td>
           </tr>`
           );
           if(r.chequeo) {
            $('#tbody').append(
                `                
             <tr>
                <td>Examen</td>
                <td class="medio">x1</td>
                <td class="derecha">$200</td>
            </tr>`
            );
           }
           $('#tbody').append(
               `
            <tr>
                <td>TOTAL</td>
                <td class="medio">${r.cantidad + 1}</td>
                <td class="derecha">$${r.monto}</td>
            </tr>`
            );
            $('#cajero').append(r.user.username)
            
        }, error: function(e) {
            
        }
      });

}