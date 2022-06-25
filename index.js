
class Subject {

    handlers = []

    subscribe(fn) {
        this.handlers.push(fn)
    }

    unsubscribe(fn) {
        this.handlers = this.handlers.filter(item => item !== fn)
    }

    fire(o, thisObj) {
        var scope = thisObj || window;
        this.handlers.forEach(item => item.call(scope, o))
    }
}

let subj = new Subject()

// subj.subscribe((o) => {
//     console.log(`test subscribe`)
//     console.log(o)
// })

// console.log(subj)

// subj.fire({ state: 0 })

console.log('Welcome')

var products = [
    {
        id: 1,
        name: 'Nike Lebron 1600 Low',
        price: 25000,
        description: "All sorts of lies to describe what this shoe looks like. I am afraid I just have to write anything. I have to do all these to fill up this space. So, don't be offended if this has no meaning to you.",
        image: 'shoe.png'
    },
    {
        id: 2,
        name: 'Executive analog watch',
        price: 45000,
        description: "All sorts of lies to describe what this shoe looks like. I am afraid I just have to write anything. I have to do all these to fill up this space. So, don't be offended if this has no meaning to you.",
        image: 'watch_sm.png'
    },
    {
        id: 3,
        name: 'Modern eye glasses',
        price: 15500,
        description: "All sorts of lies to describe what this shoe looks like. I am afraid I just have to write anything. I have to do all these to fill up this space. So, don't be offended if this has no meaning to you.",
        image: 'glasses.png'
    }
]

let state = {
    itemsInCart: [],
    quantity: 0,
    currency: 'NGN',
    price: 15000,
    email: '', //'olamideokunola@yahoo.com',
    vendorId: "7ced88de-debc-4b37-b18a-1ab2f507352d",
    product: products[0],
    cartItem: {},
    cartItems: [],
    clickCount: 0,
    title: 'cvcvcv'
}

Object.setPrototypeOf(state, new Subject)
console.log(state)

let setState = (stateFields) => {
    console.log(`set state called ${stateFields}`)
    console.log(stateFields)

    for (const [key, value] of Object.entries(stateFields)) {
        console.log(`${key}: ${value}`);
        if (stateFields.hasOwnProperty(key)) state[key] = value
    }
    state.fire(state)
}

let updateUiElement = (fn) => {
    console.log(`about to subscribe to updateUi! ${fn}`)
    fn()
    state.subscribe(fn)
}

// setState({ clickCount: 2 })

let getItemsInCart = () => state.cartItems
let getAmount = () => Number(state.cartItem.quantity) * Number(state.cartItem.product.price)
let getCurrency = () => state.currency
let getEmail = () => state.email
let getVendorId = () => state.vendorId
let getProduct = () => state.product
let getQuantity = () => state.quantity
let setCartItem = (product, quantity) => {
    state.cartItem = { product, quantity }
    state.fire('')
}
let getCartItem = () => state.cartItem
let getCartItems = () => state.cartItems

let getCartAmount = () => {
    const initialValue = 0;
    let total = state.cartItems.reduce((previousValue, currentValue) => {
        return previousValue + (Number(currentValue.quantity) * Number(currentValue.product.price))
    }, initialValue)
    return total
}

let addCartItem = (item) => state.cartItems.push(item)
let setProduct = (product) => state.product = product
let setQuantity = (val) => state.cartItem.quantity = val

let D = document

let $productName = D.getElementById("product-name")
let $productPrice = D.getElementById("product-price")
let $productDescription = D.getElementById("product-description")
let $productImage = D.getElementById("product-image")

const options = { style: 'currency', currency: getCurrency() };
const amountFormat = new Intl.NumberFormat('en-NG', options);

