// Всплытие корзины
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

// Открыть корзину и загрузить содержимое из localStorage
cartIcon.onclick = () => {
    cart.classList.add("active");
    clearCart(); // Очистить корзину перед загрузкой содержимого
    loadCartFromLocalStorage(); // Загрузить содержимое корзины из localStorage
};

// Закрыть корзину
closeCart.onclick = () => {
    cart.classList.remove("active");
    saveCartToLocalStorage(); // Сохранить содержимое корзины при закрытии
};

// Создание функции
function ready() {
    loadCartFromLocalStorage(); // Загрузить содержимое корзины из localStorage

    // Удаление предмета из корзины
    var removeCartButtons = document.getElementsByClassName('cart-remove');
    for (var i = 0; i < removeCartButtons.length; i++) {
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }

    // Изменение количества
    var quantityInputs = document.getElementsByClassName("cart-quantity");
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }

    // Добавить в корзину
    var addCart = document.getElementsByClassName("cart_bin");
    for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
        button.addEventListener("click", addCartClicked);
    }

}




// Удаление предмета из корзины
function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
    saveCartToLocalStorage(); // Сохраняем содержимое корзины после удаления товара
}

// Добавление в корзину
function addCartClicked(event) {
    var button = event.target;
    var shopProducts = button.parentElement;
    var title = shopProducts.querySelector(".product_title").innerText.toLowerCase();
    var price = shopProducts.querySelector(".price").innerText.toLowerCase();
    var productImg = shopProducts.querySelector(".product-img").src.toLowerCase();
    
    // Проверяем, есть ли уже такой товар в корзине
    var cartItems = document.querySelectorAll(".cart-content .cart-box");
    for (var i = 0; i < cartItems.length; i++) {
        var cartTitle = cartItems[i].querySelector(".cart-product-title").innerText.toLowerCase();
        var cartPrice = cartItems[i].querySelector(".cart-price").innerText.toLowerCase();
        var cartImg = cartItems[i].querySelector(".cart-img").src.toLowerCase();

        if (cartTitle === title && cartPrice === price && cartImg === productImg) {
            alert("Этот товар уже добавлен в корзину!");
            return; // Прерываем выполнение функции, чтобы не добавлять товар еще раз
        }
    }
    
    // Если товара еще нет в корзине, добавляем его
    addProductToCart(title, price, productImg, 1); // Устанавливаем начальное количество 1
}

function addProductToCart(title, price, productImg, quantity) {
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");

    var cartBoxContent = `
        <img src="${productImg}" alt="" class="cart-img">
        <div class="detail-box">
            <div class="cart-product-title">${title}</div>
            <div class="cart-price">${price}</div>
            <input type="number" value="${quantity}" class="cart-quantity">
        </div>
        <i class="bx bxs-trash-alt bx-sm cart-remove"></i>`;

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.appendChild(cartShopBox);

    // Сохранение содержимого корзины в localStorage при добавлении товара
    saveCartToLocalStorage();
    // Убедимся, что обновляем общую сумму после добавления товара
    updateTotal();
    
    cartShopBox.querySelector(".cart-remove").addEventListener("click", removeCartItem);
    cartShopBox.querySelector(".cart-quantity").addEventListener("change", quantityChanged);
}

// Обновление цены
function updateTotal() {
    var cartContent = document.getElementsByClassName("cart-content")[0]; // Перемещаем получение cartContent сюда
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName('cart-price')[0];
        var quantityElement = cartBox.getElementsByClassName('cart-quantity')[0];
        var price = parseFloat(priceElement.innerText.replace("KZT", ""));
        var quantity = quantityElement.value;
        total += price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('total-price')[0].innerText = total + "KZT";

    if (cartBoxes.length === 0) {
        document.getElementsByClassName('total-price')[0].innerText = "0KZT";
    }
}

// Изменение цены, увеличение ее при выборе большего количества товара
function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateTotal();
    saveCartToLocalStorage(); // Сохраняем содержимое корзины после изменения количества товара
}

// Сохранение содержимого корзины в localStorage
function saveCartToLocalStorage() {
    var cartContent = document.querySelector(".cart-content");
    var cartItems = cartContent.querySelectorAll(".cart-box");

    var cartItemsData = [];

    cartItems.forEach(function(cartItem) {
        var title = cartItem.querySelector(".cart-product-title").textContent;
        var price = cartItem.querySelector(".cart-price").textContent;
        var productImg = cartItem.querySelector(".cart-img").src;
        var quantity = cartItem.querySelector(".cart-quantity").value;

        cartItemsData.push({
            title: title,
            price: price,
            productImg: productImg,
            quantity: quantity
        });
    });

    localStorage.setItem("cartItems", JSON.stringify(cartItemsData));
}

// Загрузка содержимого корзины из localStorage
function loadCartFromLocalStorage() {
    var storedCartItems = JSON.parse(localStorage.getItem("cartItems"));

    if (storedCartItems) {
        storedCartItems.forEach(function(item) {
            addProductToCart(item.title, item.price, item.productImg, item.quantity); // Передаем сохраненное количество
        });
    }
}

// Очистка корзины
function clearCart() {
    var cartContent = document.querySelector(".cart-content");
    cartContent.innerHTML = "";
}

// Работа с корзиной
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}

