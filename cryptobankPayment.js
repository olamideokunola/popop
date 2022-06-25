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
        

        // start payment and get id from CryptoBank API
        // let url = 'http://localhost:4000/payments'
        // const response = await fetch(url, {
        //     method: 'POST',
        //     mode: 'cors',
        //     cache: 'no-cache',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(this.settings)
        // })

        // console.log(response.data)


        // this.iFrame.style.display="none"
        // this.iFrame.src = `https://cryptobank-checkout.netlify.app/?amount=${getAmount()}&vendorId=${getVendorId()}&payerEmail=${getEmail()}`
        this.iFrame.src = `https://cryptobank-checkout.netlify.app/?amount=${getAmount()}&vendorId=${getVendorId()}&payerEmail=${this.settings.email}`

        this.iFrame.sandbox = `allow-scripts allow-same-origin allow-modals allow-popups allow-top-navigation`
        //this.iFrame.src = `http://localhost:3002/?amount=${getAmount()}&vendorId=${getVendorId()}&payerEmail=${this.settings.email}`
        // this.iFrame.referrerPolicy = "origin"
        // this.iFrame.src = `https://cryptobank-checkout.netlify.app/walletConnect`
        
        document.body.appendChild(this.iFrame)
    }

    openIframe() {
        // alert('about to open window')
        
        this.iFrame.open
        // console.log(`domain is: ${this.iFrame.contentDocument.domain}`)
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