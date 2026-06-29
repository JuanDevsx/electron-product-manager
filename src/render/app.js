const {ipcRenderer} = require('electron');
const { getCategories } = require('../database/database');
    //    Variabbles
        const mainContent = document.querySelector('#main-content');
        const navProducts = document.querySelector("#nav-products");
        const navCategories = document.querySelector("#nav-categories");
        let productId = null;
        let categoryId = null;

        function getProductContainer(){
            return document.querySelector('#products');
        }

         // Tempt function listing categories
        async function loadCategories(){
            const categories=
                await ipcRenderer.invoke(
                    'categories:get-all'
                );

            const container =
                document.querySelector(
                    '#categories-container'
                );
            container.innerHTML ='';
            
            categories.forEach(category=>{
           container.innerHTML += `
    <div class="card mb-2 mx-auto" style="width: 22rem;">
        <div class="card-body text-center">

            <h5 class="fw-bolder">${category.name}</h5>

            <button 
                class="btn-delete-category btn btn-outline-danger mt-3"
                data-id="${category.id}">
                Delete
            </button>

        </div>
    </div>
`;
            });
            document
            .querySelectorAll('.btn-delete-category')
            .forEach(button=>{
                button.addEventListener('click',(e)=>{
                    categoryId = e.target.dataset.id;

                    openDeleteCategoryModal();
                });
            });
                
        }
        
        async function loadProducts(){
            const products=
            await ipcRenderer.invoke(
                'products:get-all'
            );
        const container = 
                document.querySelector(
                "#products-container"
            );
        container.innerHTML ='';

        products.forEach(product=>{
                container.innerHTML +=`
            
            <div class="card mb-2 mx-auto" style="width: 22rem;">
                <div class="card-body text-center">

                <h5 class="fw-bolder">${product.name}</h5>

                <div class="fw-bold">Description:</div>
                <div>${product.description}</div>

                <div class="fw-bold mt-2">Price:</div>
                <div>${product.price}</div>

                <div class="fw-bold mt-2">Stock:</div>
                <div>${product.stock}</div>

                <div class="fw-bold mt-2">Category:</div>
                <div>${product.category_name}</div>

                <button 
                    class="btn-delete-product btn btn-outline-danger mt-3"
                    data-id="${product.id}">
                    Delete
                </button>

                </div>
            </div>        
                `;
                
            });
            
             document
            .querySelectorAll('.btn-delete-product')
            .forEach( button=>{
                button.addEventListener('click',(e)=>{
                    productId = e.target.dataset.id;

                    openDeleteProductModal();
                });
            
             });
        }

        //Funcion vista categorias
        function showCategoriesView(){
            mainContent.innerHTML =`
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Categories</h2>
                <button id="btn-new-category" class="btn btn-primary mb-3">
                    New category
                </button>
            </div>   
                <div id="categories-container"></div>
            `;
            document
                .querySelector('#btn-new-category')
                .addEventListener('click',()=>{
                    openCategoriesModal();
                });
            loadCategories();
        }
        
        function openCategoriesModal(){
           const modalElement = document.querySelector("#categoryModal")
           
           const modal = new bootstrap.Modal(modalElement);

           modal.show();
        }

        function openProductModal(){
            loadCategoriesForProduct()
            const modalElement = document.querySelector('#productModal')
            
            const modal = new bootstrap.Modal(modalElement);
            
            modal.show();
        }

        function openDeleteProductModal(){
            const modalElement = document.querySelector('#deleteProductModal')

            const modal = new bootstrap.Modal(modalElement);

            modal.show();   
        }

        function openDeleteCategoryModal(){
            const modalElement = document.querySelector('#deleteCategoryModal')

            const modal = new bootstrap.Modal(modalElement);

            modal.show();
        } 

         //Carga de categorias para productos
        async function loadCategoriesForProduct(){
            const categories = await ipcRenderer.invoke(
                'categories:get-all'
            );
            const selectCategory = document.querySelector(
                '#product-category'
            );
            selectCategory.innerHTML = 
            `<option value="">
                Selected category
                </option>
            `;

            categories.forEach(category=>{
                selectCategory.innerHTML +=`
                <option value="${category.id}">
                ${category.name}
                </option>
                `;
            });
            console.log(categories)
        }

         // Funcion de vista principal (productos)
        function showProductsView(){
            mainContent.innerHTML=`
            <div class="d-flex justify-content-between align-items-center mb-4">      
                <h2>Products</h2>
                <button id="btn-new-product" class="btn btn-primary mb-3">
                    New product
                    </button> 
                    </div>
                <div class="row" id="products-container"></div>
                `;
                 document
                 .querySelector('#btn-new-product')
                 .addEventListener('click',()=>{
                    openProductModal()
                 })
                loadProducts()
        }

        function showToast(message){
            console.log('Toast:', message)
            const toastElement = document.querySelector('#appToast');
            const toastMessage = document.querySelector('#toast-message');

            toastMessage.textContent = message;

            const toast = new bootstrap.Toast(toastElement);

            toast.show();
        }
        // Eventos click
        navProducts.addEventListener('click',(e)=>{
            e.preventDefault();
            //vista
            showProductsView();
        });
        navCategories.addEventListener('click',(e)=>{
            e.preventDefault();
            showCategoriesView();
        });
        
        // Eventos envio modal
        const categoryForm = document.querySelector('#category-form');
        categoryForm.addEventListener('submit',(e)=>{
            e.preventDefault();
            const categoryName = document.querySelector('#category-name').value;
                if(categoryName.trim()===''){
                    showToast('category must not be empty');
                    return;
                }    

                ipcRenderer.send('category:new', categoryName)

        });

      

        const deleteProduct = document.querySelector('#confirm-delete-product');
        deleteProduct.addEventListener('click',()=>{
                ipcRenderer.send('product:delete',productId)
        });

        const deleteCategory = document.querySelector('#confirm-delete-category');
        deleteCategory.addEventListener('click',()=>{
            ipcRenderer.send('category:delete',categoryId)
            
        });
        
        const productForm = document.querySelector('#product-form');
        productForm.addEventListener('submit',(e)=>{
            e.preventDefault();
            const productName = document.querySelector('#product-name').value;
            const productDescription = document.querySelector('#product-description').value;
            const productPrice = document.querySelector('#product-price').value;
            const productStock = document.querySelector('#product-stock').value;
            const productCategory = document.querySelector('#product-category').value;

            const product ={
                productName,
                productDescription,
                productPrice,
                productStock,
                productCategory
            };
            const hasEmptyField = Object.values(product).some(value => 
                String(value).trim()===''
            );
            if (hasEmptyField){
                showToast('All fields are required');
                return;
            }
                
            ipcRenderer.send('product:new', productName, productDescription, productPrice, productStock, productCategory)
            

        })
        
        ipcRenderer.on('category:created',(e, result)=>{
            const modalElement = document.querySelector('#categoryModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if(result.code==="CATEGORY_CREATED"){
                modal.hide();
                showToast("Category was created successfully");
                document.querySelector('#category-name').value='';
                loadCategories();
                return;
            }
           
        })

        ipcRenderer.on('product:created',(e, result)=>{
            const modalElement= document.querySelector('#productModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if(result.code==="PRODUCT_CREATED"){
            modal.hide();
            showToast("Product was created successfully");
            document.querySelector('#product-name').value='';
            document.querySelector('#product-description').value='';
            document.querySelector('#product-price').value='';
            document.querySelector('#product-stock').value='';
            document.querySelector('#product-category').value='';
            loadProducts();
            return;
            }
           
        })

        ipcRenderer.on('product:deleted',(e, result)=>{
            const modalElement = document.querySelector('#deleteProductModal')
            const modal = bootstrap.Modal.getInstance(modalElement);
            if(result.code==="PRODUCT_DELETED"){
            modal.hide();
            showToast("Product deleted succsesfully");
            loadProducts();
            return;
            }
        })

        ipcRenderer.on('category:deleted',(e, result)=>{
            const modalElement= document.querySelector('#deleteCategoryModal')
            const modal = bootstrap.Modal.getInstance(modalElement);

            if(result.code ==="CATEGORY_IN_USE"){
             modal.hide();   
             showToast("This category has associated products ⚠️.")
                return;
            }
            if(result.code ==="CATEGORY_DELETED"){
                modal.hide();
                loadCategories();
                showToast("Category deleted successfully.");
                return;
            }

        });


