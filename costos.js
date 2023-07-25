// const API = 'https://lakeside-backend.herokuapp.com/api/';
// const SERVER_UPLOADS = 'https://lakeside-backend.herokuapp.com/uploads/';

const API = 'http://localhost:8080/api/';
const SERVER_UPLOADS = 'http://localhost:8080/uploads/';

$(document).ready(function() {
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
if(user.roles[0] == 'ROLE_VENDEDOR') {
  window.location.href = 'venta.html';
}
   $('#username').text(user.username)
    crearTabla();
    // Swal.fire('Any fool can use a computer')
    $("input[data-type='currency']").on({
        keyup: function() {
          formatCurrency($(this));
        },
        blur: function() { 
          formatCurrency($(this), "blur");
        }
    });
    
    
    function formatNumber(n) {
      // format number 1000000 to 1,234,567
      return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    
    
    function formatCurrency(input, blur) {
      // appends $ to value, validates decimal side
      // and puts cursor back in right position.
      
      // get input value
      var input_val = input.val();
      
      // don't validate empty input
      if (input_val === "") { return; }
      
      // original length
      var original_len = input_val.length;
    
      // initial caret position 
      var caret_pos = input.prop("selectionStart");
        
      // check for decimal
      if (input_val.indexOf(".") >= 0) {
    
        // get position of first decimal
        // this prevents multiple decimals from
        // being entered
        var decimal_pos = input_val.indexOf(".");
    
        // split number by decimal point
        var left_side = input_val.substring(0, decimal_pos);
        var right_side = input_val.substring(decimal_pos);
    
        // add commas to left side of number
        left_side = formatNumber(left_side);
    
        // validate right side
        right_side = formatNumber(right_side);
        
        // On blur make sure 2 numbers after decimal
        if (blur === "blur") {
          right_side += "00";
        }
        
        // Limit decimal to only 2 digits
        right_side = right_side.substring(0, 2);
    
        // join number by .
        input_val = "$" + left_side + "." + right_side;
    
      } else {
        // no decimal entered
        // add commas to number
        // remove all non-digits
        input_val = formatNumber(input_val);
        input_val = "$" + input_val;
        
        // final formatting
        if (blur === "blur") {
          input_val += ".00";
        }
      }
      
      // send updated string to input
      input.val(input_val);
    
      // put caret back in the right position
      var updated_len = input_val.length;
      caret_pos = updated_len - original_len + caret_pos;
      input[0].setSelectionRange(caret_pos, caret_pos);
    }
} );


const FROM_PATTERN = 'YYYY-MM-DD HH:mm:ss.SSS';
const TO_PATTERN   = 'DD/MM/YYYY HH:mm';
function crearTabla(){
    var data = [];
    var tabla;
    $.ajax({
        type:"GET",
        url: API + "producto/",
        cache: false,
        success: function(response){
            data = response;
            console.log(response);
            // $('#example').DataTable().empty();
            tabla = $('#example').DataTable({
                data: data,
                responsive: true,
                resizable: true,
                dom: 'Bfrtip',
                fixedHeader: true,
                buttons: [
                    {
                        extend: 'csv',
                        text: 'Exportar a CSV'
                    },
                    {
                        extend: 'pdf',
                        text: 'Exportar a PDF'
                    }
                        ],
                columns: [
                             { data: 'id', visible: false},
                             { data: 'nombre', title: 'Nombre',  align: 'center', width: '20%' },
                             { data: 'marca', title: 'Marca', tmpl: '<div class="text-truncate" data-toggle="popover" data-placement="bottom" title="{EnfermedadesTratadas}">{EnfermedadesTratadas}</div>', align:'center', width:'6%'  },
                             { data: 'modelo', title: 'Modelo',  align: 'center', width: '20%' },
                             { data: 'stock', title: 'Stock',  align: 'center', width: '20%' },
                             { data: 'precio', title: 'Precio',  align: 'center', width: '20%' },

                            //  { data: 'createdAt', title: 'fecha', render: $.fn.dataTable.render.moment(FROM_PATTERN, TO_PATTERN)}
        
                         ],
                 createdRow: function (row, data, dataIndex) {
                                 var actions_buttons = '<td class="td-center"><div class="btn-toolbar" role="toolbar"><div class="btn-group" role="group">';
                                 actions_buttons += '<a class="btn btn-default btn-sm btn-ver" title="Eliminar"  onclick="eliminar( '+ data.id +')"><i class="far fa-trash-alt"></i></a>';
                                 actions_buttons += '<a class="btn btn-default btn-sm" title="Editar" onclick="edit( '+ data.id +')"><i class="fas fa-edit" style="color: black"></i></a>';
                                 actions_buttons += '</div></div></td>';
                                 $(row).append(actions_buttons);
                             },
                autoWidth: true,
                language: {url: "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json"}
              });
            
        }
      });
      console.log(data);

}
function eliminar(id){
    console.log(id);
    Swal.fire({
      title: 'Estas seguro?',
      text: "No habra vuelta atras!",
      icon: 'warning',
      showCancelButton: true,

      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      
      if (result.isConfirmed) {
        $.ajax({
      
          type:"DELETE",
          url: API + "producto/"+id,
          cache: false,
          success: function(response){
            
              console.log(response);
              Swal.fire(
                'Registro Borrado!',
                'Completado',
                'success'
              )
              $('#example').DataTable().clear().destroy();
              crearTabla();
              // window.location.reload();
              
          }
        });
        
      }
    })
    
    // $('#example').DataTable().clear().destroy();
    //         crearTabla();

}
function edit(id){
  console.log(id);
  
      $.ajax({
    
        type:"GET",
        url: API + "producto/"+id,
        cache: false,
        success: function(response){
            document.getElementById('imagen').style.display = 'block';

            console.log(response);
            $('#id').val(response.id);
            $('#exampleModal').modal('show');
            $("#nombre").val(response.nombre);
            $("#marca").val(response.marca);
            $("#modelo").val(response.modelo);
            $("#stock").val(response.stock);
            $("#currency-field").val(response.precio);
            $('#img-p').attr("src", SERVER_UPLOADS + response.foto);

            // Swal.fire(
            //   'Registro Borrado!',
            //   'Completado',
            //   'success'
            // )
            // $('#example').DataTable().clear().destroy();
            // crearTabla();
            
        }
      });
      
    }

    $("#surtido_id").on('change', function(val) {
      debugger
      if(val == 1 && val == 1) {
        suma += 1000;
      }
      if(val == 1 && val == 2) {
        suma += 42000;
      }
    });

function calcular(){
  var suma = 0;
  var costoServicio = 0;
  var ganancia = 0;
    var nombre = $("#nombre").val();
    var lugar = $("#lugar").val();
    var cuentaArmazon = $("#cuentaArmazon").val();
    var costo_armazon = $("#costo_armazon").val();
    var surtido_id = $("#surtido_id").val();
    var tipolente_id = $("#tipolente_id").val();
    var bisel_id = $("#bisel_id").val();
    var costo_servicio = $("#costo_servicio").val();
    var costo_interno = $("#costo_interno").val();
    var costo_publico = $("#costo_publico").val();
    var ganancia = $("#ganancia").val();
    

    if(surtido_id == 1 && tipolente_id == 1) {
      suma += 1000;
    }
    if(surtido_id == 1 && tipolente_id == 2) {
      suma += 42000;
    }


    switch(bisel_id) {
      case "1":
        costoServicio = 30;
        $("#costo_servicio").val(costoServicio);
        break;
      case "2":
        costoServicio = 60;
        $("#costo_servicio").val(costoServicio);
        break;
      case "3":
        costoServicio = 90;
        $("#costo_servicio").val(costoServicio);
        break;
    }


    // if(garantia) {
    //   ganancia = costo_publico - ((suma * 2) + costoServicio);
    //   $("#costo_interno").val((suma * 2) + costoServicio);
    // } else {
      ganancia = costo_publico - (suma + costoServicio);
      $("#costo_interno").val((suma + costoServicio));

      $("#ganancia").val(ganancia);
    // }


    console.log(ganancia);
    console.log(costoServicio);
    console.log(suma);




      // $.ajax({
      //   data: formData,
      //   type:"POST",
      //   url: API + "producto/",
      //   cache: false,
      //   success: function(response){
      //     console.log(response);
      //       $("#nombre").val("");
      //       $("#marca").val("");
      //       $("#modelo").val("");
      //       $("#stock").val("");
      //       $("#currency-field").val("");
      //       // alert("El registro fue guardado");
      //       // $('#example').DataTable().clear().destroy();
      //       // crearTabla();
      //       // window.location.reload();
            
      //   }
      // });
    //   fetch(API + "producto", {method: "POST", body: formData}).then(r => {
    //     console.log(r);
    //     $("#nombre").val("");
    //         $("#marca").val("");
    //         $("#modelo").val("");
    //         $("#stock").val("");
    //         $("#currency-field").val("");
    //         // alert("El registro fue guardado");
    //         $('#example').DataTable().clear().destroy();
    //         crearTabla();
    //   });

    // } else {
    //   // $.ajax({
    //   //   data: parametros,
    //   //   type:"PUT",
    //   //   url: API + "producto/"+id,
    //   //   cache: false,
    //   //   success: function(response){
    //   //       $("#nombre").val("");
    //   //       $("#marca").val("");
    //   //       $("#modelo").val("");
    //   //       $("#stock").val("");
    //   //       $("#currency-field").val("");
    //   //       // alert("El registro fue exitoso");
    //   //       $('#example').DataTable().clear().destroy();
    //   //       crearTabla();
    //   //       $('#exampleModal').modal('hide');
    //   //       // window.location.reload();
            
    //   //   }, error:function(XMLHttpRequest, textStatus, errorThrown) { 
    //   //     alert("Status: " + textStatus); alert("Error: " + errorThrown); 
    //   // }
    //   // });
    //   fetch(API + "producto/" + id, {method: "PUT", body: formData}).then(r => {
    //     console.log(r);
    //     $("#nombre").val("");
    //         $("#marca").val("");
    //         $("#modelo").val("");
    //         $("#stock").val("");
    //         $("#currency-field").val("");
    //         // alert("El registro fue guardado");
    //         $('#example').DataTable().clear().destroy();
    //         $('#exampleModal').modal('toggle');
    //         crearTabla();
    //   });
    // }
    console.log();
    
}
function abrirModal(){
  $('#id').val('');
  $("#nombre").val("");
            $("#marca").val("");
            $("#modelo").val("");
            $("#stock").val("");
            $("#currency-field").val("");
            $('#exampleModal').modal('toggle');
}
function logout() {
  localStorage.clear();
  window.location = '/';
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};