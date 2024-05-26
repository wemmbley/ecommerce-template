Search.fromEl(document.getElementById('search'));

const ShoppingCart = new Cart();
ShoppingCart.fromEl(document.getElementById('cart'));

// Product counter.
// ShoppingCart.showProductCounter();
// ShoppingCart.increaseProductCounter();
// ShoppingCart.decreaseProductCounter();

ShoppingCart.addProduct({
    "id": 1,
    "count": 3,
    "title": "accusamus beatae ad facilis cum similique qui sunt",
    "url": "https://via.placeholder.com/600/92c952",
    "thumbnailUrl": "https://via.placeholder.com/150/92c952",
    "thumbnailAltText": "lorem ipsumed",
    "discount": {
        "oldPrice": "12000 UAH",
        "newPrice": "7800 UAH",
        "discountEnds": "2024-12-12 00:00:00"
    }
});
ShoppingCart.addProduct({
    "id": 9,
    "count": 1,
    "title": "accusamus beatae ad facilis cum similique qui sunt",
    "price": "12 999 UAH",
    "url": "https://via.placeholder.com/600/771796",
    "thumbnailUrl": "https://via.placeholder.com/150/771796",
    "thumbnailAltText": "lorem ipsumed"
});
// ShoppingCart.removeProduct(9);
// ShoppingCart.removeProduct(1);

// @if(authorized)
//     ShoppingCart.importProducts(1);
// @endif