let $cartItem = D.getElementById("cart-qty")
let $addToCartButton = D.getElementById("add-to-cart")
let $cartQty = D.getElementById("qty")
let $openCartButton = D.getElementById("open-cart")
let $openWindowButton = D.getElementById("open-window")
let $cartForm = D.getElementById("cart-form")
let $paymentForm = D.getElementById('payment-form');

let $paymentFormEmailValidationElement = D.getElementById('email-validation-error')

let $cartProductTitle = D.getElementById('cart-product-title')
let $cartProductPrice = D.querySelector('.cart-product-price')
let $cartProductQuantity = D.getElementById('cart-product-quantity')

let $cartAmount = D.getElementById('cart-amount');
let $cartEmail = D.getElementById('cart-email');
let $cartVendorId = D.getElementById('cart-vendor-id')



let $reduceQuantity = D.getElementById('reduce-quantity')
let $increaseQuantity = D.getElementById('increase-quantity')
let $viewTitle = D.getElementById('view-title')

let $openMobileNav = D.getElementById('open-mobile-nav')
let $mobileNavScreen = D.getElementById('mobile-nav-screen-bkg')

// Views
let productListView = D.getElementById("product-list-view")
let cartView = D.getElementById("cart-view")
let productView = D.getElementById("product-view")

let removeAllChildren = (element) => {
    console.log(`removing children`)
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

console.log(productView)

// Routes
let routes = [
    {
        name: 'home',
        path: '/home',
        view: productListView
    },
    {
        name: 'product',
        path: '/products/:id',
        view: productView
    },
    // {
    //     name: 'product',
    //     path: '/product',
    //     view: productView
    // },
    {
        name: 'cart',
        path: '/cart',
        view: cartView
    }
]

let views = routes.map(r => r.view)

let openRoute = (path) => {
    let pathHasParams = (routePath) => {
        let re = /\/(?=:id)/
        return re.test(routePath)
    }

    let pathStartsRoute = (routePath) => {
        console.log(`in pathStartsRoute`)
        let pathParts = routePath.split(':')
        let reStr = pathParts[0].replace(/\//g, '\\/')
        console.log(`regex: ${reStr}`)

        const re = new RegExp(`${reStr}`)
        return re.test(path)
    }

    let route = routes.find(r => {

        // check if there are params in the path of current route
        console.log(`path is ${r.path}`)
        console.log(`pathHasParams is ${pathHasParams(r.path)}`)
        if (pathHasParams(r.path)) {
            console.log('has params')
            // if there are params, check if the path is the start of the current route
            if (pathStartsRoute(r.path)) {
                // if it is the start then get the param id and return true
                return true
            }
            // if not the start then return false
            return
        } else {
            console.log('no params-----')
            // If no params, then match the entire path
            // if there is a match return true
            // if no match return false
            let re = new RegExp(r.path)
            // console.log(`test value is ${re.test(path)}`)
            return re.test(path)
        }
    })

    console.log(`product view hidden is ${route.view.hidden}`)

    // hide others
    let otherRoutes = routes.filter(r => r.name !== route.name)
    console.log(otherRoutes)
    otherRoutes.forEach(r => r.view.hidden = true)

    // show current
    route.view.refresh()
    route.view.hidden = false

    console.log(`product view hidden is ${route.view.hidden}`)
}

let params = () => {
    let path = document.location.hash
    let pathParts = path.split(/\/(?=\d)/)
    console.log(`in params`)
    console.log(pathParts)
    return pathParts[pathParts.length - 1]
}

window.addEventListener('popstate', (e) => {
    e.preventDefault()
    console.log('popstate activated')
    console.log(document.location.hash)
    console.log(e)
    openRoute(document.location.hash)
})

$openMobileNav.addEventListener('click', (e) => {
    console.log(this)
    $mobileNavScreen.show()
})

$mobileNavScreen.addEventListener('click', (e) => {
    console.log(`mobileNavScreen clicked!`)
    $mobileNavScreen.hide()
})

//
$cartItem.value = 100
console.log(`cart item value: ${$cartItem.value}`)

$cartItem.addEventListener('change', (e) => {
    // alert(`in handleSetQuantity` )
    e.preventDefault()
    console.log(e.target.value)
    console.log(getProduct())
    setCartItem(getProduct(), e.target.value)
    console.log(getCartItem())
    console.log(getCartItems())
})

$cartForm.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(getCartItems())
    console.log(`about to submit form`)
    console.log(getCartItem())
    let item = getCartItem()
    console.log(item.product.id)
    console.log(getCartItems())
    let found = getCartItems()?.find(itm => Number(itm.product.id) === Number(item.product.id))

    console.log(`found is ${found}`)
    if (!found) {
        addCartItem(item)
    } else {
        found.quantity = item.quantity
    }

    console.log(getCartItems())
    updateUiElement(() => {
        $cartQty.innerHTML = getItemsInCart().length
    })

    console.log(`Items in cart is ${getItemsInCart().length}`)
    console.log(`Amount is ${getCurrency()} ${getCartAmount()}`)
})

