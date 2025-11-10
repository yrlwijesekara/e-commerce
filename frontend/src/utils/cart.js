export function removeFromCart(productId) {
    const cartItems = getCart();
    const newCart = cartItems.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(newCart));
}
export function getCart(){
    let cart = localStorage.getItem('cart');
    

    if (cart===null){ 
        cart= "[]";
        localStorage.setItem('cart', cart);
    }
    const cartItems = JSON.parse(cart);
    return cartItems;
}
export function addToCart(product, quantity){
    const cartItems = getCart();
    const existingItemIndex = cartItems.findIndex(item => item.productId === product.productId);
    if (existingItemIndex !== -1) {
        const newQuantity = cartItems[existingItemIndex].quantity + quantity;
        if (newQuantity <= 0) {
            // Remove the item from cart
            cartItems.splice(existingItemIndex, 1);
        } else {
            cartItems[existingItemIndex].quantity = newQuantity;
        }
    } else {
        cartItems.push({ 
            productId: product.productId, 
            quantity: quantity,
            name: product.name,
            altname: product.altname,
            price: product.price,
            image: product.image
         });
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
}