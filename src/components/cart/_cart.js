class Cart
{
    $container = null;
    $cartCounter = null;

    productsInCart = 0;
    singleProductCounterTimer = null;

    fromEl(cartBtn) {
        this.$cartCounter = $('#cartCounter');
        this.$container = $('.cart-wrapper');

        const $container = $(this.$container);

        $(cartBtn).on('click', function (event) {
            $container.show();
        })

        neo(neo().select('.cart-wrapper')).on('userCancelAction', () => {
            $container.hide();
        }, {skipElements: [cartBtn]});

        this.closeButton($container);
        this.loadProducts();
    }

    loadProducts() {

    }

    closeButton(container) {
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
        this.productsInCart -= count;

        this.increaseCartCounter(-count);
    }

    // ========================================================================================
    //  Products.
    // ========================================================================================
    addProduct(product)
    {
        let $product = this.makeProductNode(product);

        $('#emptyCartMessage').hide();

        this.saveProduct(product);
        this.initSingleProductCounter($product, product);
        this.initBinProduct($product);
        this.showCartCounter();
        this.increaseCartCounter();
        this.updateTotalPrices(product);
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

        Auth.check().then((isAuth) => {
            if(isAuth) {
                neo().ajax(env.CART_LOGGED_USER_ADD_PRODUCT_ROUTE, 'POST', productInfo)
            } else {
                neo().sessionPush('cartProducts', productInfo);
            }
        });
    }

    initBinProduct($product)
    {
        $product.find('#removeFromCart').on('click', () => {
            let productId = $product.data('productId');

            this.removeProduct(productId);
        });
    }

    updateTotalPrices(product)
    {
        let $resultPrice = this.$container.find('.result-price');

        if(typeof product.total.value === 'undefined') {
            return;
        }

        $resultPrice.attr('style', 'display: flex !important');
        $resultPrice.find('.new-price').text(product.total.value + ' ' + product.total.unit);

        if(typeof product.total.valueWithoutDiscount !== 'undefined') {
            let $oldPrice = $resultPrice.find('.old-price');

            $oldPrice.text(product.total.valueWithoutDiscount + ' ' + product.total.unit);
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

    removeProduct(productId)
    {
        $('*[data-product-id="' + productId + '"]').remove();

        this.decreaseCartCounter();

        Auth.check().then((isAuth) => {
            if(isAuth) {
                neo().ajax(env.CART_LOGGED_USER_REMOVE_PRODUCT_ROUTE, 'POST', {
                    id: productId,
                })
            } else {
                neo().sessionRemoveItem('cartProducts', productId, 'id');
            }
        });

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

        this.fetchNewPricesAfterProductRemoved({
            removedProductId: productId,
            cartProducts: cartProducts,
        });
    }

    fetchNewPricesAfterProductRemoved(params)
    {
        neo()
            .ajax(env.CART_REMOVE_PRODUCT_ROUTE, 'POST', params)
            .then((response) => response.json())
            .then((json) => {
                this.updateTotalPrices(json);
            });
    }

    importProducts(products)
    {
        products.forEach((product) => {
            this.addProduct(product);
        });

        this.updateTotalPrices(products);
    }

    loadProductsFromSession()
    {

    }
}