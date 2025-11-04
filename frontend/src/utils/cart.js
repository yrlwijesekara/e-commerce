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
            const newcart = cartItems.filter((item, index) => index !== existingItemIndex);
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