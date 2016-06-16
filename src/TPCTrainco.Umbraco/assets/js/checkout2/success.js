$(document).ready(function () {
    EmptyCart();
});

function EmptyCart() {
    localStorage.removeItem('cartDataArr');
    localStorage.removeItem('cartItemList');
}
