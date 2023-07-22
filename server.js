const express = require('express')
const { PORT,API_KEY } = require("./config")
const cors = require('cors')
const Moralis = require('moralis').default
const { EvmChain } = require("moralis/common-evm-utils");
const solanaWeb3 = require('@solana/web3.js');
const { default: mongoose } = require('mongoose');
require('dotenv').config()


const app = express()


app.use(cors())
app.use(express.json())


// Replace with the appropriate values
const senderPublicKey = '';
const senderPrivateKey = '';
const recipientPublicKey = '3XDRZjXLVSwjfa5HRysJWm1YdjrHzsFFJzNTKzN7yDeF';
const amount = solanaWeb3.LAMPORTS_PER_SOL/10;

// Connect to a Solana cluster
const connection = new solanaWeb3.Connection(
  solanaWeb3.clusterApiUrl('devnet'),
  'singleGossip'
);

app.use('/api', require("./routes/imageProcessing"))

app.get('/', async (req,res) => {

    try {
        res.status(200).send("Hello World ")
    } catch (error) {
        res.status(500).send("Error \t",error)
        console.log("Error : ",error)
    }

})

app.get('/api/getallnfts', async (req,res) => {
    try {
        const {query} = req

        console.log("Address ..\t",query)

        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address : query.address,
            chain : EvmChain.ETHEREUM
        })

        return res.status(200).json(response)

    } catch (error) {
        console.log("Something Went Wrong\t",error,"\n")
        return res.status(404).json()
    }
})


app.post('/sendTransaction', async (req, res) => {
    try {
      // Create a transaction object
      const transaction = new solanaWeb3.Transaction().add(
        solanaWeb3.SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipientPublicKey,
          lamports: amount,
        })
      );
  
      // Sign the transaction using a private key
      transaction.feePayer = senderPublicKey;
      const signers = [
        {
          publicKey: senderPublicKey,
          secretKey: solanaWeb3.Buffer.from(senderPrivateKey, 'base64'),
        },
      ];
      transaction.recentBlockhash = (
        await connection.getRecentBlockhash('singleGossip')
      ).blockhash;
      transaction.partialSign(...signers);
    // Send the transaction
    const signature = await connection.sendRawTransaction(
        transaction.serialize()
      );
      console.log(`Transaction ${signature} sent`);
  
      res.status(200).send(`Transaction ${signature} sent`);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error sending transaction');
    }
  });
    



Moralis.start({
    apiKey:API_KEY,
})

const URI = process.env.MONGO_URL;
console.log(URI)
mongoose.connect(URI, { useNewUrlParser: true }).then(() => {
  console.log(URI);
  app.listen(process.env.PORT, () => {
    console.log("Server is running on port", process.env.PORT);
  });
});