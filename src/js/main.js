function isAuth() {
    return false;
}

Search.fromEl(document.getElementById('search'));

const ShoppingCart = new Cart();
ShoppingCart.fromEl(document.getElementById('cart'));