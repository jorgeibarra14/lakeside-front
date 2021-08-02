const API = 'https://lakeside-backend.herokuapp.com/api/';
$(document).ready(function() {
  const isLoggedIn = localStorage.getItem('logged');
  if(isLoggedIn != 1) {
    window.location.href = '/';
  } 
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

                             { data: 'createdAt', title: 'fecha', tmpl: '<div class="text-truncate" data-toggle="popover" data-placement="bottom" title="{createdAt}">{createdAt}</div>',type: 'date',format: 'mm/dd/yyyy', align:'center', width:'100%' }
        
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
          
            console.log(response);
            $('#id').val(response.id);
            $('#exampleModal').modal('show');
            $("#nombre").val(response.nombre);
            $("#marca").val(response.marca);
            $("#modelo").val(response.modelo);
            $("#stock").val(response.stock);
            $("#currency-field").val(response.precio);
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
 
function guardar(){
    var nombre = $("#nombre").val();
    var marca = $("#marca").val();
    var modelo = $("#modelo").val();
    var stock = $("#stock").val();
    var precio = $("#currency-field").val();
    var status = 1;
    var precio2 = precio.replace("$","");
    var precio3 = precio2.replace(",","");
    var id = $('#id').val();
    
    var parametros = {
        "nombre":nombre,
        "marca":marca,
        "modelo":modelo,
        "stock":stock,
        "precio":precio3,
        "status":status
    };
    console.log(id);
    if (id == '' ){

      $.ajax({
        data: parametros,
        type:"POST",
        url: API + "producto/",
        cache: false,
        success: function(response){
            $("#nombre").val("");
            $("#marca").val("");
            $("#modelo").val("");
            $("#stock").val("");
            $("#currency-field").val("");
            alert("El registro fue guardado");
            $('#example').DataTable().clear().destroy();
            crearTabla();
            // window.location.reload();
            
        }
      });
    } else {
      $.ajax({
        data: parametros,
        type:"PUT",
        url: API + "producto/"+id,
        cache: false,
        success: function(response){
            $("#nombre").val("");
            $("#marca").val("");
            $("#modelo").val("");
            $("#stock").val("");
            $("#currency-field").val("");
            // alert("El registro fue exitoso");
            $('#example').DataTable().clear().destroy();
            crearTabla();
            $('#exampleModal').modal('hide');
            // window.location.reload();
            
        }, error:function(XMLHttpRequest, textStatus, errorThrown) { 
          alert("Status: " + textStatus); alert("Error: " + errorThrown); 
      }
      });
    }
    
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
