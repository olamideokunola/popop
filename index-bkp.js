console.log('Welcome')

let state = {
    itemsInCart: 0,
    currency: 'NGN',
    price: 150,
    email: 'olamideokunola@yahoo.com',
    vendorId: "7ced88de-debc-4b37-b18a-1ab2f507352d"
}

let setItemsInCart = (qty) => state.itemsInCart = qty
let getItemsInCart = () => state.itemsInCart
let getAmount = () => state.itemsInCart * state.price
let getCurrency = () => state.currency
let getEmail = () => state.email
let getVendorId = () => state.vendorId

let D = document
let $cartItem = D.getElementById("cart-qty")
let $addToCartButton = D.getElementById("add-to-cart")
let $cartQty = D.getElementById("qty")
let $openCartButton = D.getElementById("open-cart")
let $openWindowButton = D.getElementById("open-window")
let $paymentForm = D.getElementById('payment-form');
let $cartAmount = D.getElementById('cart-amount');
let $cartEmail = D.getElementById('cart-email');
let $cartVendorId = D.getElementById('cart-vendor-id')

// Views
let cartView = D.getElementById("cart-view")
let productview = D.getElementById("product-view")

$addToCartButton.addEventListener("click", () => {
    console.log(`about to add to cart!`)

    setItemsInCart($cartItem.value)
    $cartQty.innerHTML = getItemsInCart()

    console.log(`Items in cart is ${getItemsInCart()}`)
    console.log(`Amount is ${getCurrency()} ${getAmount()}`)
})

$openCartButton.addEventListener("click", () => {
    console.log(`about to open cart`)
    productview.style.display = "none"
    cartView.style.display = "block"

    $cartEmail.value = getEmail()
    $cartAmount.value = `${getCurrency()} ${getAmount()}`
    $cartVendorId.value = getVendorId()
})

let n = D.createElement('iframe')

let openIframe = () => {
    n.setAttribute("frameBorder", "0")
    n.setAttribute("allowtransparency", "true")
    n.setAttribute('id', "payment-iframe")
    n.name = "cbt-checkout"
    // n.style.cssText = "z-index: 999999999999999;background: transparent;border: 0px none transparent;overflow-x: hidden;overflow-y: hidden;margin: 0;padding: 0;-webkit-tap-highlight-color: transparent;-webkit-touch-callout: none;position: fixed;left: 0;top: 0;width: 100%;height: 100%;"
    n.style.cssText = "z-index: 999999999999999;background: transparent;background: rgba(0,0,0,0.5);border: 0px none transparent;overflow-x: hidden;overflow-y: hidden;margin: 0;padding: 0;-webkit-tap-highlight-color: transparent;-webkit-touch-callout: none;position: fixed;left: 0;top: 0;width: 100%;height: 100%;"

    // n.style.display="none"
    n.src = `http://localhost:3002/?amount=${getAmount()}&vendorId=${getVendorId()}&payerEmail=${getEmail()}`
    
    D.body.appendChild(n)
    console.log('about to open window')

    return {
        open: () => n.open,
        frame: () => n,
    }
}

$paymentForm.addEventListener("submit", payWithCryptoBank)

var CryptoBankPop = {
    setup: (options) => {
        let settings = {
            key: options.key,
            email: options.email,
            amount: options.amount,
            currency: options.currency,
            ref: options.ref,
            vendorId: options.vendorId,
            onClose: options.onClose,
            callback: options.callback,
            openIframe: openIframe
        }
        console.log(settings)
        return settings
    }
}

let handler

function payWithCryptoBank(e) {
    console.log(`in payWithCryptoBank`)
    e.preventDefault();
    handler = CryptoBankPop.setup({
        key: 'pk_test_xxxxxxxxxx', // Replace with your public key
        email: $cartEmail.value,
        amount: getAmount() * 100,
        currency: 'NGN',
        vendorId: getVendorId(),
        ref: '' + Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
        // label: "Optional string that replaces customer email"
        onClose: function () {
            alert('Window closed.');
        },
        callback: function ({ msg, tokenQty, tokenSymbol, usdAmount, fiatSymbol, fiatAmount, paymentId }) {
            let message = `Payment complete! ${fiatSymbol} ${fiatAmount} paid with ${tokenSymbol} ${tokenQty}`
            message = `Payment complete! reference id is ${paymentId}`
            console.log(message);
            // close iframe
            let body = D.getElementsByTagName('body')[0]
            body.removeChild(n)
        }
    });
    handler.openIframe()?.open();
    console.log(`about to open window of frame`)
    // console.log(handler.openIframe()?.frame().contentWindow)
    // handler.openIframe()?.setCallBack(function (response) {
    //     let message = 'Payment complete! Reference: ' + response.reference;
    //     alert(message);
    // })
    // console.log(handler.openIframe()?.frame().contentWindow.document)
}

