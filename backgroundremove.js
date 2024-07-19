const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');

async function main() {
   
       
        const imgSource ="images/person.webp";
        const blob = await removeBackground(imgSource);
        const buffer = Buffer.from(await blob.arrayBuffer());

        const dataURL = `data:image/png;base64,${buffer.toString("base64")}`; 
        fs.writeFileSync('images/output.png', dataURL.split(';base64,').pop(), { encoding: 'base64' });

       
        console.log('Background removed successfully.');
   
}

main();