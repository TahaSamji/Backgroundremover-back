const express = require("express");
const fileUpload = require("express-fileupload");
const { removeBackground } = require('@imgly/background-removal-node');
const cors = require("cors");
const fs = require('fs');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

const corsOptions = {
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
    allowedHeaders: ["Content-Type"]
}

app.use(cors(corsOptions));

async function main(originalblob) {
    console.log("originalblob",originalblob)
    let myblob = await removeBackground(originalblob);
    // console.log("myblob",myblob);
    // const buffer = Buffer.from(await blob.arrayBuffer());
    // const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;
    // fs.writeFileSync('tmp/output.png', dataURL.split(';base64,').pop(), { encoding: 'base64' });
return myblob;
}


// app.get("/", (req, res) =>{
//    try {
//     res.json("running on express");
//    } catch (error) {
    
//    }
// }

    // "routes": [
    //  {
    //   "src": "/(.*)",
    //   "dest": "index.js",
    //   "methods" :["POST","GET","DELETE","PUT","OPTIONS"]
    //  }
    // ],

// );
app.post("/", (req, res) => {
    try {
        if (!req.files || !req.files.uploadFile) {
            return res.status(404).json({ msg: 'No file uploaded' });
        }
        
        const myimage = req.files.uploadFile;
     
        let originalblob = new Blob([myimage.data], { type: 'image/png' });
          
        myimage.mv('/tmp/picture.png', async function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            
          
           const myblob =  await main(originalblob);
           console.log("same another",myblob);
           const buffer = await new Response(myblob).arrayBuffer();
           const base64String = Buffer.from(buffer).toString('base64');

            // const processedImage = fs.readFileSync('tmp/output.png');
            // res.setHeader('Content-Type', 'application/octet-stream');

            return res.status(200).json({data:base64String});

        });



    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});





const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
