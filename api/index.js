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
    origin: "https://backgroundremover-beta.vercel.app", // Allow requests from this origin
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

            const publicpath = path.join(process.cwd(), 'public/dist');

            const ASSET_PATH = `file://${publicpath}`;

            let config = {
                publicPath: ASSET_PATH,
                fetchArgs: {
                    mode: 'no-cors'
                }
            };

            let originalblob = new Blob([myimage.data], { type: 'image/png' });
            let myblob = await removeBackground(originalblob, config);
            const buffer = await new Response(myblob).arrayBuffer();
            const base64String = Buffer.from(buffer).toString('base64');
            return res.status(200).json({ data: base64String });

        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
});





const PORT = 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));