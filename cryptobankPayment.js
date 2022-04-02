class CryptoBankPopup {

    iFrame = document.createElement('iframe')
    settings = null

    setup(options) {
        console.log(`in setup`)
        this.settings = {
            key: options.key,
            email: options.email,
            amount: options.amount,
            currency: options.currency,
            ref: options.ref,
            vendorId: options.vendorId,
        }

        this.callback = options.callback
        this.onClose = options.onClose

        console.log(this.settings)

        this.setupIframe()
    }

    setupIframe() {
        console.log(`in openIframe`)
        this.iFrame.setAttribute("frameBorder", "0")
        this.iFrame.setAttribute("allowtransparency", "true")
        this.iFrame.setAttribute('id', "payment-iframe")
        this.iFrame.name = "cryptobank-payment"
        
        this.iFrame.style.cssText = "z-index: 999999999999999;background: transparent;background: rgba(0,0,0,0.5);border: 0px none transparent;overflow-x: hidden;overflow-y: hidden;margin: 0;-webkit-tap-highlight-color: transparent;-webkit-touch-callout: none;position: fixed;left: 0;top: 0px;width: 100%;height: 100%;"
        
        // this.iFrame.style.display="none"
        this.iFrame.src = `https://cryptobank-checkout.netlify.app/?amount=${getAmount()}&vendorId=${getVendorId()}&payerEmail=${getEmail()}`
        
        document.body.appendChild(this.iFrame)
    }

    openIframe() {
        console.log('about to open window')
        this.iFrame.open
    }

    callback() {

    }

    onClose() {

    }

    closeIframe() {
        // close iframe
        document.body.removeChild(this.iFrame)
    }
}

let cryptoBankPopup = new CryptoBankPopup()

window.onmessage = function (event) {
    if (event.data.success && event.data.msg === 'payment-complete') {
        cryptoBankPopup.closeIframe()
        cryptoBankPopup?.callback(event.data)
        console.log(event.origin)
    } else if (event.data.success && event.data.msg === 'close') {
        cryptoBankPopup.closeIframe()
        cryptoBankPopup?.onClose()
        console.log(event.origin)
    }
}