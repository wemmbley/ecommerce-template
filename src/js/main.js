// Icons.
const searchIcon = document.getElementById('search');
const cartIcon = document.getElementById('cart');

// Plugins.
Search.fromEl(searchIcon);

const ShoppingCart = new Cart();
ShoppingCart.fromEl(cartIcon);