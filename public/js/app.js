$(function(){

    $('.remover').click(function(e) {
        e.preventDefault();

        let id = $(this).data('id');
        let name = $(this).data('name');

        // alert(`ID: ${id}, Produto: ${name}`);
        Swal.fire({
            title: `Deseja excluir o produto ${name}?`,
            text: "Ao excluir o produto, está ação não poderá ser desfeita!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`/produtos/${id}/remover`, { 
                        method: 'POST', 
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        // return Swal.showValidationMessage(`
                        // ${JSON.stringify(await response.json())}
                        // `);
                    }

                    Swal.fire({
                        title: "Excluido!",
                        text: `O produto ${name} foi excluido`,
                        icon: "success",
                        timer: "5000",
                        willClose: () => {
                            location.reload();
                          }
                    });
                } catch (error) {
                    console.log(error);
                    // Swal.showValidationMessage(`
                    //     Request failed: ${error}
                    // `);
                }
            }
        });
    });

    $(".form-control").focus(function() {
        $(this).removeClass("is-invalid");

        $(this).closest('.form-group').find('.invalid-feedback').attr('style', 'display: none !important');
    });
});

//     $('.remove').click(function() {



//         let id = $(this).data('id');
//         let name = $(this).data('name');
        



//         // Swal.fire({
//         //     title: "Are you sure?",
//         //     text: "You won't be able to revert this!",
//         //     icon: "warning",
//         //     showCancelButton: true,
//         //     confirmButtonColor: "#3085d6",
//         //     cancelButtonColor: "#d33",
//         //     confirmButtonText: "Yes, delete it!"
//         // }).then(async (result) => {

//         //     if (result.isConfirmed) {


//         //         try {
                    
//         //             const response = await fetch('/produto/1/excluir', { 
//         //                 method: 'POST', 
//         //                 headers: {
//         //                     'Content-Type': 'application/json'
//         //                 }
//         //             });
//         //             if (!response.ok) return Swal.showValidationMessage(`
//         //                 ${JSON.stringify(await response.json())}
//         //               `);
//         //             return response.json();
//         //           } catch (error) {
//         //             Swal.showValidationMessage(`
//         //               Request failed: ${error}
//         //             `);
//         //           }
                
//         //         Swal.fire({
//         //             title: "Deleted!",
//         //             text: "Your file has been deleted.",
//         //             icon: "success"
//         //          });
        
//         //     }
//         // });



//     });

// });