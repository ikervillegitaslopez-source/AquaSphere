const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Convert index.html to a Shopify Liquid page template
// Replace relative paths with Shopify asset_url tags
let liquidContent = htmlContent
  // CSS link
  .replace('<link rel="stylesheet" href="css/style.css">', "{{ 'style.css' | asset_url | stylesheet_tag }}")
  // Scripts
  .replace('<script src="js/reviews-data.js"></script>', "{{ 'reviews-data.js' | asset_url | script_tag }}")
  .replace('<script src="js/main.js"></script>', "{{ 'main.js' | asset_url | script_tag }}")
  // Product & general images
  .replace(/src="images\/([^"]+)"/g, 'src="{{ \'$1\' | asset_url }}"')
  .replace(/data-src="images\/([^"]+)"/g, 'data-src="{{ \'$1\' | asset_url }}"');

fs.writeFileSync(path.join(__dirname, 'shopify-page-template.liquid'), liquidContent, 'utf8');
console.log('Successfully created shopify-page-template.liquid');