window.onmessage = function (event) {
    if (event.data.success && event.data.msg === 'payment-complete') {
        handler?.callback(event.data)
        console.log(event.origin)
    }
}

// function() {!this.iframe || this.isIframeOpen || this.isEmbed || (this.background.style.display = "", this.background.style.visibility = "visible", this.iframe.style.display = "", this.iframe.contentWindow.postMessage("render", "*"), this.isIframeOpen = !0) }

// !function(){
//     var eventMethod=window.addEventListener?"addEventListener":"attachEvent"
//     eventer=window[eventMethod]
//     messageEvent="attachEvent"==eventMethod?"onmessage":"message"
//     config={
//         siteUrl:"https://paystack.com/",
//         paystackApiUrl:"https://api.paystack.co/",
//         newCheckoutUrl:"https://checkout.paystack.com/"
//     }

// function Inline(t) {
//     this.iframe = null
//     this.background = null
//     this.iframeLoaded = !1
//     this.iframeOpen = !1
//     this.defaults = t
//     this.isEmbed = t && null != t.container
//     this.checkoutLoaded = !1
//     this.checkoutRemoved = !1
//     this.loadedButtonCSS = !1
//     this.setup()
//     this.listenForEvents()
//     noBrowserIframeSupport() && (this.fallback = !0)
// }

// Inline.prototype.setTransaction = function (t) {
//     this.defaults && this.resetNewCheckout()
//     this.defaults = t
//     this.isEmbed = null != t.container
//     this.isEmbed ? (this.removeNewCheckout(), this.setupEmbed()) : this.updateIframe()
// }

// Inline.prototype.setForm = function (t) {
//     this.form = t
//     this.createButton()
// }

// Inline.prototype.loadButtonCSS = function () {
//     var t = this
//     cssLoad(config.siteUrl + "public/css/button.min.css").done(function () { t.loadedButtonCSS = !0 })
// }

// Inline.prototype.createButton = function () { 
//     var t 
//     e = this; 
//     e.defaults.customButton ? 
//         (t = document.getElementById(e.defaults.customButton))
//         .setAttribute("data-paystack", e.defaults.id) : 
//         ((t = document.createElement("button")).innerHTML = "<span class='paystack-top-blue'>Pay Securely with Paystack</span><span class='paystack-body-image'> </span>", t.setAttribute("class", "paystack-trigger-btn"), t.setAttribute("data-paystack", e.defaults.id), sourceScript.parentNode.insertBefore(t, sourceScript.nextSibling)), t.addEventListener("click", function (t) { t.preventDefault(), e.openIframe() }, !1) }

// Inline.prototype.openNewCheckout=function(){

