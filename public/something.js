//For checking if JAVASCRIPT is loading
if(document.readyState =="loading"){
    document.addEventListener('DOMContentLoaded',ready)
}else{
    ready();
}
//cart open close
// let cartIcon = document.querySelector('#cart-icon');
// let cart = document.querySelector('.cart');
// let closeCart = document.querySelector('#close-cart');
//open cart
// cartIcon.onclick = () =>{
//     cart.classList.add("active");
// };
// //close cart
// closeCart.onclick= () =>{
//     cart.classList.remove("active");
// };
function ready(){
    //To remove items for cart upon clicking the trash icon
    var removeCartButtons = document.getElementsByClassName("cart-remove");
    for(var i = 0;i<removeCartButtons.length;i++){
        var button = removeCartButtons[i];
        button.addEventListener('click',removeCartItem);
    }
    //To chnage total when quantoty is chnaged to make sure valid inputs are entered
    var quantityInputs = document.getElementsByClassName('cart-quantity');
    for(var i = 0;i<quantityInputs.length;i++){
        var input = quantityInputs[i];
        input.addEventListener('change',quantityChanged);
    }
    //add to cart buttons
    var addToCartButtons = document.getElementsByClassName('add-cart');
    for(var i = 0;i<addToCartButtons.length;i++){
        var button = addToCartButtons[i];
        button.addEventListener('click',addToCartClicked);
    }

    loadCartItems();
}
let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#close-cart');
//open cart
cartIcon.onclick = () =>{
    cart.classList.add("active");
};
//close cart
closeCart.onclick= () =>{
    cart.classList.remove("active");
};

function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove(); 
    updateCartTotal();
    saveCartItems();
}
function quantityChanged(event){
    var input = event.target;
    if(isNaN(input.value) || input.value <= 0){
        input.value = 1;
    }
    updateCartTotal();
    saveCartItems();
} 
function addToCartClicked(event){
    var button = event.target;
    var shopItem = button.parentElement;
    var title = shopItem.getElementsByClassName('product-title')[0].innerText;
    var price = shopItem.getElementsByClassName('price')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('product-img')[0].src;
    addItemToCart(title,price,imageSrc);
    updateCartTotal();
    saveCartItems();

}
function addItemToCart(title,price,imageSrc){
    var cartRow = document.createElement("div");
    cartRow.classList.add('cart-box');
    var cartItems = document.getElementsByClassName('cart-content')[0]
    var cartItemsNames = cartItems.getElementsByClassName('cart-product-title');
    for(var i =0;i<cartItemsNames.length;i++){
        if(cartItemsNames[i].innerText == title){
            alert('You have already added this item to the cart');
            return;
        }
    }
    var cartBoxContent = `
    <img src="${imageSrc}" class="cart-img">
    <div class="detail-box">
      <div class="cart-product-title">${title}</div>
      <div class="cart-price">${price}</div>
      <input type="number" name="" id="" value="1" class="cart-quantity">
    </div>
    <i class="bx bx-trash-alt cart-remove"></i>`;
    cartRow.innerHTML = cartBoxContent;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('cart-remove')[0]
    .addEventListener("click",removeCartItem);
    cartRow
    .getElementsByClassName('cart-quantity')[0]
    .addEventListener('change',quantityChanged);


}
//To update the total in the cart after updating cart
function updateCartTotal(){
    var cartItemContainer = document.getElementsByClassName("cart-content")[0];
    var cartRows = cartItemContainer.getElementsByClassName("cart-box");
    var total = 0;
    for(var i =0;i< cartRows.length;i++){
        //accessing the cart rows and quantity and price elements to compute total
        var cartRow  = cartRows[i];
        var priceElement = cartRow.getElementsByClassName("cart-price")[0];
        var quantityElement = cartRow.getElementsByClassName("cart-quantity")[0];
      
        var price = parseFloat(priceElement.innerText.replace('$',''));
        var quantity = quantityElement.value;
        total += price*quantity;
    }
     total = Math.round(total*100)/100;    
     document.getElementsByClassName('total-price')[0].innerText = "$"+ total;
     localStorage.setItem("cartTotal",total);
}

function saveCartItems(){
    var cartContent = document.getElementsByClassName('cart-content')[0];
    var cartBoxes = cartContent.getElementsByClassName('cart-box');
    var cartItems = [];
    for(var i= 0; i <cartBoxes.length;i++){
        cartBox = cartBoxes[i];
        var titleElement = cartBox.getElementsByClassName('cart-product-title')[0];
        var priceElement = cart.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var productImg = cartBox.getElementsByClassName('cart-img')[0].src;
        var item = {
            title :titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.innerText,
            productImg: productImg

        };
        cartItems.push(item);
        }
        localStorage.setItem("cartItems",JSON.stringify(cartItems));
}
function loadCartItems(){
    var cartItems = localStorage.getItem('cartItems');
    if(cartItems){
        cartItems = JSON.parse(cartItems);
        for(var i = 0;i<cartItems.length;i++){
            var item = cartItems[i];
            addProducttoCart(item.title,item.price,item.productImg);
            var cartBoxes = document.getElementsByClassName("cart-box");
            var cartBox = cartBoxes[cartBoxes.length-1];
            var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
            quantityElement.value = item.quantity;

        }

    }
    var cartTotal = localStorage.getItem('cartTotal');
    if(cartTotal){
        document.getElementsByClassName('total-price')[0].innerText = '$'+cartTotal;
    }
}
