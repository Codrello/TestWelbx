$(document).ready(function () {
    // ==== SETTINGS ELEMENTS  START ==== //
    const Styling = () => {
        $("input").on("blur", (e) => {
            // console.log($(e.target))
            if($(e.target).val() != ""){
                $(e.target).next().addClass("positionOninput")
            }else{
                $(e.target).next().removeClass("positionOninput")
            }
        })

        $("input").on("click", (e) => {
            // console.log($(e.target))
            $(e.target).next().removeClass("positionOninput")
        })
    }
    // ==== SETTINGS ELEMENTS END ==== //

    // ==== EDITING PRODUCTS START ==== //
    const EditProduct = () => {
       const btnEdit = $(".EditProd") 
       const FormBtn = $("#EditPR") 
       
       
       
       btnEdit.on("click", (e) => {
            const parent = $(e.target).closest("button")
            console.log($(e.target))
            console.log($(parent).attr("prodid"))
            FormBtn.attr("prodID",`${$(parent).attr("prodid")}`)
        })

        FormBtn.on("click", () => {
            const EditNameProd = $(".EditNameProd") 
            const EditNameDescrProd = $(".EditNameDescrProd") 
            const EditFile = $(".EditFile") 
            // console.log(EditFile[0].files[0])
            let formData = new FormData();
            formData.append("File", EditFile[0].files[0])
            for (var key of formData.entries()) {
                console.log(key[0] + ', ' + key[1]);
                console.log(key)
              }
            axios.put(`/users/EditArt/${$(FormBtn).attr("prodID")}/${EditNameProd.val()}/${EditNameDescrProd.val()}`,formData,{
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(data => {
                console.log(data)
                window.location = "/users/profile"
            })
            .catch(err => {
                console.log(err)
            })
        })
    }
    // ==== EDITING PRODUCTS END ==== //

    // ==== DELETING PRODUCTS START ==== //
    const DeleteProduct = () => {
       const btnDel = $(".DelProd") 
       
       
       
       btnDel.on("click", (e) => {
            const parent = $(e.target).closest(".DelProd")
            console.log($(e.target))
            console.log($(parent).attr("prodid"))
            axios.delete(`/users/DeleteArt/${$(parent).attr("prodid")}`)
            .then(data => {
                console.log(data)
                window.location = "/users/profile"
            })
            .catch(err => {
                console.log(err)
            })
        })
    }
    // ==== DELETING PRODUCTS END ==== //

    // ==== ALL FUNCTIONS START ==== //
    Styling()
    EditProduct()
    DeleteProduct()
    // ==== ALL FUNCTIONS END ==== //
});