let viewPrototype = Object.getPrototypeOf(productListView)
console.log(viewPrototype)
viewPrototype.refresh = function () {

}

updateUiElement(() => {
    $viewTitle.innerHTML = state.title
    console.log(`state is ${state}`)
    console.log(state)
})

productListView.setup = function () {
    console.log(`about to log prototype`)
    console.log(this)

    let productList = D.getElementById('product-list')

    // get product List
    products.forEach(p => {
        // create list view element
        let liTemplate = D.getElementById('product-list-item-template')
        let clonedLi = liTemplate.cloneNode(true)
        clonedLi.hidden = false

        let productImage = clonedLi.querySelector('.product-list-item-image')
        let productName = clonedLi.querySelector('.product-list-item-name')
        let productPrice = clonedLi.querySelector('.product-list-item-price')
        let productLink = clonedLi.querySelector('a')
        // let productDescription = clonedLi.querySelector('.product-list-item-description')

        productImage.setAttribute('src', `images/${p.image}`)
        productLink.setAttribute('href', `#/products/${p.id}`)

        productName.innerHTML = p.name
        productPrice.innerHTML = amountFormat.format(p.price)
        // productDescription.innerHTML = p.description

        productList.appendChild(clonedLi)
    })
}

productListView.refresh = function() {
    setState({ title: 'Products' })
    console.log(`title is ${state.title}`)
}

// console.log(productListView)
productView.setProduct = function (product) {
    console.log(`in set product`)
    $productName.innerHTML = product.name
    $productPrice.innerHTML = amountFormat.format(product.price)
    $productDescription.innerHTML = product.description
    $productImage.setAttribute('src', `images\\${product.image}`)
}

productView.reset = function () {
    console.log(`product view reset`)
    $cartItem.value = ''
    $cartQty.innerHTML = ''
}

productView.setup = function () {

}

productView.refresh = function () {
    setState({ title: 'Product' })
    let productId = params()
    console.log(`in productView Setup`)
    console.log(params())
    console.log(`productId is ${productId}`)
    setProduct(products.find(p => p.id === Number(productId)))
    this.setProduct(getProduct())
    this.reset()
}

cartView.setup = function () {
    this.classList.remove('column-2')
    console.log(`in cartViewSetup`)
    console.log(this)
}