//     !this.iframe||this.isIframeOpen||this.isEmbed||(this.background.style.display="",this.background.style.visibility="visible",this.iframe.style.display="",this.iframe.contentWindow.postMessage("render","*"),this.isIframeOpen=!0)
// }
// Inline.prototype.setupNewPopup = function(){ 
//     var t = document.createElement("iframe")
//     t.setAttribute("frameBorder","0")
//     t.setAttribute("allowtransparency","true")
//     t.id = randomId()
//     t.name = "paystack-checkout-background-"+t.id
//     t.style.cssText = "z-index: 999999999999999;background: transparent;background: rgba(0, 0, 0, 0.75);border: 0px none transparent;overflow-x: hidden;overflow-y: hidden;margin: 0;padding: 0;-webkit-tap-highlight-color: transparent;-webkit-touch-callout: none;position: fixed;left: 0;top: 0;width: 100%;height: 100%;transition: opacity 0.3s;-webkit-transition: opacity 0.3s;visibility: hidden;"
//     t.style.display = "none"
//     this.background = t
//     document.body.appendChild(t)
//     var e = this.background.contentWindow.document
//     e.open()
//     e.write('<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="ie=edge"> <title>Paystack Checkout Loader</title> <style> .app-loader { margin: 200px 0; text-align: center; color: white; } @keyframes app-loader__spinner { 0% { opacity: 1; } 100% { opacity: 0; } } @-webkit-keyframes app-loader__spinner { 0% { opacity: 1; } 100% { opacity: 0; } } .app-loader__spinner { position: relative; display: inline-block; } .app-loader__spinner div { left: 95px; top: 35px; position: absolute; -webkit-animation: app-loader__spinner linear 1s infinite; animation: app-loader__spinner linear 1s infinite; background: white; width: 10px; height: 30px; border-radius: 40%; -webkit-transform-origin: 5px 65px; transform-origin: 5px 65px; } .app-loader__spinner div:nth-child(1) { -webkit-transform: rotate(0deg); transform: rotate(0deg); -webkit-animation-delay: -0.916666666666667s; animation-delay: -0.916666666666667s; } .app-loader__spinner div:nth-child(2) { -webkit-transform: rotate(30deg); transform: rotate(30deg); -webkit-animation-delay: -0.833333333333333s; animation-delay: -0.833333333333333s; } .app-loader__spinner div:nth-child(3) { -webkit-transform: rotate(60deg); transform: rotate(60deg); -webkit-animation-delay: -0.75s; animation-delay: -0.75s; } .app-loader__spinner div:nth-child(4) { -webkit-transform: rotate(90deg); transform: rotate(90deg); -webkit-animation-delay: -0.666666666666667s; animation-delay: -0.666666666666667s; } .app-loader__spinner div:nth-child(5) { -webkit-transform: rotate(120deg); transform: rotate(120deg); -webkit-animation-delay: -0.583333333333333s; animation-delay: -0.583333333333333s; } .app-loader__spinner div:nth-child(6) { -webkit-transform: rotate(150deg); transform: rotate(150deg); -webkit-animation-delay: -0.5s; animation-delay: -0.5s; } .app-loader__spinner div:nth-child(7) { -webkit-transform: rotate(180deg); transform: rotate(180deg); -webkit-animation-delay: -0.416666666666667s; animation-delay: -0.416666666666667s; } .app-loader__spinner div:nth-child(8) { -webkit-transform: rotate(210deg); transform: rotate(210deg); -webkit-animation-delay: -0.333333333333333s; animation-delay: -0.333333333333333s; } .app-loader__spinner div:nth-child(9) { -webkit-transform: rotate(240deg); transform: rotate(240deg); -webkit-animation-delay: -0.25s; animation-delay: -0.25s; } .app-loader__spinner div:nth-child(10) { -webkit-transform: rotate(270deg); transform: rotate(270deg); -webkit-animation-delay: -0.166666666666667s; animation-delay: -0.166666666666667s; } .app-loader__spinner div:nth-child(11) { -webkit-transform: rotate(300deg); transform: rotate(300deg); -webkit-animation-delay: -0.083333333333333s; animation-delay: -0.083333333333333s; } .app-loader__spinner div:nth-child(12) { -webkit-transform: rotate(330deg); transform: rotate(330deg); -webkit-animation-delay: 0s; animation-delay: 0s; } .app-loader__spinner { width: 40px; height: 40px; -webkit-transform: translate(-20px, -20px) scale(0.2) translate(20px, 20px); transform: translate(-20px, -20px) scale(0.2) translate(20px, 20px); } </style> </head> <body> <div id="app-loader" class="app-loader"> <div id="spinner" class="app-loader__spinner"> <div></div><div></div><div></div><div></div><div></div><div></div><div> </div><div></div><div></div><div></div><div></div><div></div> </div> </div> </body> </html>'),e.close();var n=document.createElement("iframe");n.setAttribute("frameBorder","0"),n.setAttribute("allowtransparency","true"),n.setAttribute("allowpaymentrequest","true"),n.id=randomId(),n.name="paystack-checkout-"+n.id,n.style.cssText="z-index: 999999999999999;background: transparent;border: 0px none transparent;overflow-x: hidden;overflow-y: hidden;margin: 0;padding: 0;-webkit-tap-highlight-color: transparent;-webkit-touch-callout: none;position: fixed;left: 0;top: 0;width: 100%;height: 100%;visibility:hidden;"
//     n.style.display = "none"
//     n.src = config.newCheckoutUrl+"popup"
//     this.iframe = n
//     document.body.appendChild(n)
// }