const __CART_ROUTE = 'https://f466e812906041e9ac3036585cf58cb9.api.mockbin.io//';

class Cart
{
    // ========================================================================================
    //  Nodes
    // ========================================================================================
    container;
    counter;
    productsCountInCart = 0;

    fromEl(cartBtn)
    {
        this.counter = $('#cartCounter');
        this.container = $('.cart-wrapper');

        const $container = $(this.container);

        $(cartBtn).on('click', function (event) {
            $container.show();
        })

        $container.on('userCancelAction', () => {
            $container.hide();
        }, {skipElements: [cartBtn]});

        this.closeButton($container);
    }

    closeButton(container)
    {
        $('#closeCart').on('click', function () {
            container.hide();
        });
    }

    // ========================================================================================
    //  Counter.
    // ========================================================================================
    showProductCounter()
    {
        this.counter.animate({ opacity: 1 }, 120);
    }

    hideProductCounter()
    {
        this.counter.hide();
    }

    increaseProductCounter(count = 1)
    {
        this.counter.text(parseInt(this.counter.text()) + count);
    }

    decreaseProductCounter(count = 1)
    {
        this.increaseProductCounter(-count);
    }

    // ========================================================================================
    //  Products.
    // ========================================================================================
    addProduct(product)
    {
        let $product = $('#productSkeleton').clone();
        let $emptyCartMessage = $('#emptyCartMessage');

        this.productsCountInCart++;

        $emptyCartMessage.hide();

        $product.find('.preview img')
            .attr('src', product.thumbnailUrl)
            .attr('alt', product.thumbnailAltText);
        $product.find('#itemsCount').val(product.count);
        $product.find('.title')
            .text(product.title)
            .attr('href', product.url);
        $product.attr('data-product-id', product.id);

        let $productDiscount = $product.find('.price-discount');

        if(typeof product.discount !== 'undefined') {
            $product.find('.price').text(product.discount.newPrice);
            $productDiscount.find('.new-price').text(product.discount.newPrice);
            $productDiscount.find('.old-price')
                .text(product.discount.oldPrice)
                .attr('style', 'display: flex !important');
        } else {
            $product.find('.price').text(product.price);
            $productDiscount.find('.new-price')
                .text(product.price)
                .addClass('price-normal-color');
        }

        $product.attr('style', 'display: flex !important');
        $product.appendTo('#cartItems');

        this.showProductCounter();
        this.increaseProductCounter();
    }

    removeProduct(productId)
    {
        $('*[data-product-id="' + productId + '"]').remove();

        this.decreaseProductCounter();
        this.productsCountInCart--;

        if(this.productsCountInCart === 0) {
            this.hideProductCounter();

            $('#emptyCartMessage').attr('style', 'display: flex');
        }
    }

    importProducts(products)
    {
        products.forEach((product) => {
            this.addProduct(product);
        });
    }
}