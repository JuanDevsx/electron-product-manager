const {ipcRenderer} = require('electron');
    //    Variabbles
        const mainContent = document.querySelector('#main-content');
        const navProducts = document.querySelector("#nav-products");
        const navCategories = document.querySelector("#nav-categories");
        // Funciones de vista
        function showNewProductsViewForm(){
            mainContent.innerHTML=`
            <div class="d-flex justify-content-between align-items-center mb-4">      
                <h2>Products</h2>
                <button class="btn btn-primary mb-3">
                    New product
                    </button> 
                    </div>
                <div class="row" id="products"></div>
                `;        
        }
        showNewProductsViewForm()

        function getProductContainer(){
            return document.querySelector('#products');
        }

         // Tempt function categories
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
                container.innerHTML +=`
                <div class="card mb-2">
                    <div class="card-body">
                        <h5 class="m-0">
                        ${category.name}
                        </h5>
                    </div>
                </div>`
            });
                console.log(categories);
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
                <div class="card mb-2">
                    <div class="card-body">
                        <h4>Product</h4>
                        <h5 class"m-0">
                        ${product.name}
                        </h5>
                    </div>
                </div>    
                `
            });
        }

        function showNewCategoriesViewForm(){
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
                    ipcRenderer.send(
                        'category:open-window'
                    );
                });
            loadCategories();
        }
        function showProducts(){
            mainContent.innerHTML =`
            <div class="d-flex justify-content-between aling-items-center mb-4">
                <h2>Products</h2>
                <button id="btn-new-product" class="btn btn-primary mb-3">
                    New product
                </button>
            </div>
                <div id="products-container"></div>        
            `;
            document
            .querySelector('#btn-new-product')
            .addEventListener('click',()=>{
                ipcRederer.send(
                    'product:open-window'
                );
            });
            loadProducts();
        }
        // Eventos
        navProducts.addEventListener('click',(e)=>{
            e.preventDefault();
            //vista
            showNewProductsViewForm();
        });
        navCategories.addEventListener('click',(e)=>{
            e.preventDefault();
            showNewCategoriesViewForm();
        });

        ipcRenderer.on('product:new',(e, newProduct)=>{
            const newProductTemplate = `
            <div class="col-md-4">
                <div class="card h-100 shadow-lg border border-2">
                    <div class="card-header bg-white border-bottom border-2 border py-3 text-center">
                     <h5 class="card-title text-center m-0" style="text-transform:none;">
                        ${newProduct.name}
                        </h5>
                    </div>
                        <div class="card-header bg-white border-bottom border-2 border py-3 text-center">
                        ${newProduct.description}
                        </div> 
                            <div class="card-header bg-white border-bottom border-2 border py-3 text-center">
                                <h4 class="fw-bold text-center">
                        ${newProduct.price}
                                </h4>
                            </div> 
                            <div class="card-footer bg-white border-top border-2 border py-3 text-center">
                        <button class="btn btn-danger btn-sm px-4">
                            DELETE
                            </button>
                    </div>
                </div>    
            </div>        
            `;
            getProductsContainer().innerHTML+= newProductTemplate;
            const btns = document.querySelectorAll('.btn.btn-danger');
            btns.forEach(btn =>{
                btn.addEventListener('click', e =>{
                    e.target.parentElement.parentElement.parentElement.remove();
                });
            });
        });
        
        ipcRenderer.on("products:remove-all", (e) =>{
            console.log("Remove-all")
            products.innerHTML='';
        })
       
        