cartView.refresh = function () {
    setState({ title: 'Cart' })
    console.log(`in cartView refresh`)

    let cartProductLinesView = D.getElementById("cart-product-lines")
    let cartProductLineTemplate = D.getElementById("cart-product-line-template")
    cartProductLineTemplate.hidden = true

    // remove existing children
    removeAllChildren(cartProductLinesView)

    let createItemView = (item) => {
        // clone template
        let newProductLine = cartProductLineTemplate.cloneNode(true)
        newProductLine.hidden = false
        newProductLine.setAttribute('id', '')

        // set members
        let productImage = newProductLine.querySelector('.product-line-image')
        let productName = newProductLine.querySelector('.cart-product-title')
        let productPriceElements = newProductLine.querySelectorAll('.cart-product-price')
        let productQuantity = newProductLine.querySelector('.cart-product-quantity')

        productImage.setAttribute('src', `images/${item.product.image}`)
        productName.innerHTML = item.product.name

        productPriceElements.forEach(e => e.innerHTML = amountFormat.format(item.product.price))
    
        productQuantity.value = item.quantity

        return newProductLine
    }
    // Get the cart items


    // create cartitem view for each cart item
    getCartItems().forEach(item => {
        console.log(item)
        let itemView = createItemView(item)
        cartProductLinesView.appendChild(itemView)
    })
}

$mobileNavScreen.show = function() {
    $mobileNavScreen.classList.add('mobile-nav-screen-bkg')
}

$mobileNavScreen.hide = function() {
    $mobileNavScreen.classList.remove('mobile-nav-screen-bkg')
}

function startUp() {
    productListView.setup()
    productListView.refresh()
    productListView.hidden = false

    productView.setup()
    productView.hidden = true

    cartView.setup()
    productView.hidden = true

    $mobileNavScreen.hide()
}

startUp()

console.log(`cart item value: ${$cartItem.value}`)

let setUiCartAmount = () => {
    $cartAmount.value = amountFormat.format(getCartAmount())
}

$openCartButton.addEventListener("click", () => {
    console.log(`about to open cart`)

    location.assign("#/cart")
    console.log(history)

    updateUiElement(() => {
        $cartProductTitle.innerHTML = getCartItem().product.name
        $cartProductPrice.innerHTML = amountFormat.format(getCartItem().product.price)
        $cartProductQuantity.value = getCartItem().quantity

        $cartEmail.value = getEmail()
        setUiCartAmount()
        $cartVendorId.value = getVendorId()
    })
})

$reduceQuantity.addEventListener('click', (e) => {
    getCartItem().quantity > 0 ? getCartItem().quantity-- : 0
    updateUiElement(() => {
        $cartProductQuantity.value = getCartItem().quantity
        setUiCartAmount()
    })
})

$increaseQuantity.addEventListener('click', (e) => {
    getCartItem().quantity++
    updateUiElement(() => {
        $cartProductQuantity.value = getCartItem().quantity
        setUiCartAmount()
    })
})

$paymentForm.addEventListener("submit", payWithCryptoBank)

function fieldsAreValid() {
    let response = false
    if ($cartEmail.value !== '') return true
    return response
}

function payWithCryptoBank(e) {
    console.log(`in payWithCryptoBank`)
    console.log('target email is', $cartEmail.value)
    $paymentFormEmailValidationElement.hidden = true
    e.preventDefault();

    if(fieldsAreValid()) {
        cryptoBankPopup.setup({
            key: 'pk_test_xxxxxxxxxx', // Replace with your public key
            email: $cartEmail.value,
            amount: getAmount() * 100,
            currency: 'NGN',
            vendorId: getVendorId(),    
            onClose: function () {
                alert('Are you sure you want to cancel the payment?');
            },
            callback: function ({ msg, tokenQty, tokenSymbol, usdAmount, fiatSymbol, fiatAmount, paymentId }) {
                let message = `Payment complete! ${fiatSymbol} ${fiatAmount} paid with ${tokenSymbol} ${tokenQty}`
                message = `Payment complete! reference id is ${paymentId}`
                console.log(message);
    
                productView.style.display = "block"
                cartView.style.display = "none"
    
                productView.reset()
                console.log(`cart item value: ${$cartItem.value}`)
                console.log(`cart item value: ${$cartQty.innerHTML}`)
            }
        })
    } else {
        $paymentFormEmailValidationElement.hidden = false
    }

    cryptoBankPopup.openIframe()
}