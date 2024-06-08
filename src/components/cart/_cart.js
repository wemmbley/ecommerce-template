class Cart
{
    $container = null;
    $cartCounter = null;

    productsInCart = 0;
    singleProductCounterTimer = null;

    constructor()
    {
        this.$cartCounter = $('#cartCounter');
        this.$container = $('.cart-wrapper');
    }

    fromEl(cartBtn)
    {
        this.initModal(cartBtn);
        this.importProducts();

        // this.removeAllProducts();
        // this.insertTestProduct();
    }

    // ========================================================================================
    //  Modal.
    // ========================================================================================
    initModal(cartBtn)
    {
        const $container = $(this.$container);

        this.tapCartButton(cartBtn, $container);
        this.tapToClose(cartBtn, $container);
        this.tapCloseButton($container);
    }

    tapToClose(cartBtn, $container)
    {
        neo(neo().select('.cart-wrapper')).on('userCancelAction', () => {
            $container.hide();
        }, {skipElements: [cartBtn]});
    }

    tapCartButton(cartBtn, $container)
    {
        $(cartBtn).on('click', function (event) {
            $container.show();
        })
    }

    tapCloseButton(container)
    {
        $('#closeCart').on('click', function () {
            container.hide();
        });
    }

    // ========================================================================================
    //  Counter.
    // ========================================================================================
    showCartCounter()
    {
        this.$cartCounter.animate({opacity: 1}, 120);
    }

    hideCartCounter()
    {
        this.$cartCounter.hide();
    }

    increaseCartCounter(count = 1)
    {
        this.productsInCart += count;

        this.$cartCounter.text(parseInt(this.$cartCounter.text()) + count);
    }

    decreaseCartCounter(count = 1)
    {
        if(this.productsInCart <= 0) {
            return;
        }

        this.productsInCart -= count;

        this.increaseCartCounter(-count);
    }

    // ========================================================================================
    //  Products.
    // ========================================================================================
    importProducts() {
        this.importProductsFromSession();
    }

    addProduct(product)
    {
        console.log('addProduct', product)
        let $product = this.makeProductNode(product);

        $('#emptyCartMessage').hide();

        this.saveProduct(product);
        this.initSingleProductCounter($product, product);
        this.initBinProduct($product);
        this.showCartCounter();
        this.increaseCartCounter();

        if(!empty(product.total)) {
            this.updateTotalPrices(product.total);
        }
    }

    makeProductNode(product)
    {
        let $product = $('#productSkeleton').clone();

        $product.find('.preview img')
            .attr('src', product.image.preview)
            .attr('alt', product.image.altText);

        $product.find('.title')
            .text(product.title)
            .attr('href', product.url);
        $product.attr('data-product-id', product.id);

        let $productDiscount = $product.find('.price-discount');

        if (typeof product.discount !== 'undefined') {
            $product.find('.price').text(product.discount.newPrice + ' ' + product.discount.unit);
            $productDiscount.find('.new-price').text(product.discount.newPrice + ' ' + product.discount.unit);
            $productDiscount.find('.old-price')
                .text(product.discount.oldPrice + ' ' + product.discount.unit)
                .attr('style', 'display: flex !important');
        } else {
            $product.find('.price').text(product.price + ' ' + product.price.unit);
            $productDiscount.find('.new-price')
                .text(product.price + ' ' + product.price.unit)
                .addClass('price-normal-color');
        }

        $product.attr('style', 'display: flex !important');
        $product.appendTo('#cartItems');

        return $product;
    }

    saveProduct(product)
    {
        let productInfo = {
            id: product.id,
            count: product.cart.count,
        };

        if(Auth.check()) {
            neo().ajax(env.CART_LOGGED_USER_ADD_PRODUCT_ROUTE, 'POST', productInfo)
        } else {
            neo().sessionPush('cartProducts', productInfo);
        }
    }

    initBinProduct($product)
    {
        $product.find('#removeFromCart').on('click', () => {
            let productId = $product.data('productId');

            this.removeProduct(productId);
        });
    }

    updateTotalPrices(total)
    {
        console.log('updateTotalPrices', total)
        let $resultPrice = this.$container.find('.result-price');
        console.log('updateTotalPrices total.value', total.value, empty(total.value))
        if(empty(total.value)) {
            return;
        }

        $resultPrice.attr('style', 'display: flex !important');
        console.log($resultPrice)
        $resultPrice.find('.new-price').text(total.value + ' ' + total.unit);

        if(!empty(total.valueWithoutDiscount)) {
            let $oldPrice = $resultPrice.find('.old-price');

            $oldPrice.text(total.valueWithoutDiscount + ' ' + total.unit);
            $oldPrice.attr('style', 'display: flex !important');
        }

        this.$container.find('.make-order-btn').attr('style', 'display: flex !important');
    }

    initSingleProductCounter($product, product)
    {
        let $itemsCount = $product.find('#itemsCount');
        let $decrease = $product.find('.decrease');
        let $increase = $product.find('.increase');

        $itemsCount.val(product.cart.count);

        if(product.cart.count > product.cart.min) {
            $product.find('.counter .decrease').attr('disabled', false);
        }

        $decrease.on('click', (e) => {
            let itemsCount = parseInt($itemsCount.val());
            let newItemsCount = itemsCount - 1;

            $itemsCount.val(newItemsCount);

            if(newItemsCount < product.cart.max) {
                $increase.attr('disabled', false);

                Tooltipper.remove();
            }

            if(newItemsCount === 1 || newItemsCount === product.cart.min) {
                $decrease.attr('disabled', true);

                Tooltipper.make($product.find('.decrease-wrapper'), $('#minProductsLimitTooltip'));
            }

            // this.requestUpdatedProductCount(productId, newItemsCount);
        });

        $increase.on('click', (e) => {
            let itemsCount = parseInt($itemsCount.val());
            let newItemsCount = itemsCount + 1;

            if(newItemsCount > 1 || newItemsCount > product.cart.min) {
                $decrease.attr('disabled', false);

                Tooltipper.remove();
            }

            if(newItemsCount === product.cart.max && product.cart.max !== '-1') {
                $increase.attr('disabled', true);

                Tooltipper.make($product.find('.increase-wrapper'), $('#maxProductsLimitTooltip'));
            }

            $itemsCount.val(newItemsCount);

            // this.requestUpdatedProductCount(productId, newItemsCount);
        });
    }

    requestUpdatedProductCount(productId, newItemsCount)
    {
        this.singleProductCounterTimer = setTimeout(() => {
            neo().ajax(env.CART_LOGGED_USER_SET_SINGLE_PRODUCT_COUNT_ROUTE, 'PUT', params)
        }, env.CART_LOGGED_USER_SET_SINGLE_PRODUCT_COUNT_SLEEP);
    }

    removeProduct(productId, fetchNewTotal = true)
    {
        $('*[data-product-id="' + productId + '"]').remove();

        this.decreaseCartCounter();

        if(Auth.check()) {
            neo().ajax(env.CART_LOGGED_USER_REMOVE_PRODUCT_ROUTE, 'POST', {
                id: productId,
            })
        } else {
            neo().sessionRemoveItem('cartProducts', productId, 'id');
        }

        if(this.productsCountInCart === 0) {
            this.hideCartCounter();

            $('#emptyCartMessage').attr('style', 'display: flex');
            $('.result-price').hide();
            $('.make-order-btn').hide();

            return;
        }

        let $cartProducts = $('*[data-product-id]');
        let cartProducts = [];

        $cartProducts.each((i, el) => {
            cartProducts.push($(el).data('productId'));
        });

        if(fetchNewTotal) {
            this.fetchNewPricesAfterProductRemoved({
                removedProductId: productId,
                cartProducts: cartProducts,
            });
        }
    }

    removeAllProducts()
    {
        const products = neo().sessionGet('cartProducts');
        console.log('removeAllProducts', products)

        if(empty(products)) {
            return;
        }

        products.forEach((product) => {
            this.removeProduct(product.id, false);
        })

        if(Auth.check()) {
            neo().ajax(env().CART_LOGGED_USER_CLEAR_CART);
        }
    }

    fetchNewPricesAfterProductRemoved(params)
    {
        neo()
            .ajax(env.CART_LOGGED_USER_REMOVE_PRODUCT_ROUTE, 'POST', params)
            .then((response) => response.json())
            .then((product) => {
                console.log('fetchNewPricesAfterProductRemoved', product)
                this.updateTotalPrices(product.total);
            });
    }

    importProductsFromSession()
    {
        let productsToRetrieve = neo().sessionGet('cartProducts');
        console.log('importProductsFromSession', productsToRetrieve)

        if(!empty(productsToRetrieve) && !Auth.check()) {
            console.log('importProductsFromSession if', !empty(productsToRetrieve), !Auth.check())
            this.removeAllProducts();

            neo()
                .ajax(env.CART_LOGGED_USER_IMPORT_PRODUCTS_ROUTE)
                .then((response) => response.json())
                .then((response) => {
                    const products = response.products;
                    const total = response.total;

                    products.forEach((product) => {
                        console.log('importProductsFromSession product', product)
                        this.addProduct(product);
                    });

                    this.updateTotalPrices(total)
                });
        }
    }

    insertTestProduct()
    {
        console.log('insert test product')
        ShoppingCart.addProduct({
            "id": 1,
            "title": "accusamus beatae ad facilis cum similique qui sunt",
            "url": "https://via.placeholder.com/600/92c952",
            "image": {
                "preview": "https://via.placeholder.com/150/92c952",
                "medium": "https://via.placeholder.com/150/92c952",
                "original": "https://via.placeholder.com/150/92c952",
                "altText": "lorem ipsumed",
            },
            "price": {
                "value": "7800",
                "unit": "UAH"
            },
            "discount": {
                "oldPrice": "12000",
                "newPrice": "7800",
                "unit": "UAH",
                "discountEnds": "2024-12-12 00:00:00"
            },
            "total": {
                "value": "9 000",
                "valueWithoutDiscount": "11 900",
                "unit": "UAH",
            },
            "cart": {
                "count": 3,
                "min": 2,
                "max": 5,
            },
        });
    }
}