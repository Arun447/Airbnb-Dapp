import WalletConnect from '@walletconnect/browser'
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal'

let walletConnector = null
let accountAddress = null

export const initWalletConnect = () => {
  // Create a walletConnector
  walletConnector = new WalletConnect({
    bridge: 'https://bridge.walletconnect.org', // Required
  })

  // Check if connection is already established
  if (!walletConnector.connected) {
    // create new session
    walletConnector.createSession().then(() => {
      // get uri for QR Code modal
      const uri = walletConnector.uri
      // display QR Code modal
      WalletConnectQRCodeModal.open(uri, () => {
        console.log('QR Code Modal closed')
      })
    })
  }
  // Subscribe to Events

  walletConnector.on('connect', (error, payload) => {
    if (error) {
      throw error
    }

    // Close QR Code Modal
    WalletConnectQRCodeModal.close()

    // Get provided accounts and chainId
    const { accounts, chainId } = payload.params[0]
    accountAddress = accounts[0]
  })


}


export async function sampleTx() {
  // Draft transaction
  const tx = {
    from: "0xbc28Ea04101F03aA7a94C1379bc3AB32E65e62d3", // Required
    to: "0x89D24A7b4cCB1b6fAA2625Fe562bDd9A23260359", // Required (for non contract deployments)
    data: "0x", // Required
    gasPrice: "0x02540be400", // Optional
    gasLimit: "0x9c40", // Optional
    value: "0x00", // Optional
    nonce: "0x0114" // Optional
  };
  
  // Sign transaction
  walletConnector
    .signTransaction(tx)
    .then(result => {
      // Returns signed transaction
      console.log(result);
    })
    .catch(error => {
      // Error returned when rejected
      console.error(error);
    });
  
}
