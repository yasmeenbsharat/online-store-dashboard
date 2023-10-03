const pageContent = document.getElementById("pageContent");
let currentProducts;
let paginationElement;
let currentPage = 1;
let categories;
let productsData = `<div class="input-group mb-3  ">
<button class="btn bg-success p-2 ms-auto me-3 text-light" type="button" id="button-addon2">Add Products</button></div>
<div class="Products row justify-content-center me-2 g-5">
<table class="table table-success  table-striped  ">
<thead>
<tr>
    <th scope="col">#</th>
    <th scope="col">Product Title</th>
    <th scope="col">Image</th>
    <th scope="col">Price</th>
    <th scope="col">Rating</th>
    <th scope="col">Stock</th>
    <th scope="col">Brand</th>
    <th scope="col">Category</th>	
    <th scope="col">Edit</th>
    <th scope="col">Delete</th>	
  </tr>
</thead>
<tbody id="ProductsOfCategory"></tbody>
<div class="pagination justify-content-center" id="pagination"></div>
</table></div>`;

async function getProductsOfCategory(index) {
  pageContent.innerHTML = productsData;
  let request;
  if (index == 'All') {
    request = await fetch('https://dummyjson.com/products');
  } else {
    let currentCategory = categories[index];
    request = await fetch(`https://dummyjson.com/products/category/${currentCategory}`);
  } let products = await request.json();
  currentProducts = products.products;
  displayProductsOfCategory();
}

function createPagesLinks(totalPages) {
  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.classList.add("page-link");
    pageLink.classList.add("bg-success");
    pageLink.classList.add("text-light");
    pageLink.textContent = i;
    pageLink.addEventListener('click', () => {
      currentPage = i;
      displayProductsOfCategory();
    });
    paginationElement.appendChild(pageLink);
  }
}



function displayProductsOfCategory() {
  paginationElement = document.getElementById("pagination");
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  let currentPageProducts = currentProducts.slice(startIndex, endIndex);
  displayPageContent(currentPageProducts);
  const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
  paginationElement.innerHTML = '';
  createPagesLinks(totalPages);
}


function displayPageContent(products) {
  const ProductsOfCategory = document.getElementById("ProductsOfCategory");
  let data = '';
  products.map((product) => {
    data += `<tr>
        <td class="p-3">${product.id}</td>
        <td class="py-3">${product.title}</td>
        <td class="img"><img src="${product.images[0]}" class="w-25" alt="popular4"></td>
        <td>${product.price}</td>
        <td>${product.rating}</td>
        <td>${product.stock}</td>
        <td>${product.brand}</td>  
        <td>${product.category}</td>
        <td> <button aria-label="edit" class="btn btn-outline-info text-center me-3 " onclick="editTask()">
        <i class="fas fa-pencil-alt m-auto"></i>
        </button>
        </td>
        <td><button aria-label="delete" class="btn btn-outline-danger text-center" onclick="deleteProduct(${product.id})">
        <i class="fas fa-trash-alt m-auto"></i>
        </button></td>
     </tr>
    ` });
  ProductsOfCategory.innerHTML = data;
}

async function deleteProduct(index) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const response = await fetch(`https://dummyjson.com/products/${index}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.id === index) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          );
        } else {
          Swal.fire(
            'Error',
            'Something went wrong!',
            'error');
        }
      }
    }
  });
}


async function getAllCarts() {
  const request = await fetch('https://dummyjson.com/carts');
  const carts = await request.json();
  displayCarts(carts.carts);
}


function displayCarts(carts) {
  let data = ``;
  carts.map((cart) => {
    data += ` <div class="mt-3 " id="carts-content">
                <div class="padding">
                    <div class="row  d-flex justify-content-center">      
            <div class="col-lg-8 ">
                          <div class="card bg-subtle border-2 border-success">
                            <div class="card-body 	table-success">
                              <h4 class="card-title d-inline-block w-75 text-success">Cart ${cart.id} </h4>                           
                              <span class="ms-auto d-inline-block text-uppercase">user id :${cart.userId} </span>
                              <hr  class="text-success">
                              <div class="card-description ">
                               <p class="fs-5"><span class="fs-5 fw-bolder text-success"> Total Price: </span>$ ${cart.total}</p>
                                <p class="fs-5"><span class="fs-5 fw-bolder text-success"> Total Discount:  </span>  ${cart.discountedTotal} $</p>  
                                <p class="fs-5"><span class="fs-5 fw-bolder text-success"> Total Products: </span>  ${cart.totalProducts} $ </p> 
                                <p class="fs-5"><span class="fs-5 fw-bolder text-success"> Total Quantity:  </span>  ${cart.totalQuantity} $</p> 
                              </div>
                           <div class="table-responsive">
                                <table class="table">
                                <hr  class="text-success">
                                  <thead>
                                    <tr class="text-success">
                                      <th class="px-0 mx-2">Title</th>
                                      <th class="px-0 mx-2">Price</th>
                                      <th class="px-0 mx-2">Quantity</th>
                                      <th class="px-0 mx-2">Discount Percentage</th>
                                      <th class="px-0 mx-2">Total</th>
                                      <th class="px-0 mx-2">Discounted Price</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                  ${cartTableContent(cart.products)}
                                  </tbody>
                                </table> 
                                </div>
                                <div class="card-footer text-end p-3">
                  <button id="deleteBtn" class="btn btn-danger text-center" >
                    Delete cart
                  </button> </div> </div> </div> </div></div> </div>  ` });
  pageContent.innerHTML = data;
}


function cartTableContent(products) {
  let data = '';
  products.map((product) => {
    data += `<tr>
        <td class="px-0 mx-2">${product.title}</td>
        <td  class="px-0 mx-2 text-center" >${product.price}</td>
        <td class="px-0 mx-2 text-center" >${product.quantity}</td>
        <td  class="px-0 mx-2 text-center" >${product.discountPercentage} % </td>  
        <td  class="px-0 mx-2 text-center">${product.total}</td>
        <td  class="px-0 mx-2 text-center">${product.discountedPrice}</td>`
  });
  return data;
}

async function getAllCategories() {
    const request = await fetch('https://dummyjson.com/products/categories');
   categories = await request.json();
    console.log(categories);
    displayCategories(categories);
}


function displayCategories(categories) {
    let result = '  <div class="row py-2 ">';
    categories.map((category, index) => {
        result += `
        <div class="col-md-4 my-2 ">
        <a href="#" class="btn btn-success btn-lg p-4  w-75 "aria-pressed="true"onclick="getProductsOfCategory(${index})">${category}</a>
        </div> 
     ` });
     result +=' </div> ';
     pageContent.innerHTML = result;
}
function initApp() {
  getProductsOfCategory('All');
}
initApp();