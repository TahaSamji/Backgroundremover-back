const express = require("express");
const fileUpload = require("express-fileupload");
const { removeBackground } = require('@imgly/background-removal-node');
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const process = require('process');
const app = express();




app.use(express.static(path.join(process.cwd(), 'public')))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

const corsOptions = {
    origin: "http://localhost:3000", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these methods
    allowedHeaders: ["Content-Type"]
}

app.use(cors(corsOptions));



app.post("/", (req, res) => {
    try {
        if (!req.files || !req.files.uploadFile) {
            return res.status(404).json({ msg: 'No file uploaded' });
        }
        
        const myimage = req.files.uploadFile;
     
     
       
        
        myimage.mv('/tmp/picture.png', async function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            
          

        
        // const filePath = path.join(process.cwd(), '/tmp/picture.png');
        const publicpath = path.join(process.cwd(), 'public/dist');
        // const publicpath = process.cwd();
        // const oImage = fs.readFileSync(filePath);
        // console.log("this is my image",oImage);
        console.log("this is my dir",process.cwd());
        // console.log("this is my public path ",publicpath);
        // console.log(path.join(process.cwd(),'/tmp/picture.png'));
       
     
        const ASSET_PATH = `file://${publicpath}`;
        let config =  {
            publicPath: ASSET_PATH,
            fetchArgs: {
                mode: 'no-cors'
              } 
          };
        let originalblob = new Blob([myimage.data], { type: 'image/png' });
        let blob = await removeBackground(originalblob,config);
     
        console.log("my blob",blob);
        const buffer = Buffer.from(await blob.arrayBuffer());
        const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;
        fs.writeFileSync('tmp/output.png', dataURL.split(';base64,').pop(), { encoding: 'base64' });
    

            const processedImage = fs.readFileSync('/tmp/output.png');
            res.setHeader('Content-Type', 'image/png');

            return res.status(200).send(processedImage);

        });



    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});





const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));