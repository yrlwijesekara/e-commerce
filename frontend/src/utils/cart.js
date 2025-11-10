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
        // Always store a string for image (first image if array, or fallback)
        let imageUrl = '';
        if (Array.isArray(product.image)) {
            imageUrl = product.image[0] || 'https://via.placeholder.com/100x100?text=No+Image';
        } else if (typeof product.image === 'string' && product.image.length > 0) {
            imageUrl = product.image;
        } else {
            imageUrl = 'https://via.placeholder.com/100x100?text=No+Image';
        }
        cartItems.push({ 
            productId: product.productId, 
            quantity: quantity,
            name: product.name,
            altname: product.altname,
            price: product.price,
            image: imageUrl
         });
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

export function calculateCartTotal() {
    const cartItems = getCart();
    const total = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    return total;
}