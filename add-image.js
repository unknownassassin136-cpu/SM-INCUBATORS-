const fs = require('fs');
const path = require('path');

const filePath = path.join('C:\\Users\\PAVAN\\.gemini\\antigravity-ide\\scratch\\sm-incubators', 'public/assets/data/products.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newImage = "/assets/images/products/prod1/3.png";

data.forEach(product => {
  if (product.images) {
    if (!product.images.includes(newImage)) {
      product.images.push(newImage);
    }
  } else {
    product.images = [product.image || "", newImage].filter(Boolean);
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Successfully updated all products with the new image!');
