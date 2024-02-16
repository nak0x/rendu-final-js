document.addEventListener("DOMContentLoaded", async ()=>{
  loadPageContent()
  document.getElementById("search-form").addEventListener("submit", searchProduct)
})

async function searchProduct(e){
  e.preventDefault();

  const query = document.getElementById("searchbar").value;

  const result = await fetchUri(`https://dummyjson.com/products/search?q=${query}`, "GET");

  renderProductList(result.products)

}

function renderProductList(products){
  const productContainer = document.getElementById("products-container");

  productContainer.innerHTML = "";
  
  products.forEach(product => {
    /* Render product */

    let productHtml = `
      <div class="product" id="product-${product.id}">
        <div class="thumb-container">
          <img src="${ product.thumbnail }" alt="" id="product-thumb-${product.id}">
        </div>
        <div class="images-list-container">`

    product.images.forEach((img, index) =>{
      productHtml += `<img src="${img}" alt="" onclick="switchProductThumb(${index}, ${product.id})">`
    })

    productHtml += `</div>
        <div class="infos-container">
          <h4 class="product-title">${product.title}</h4>
          <p class="price">${product.price} €</p>
          <p class="description-container">${product.description}</p>
        </div>
      </div>
    `
    productContainer.innerHTML += productHtml
  });
}

async function switchProductThumb(thumbId, productId){
  const data = await fetchUri(`https://dummyjson.com/products/${productId}`, "GET")
  const productThumb = document.getElementById(`product-thumb-${productId}`)
  productThumb.setAttribute("src", data.images[thumbId])
}

async function loadPageContent(){
  /* Get DOM Elements */
  const recomandation = document.getElementById("recommendation");

  /* Fetch API */
  const data = await fetchUri("https://dummyjson.com/products?limit=50", "GET");
  const products = data.products;

  /* Display content */
  recomandation.innerHTML = `
    <img src="${products[0].thumbnail}" alt="">
    <div class="infos-container">
      <button class="primary">See more</button>
      <h3 class="product-name">${products[0].title}</h3>
    </div>
  `
  renderProductList(products);
}

async function fetchUri(uri, methode){
  try{
    const resp = await fetch(uri, {method: methode});
    return await resp.json();
  }catch(err){
    console.error(err)
  }
}