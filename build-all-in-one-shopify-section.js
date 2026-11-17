const fs = require('fs');
const path = require('path');

const root = 'D:\\Dropshiping';
const cdnBase = 'https://raw.githubusercontent.com/ikervillegitaslopez-source/AquaSphere/main';

const htmlContent = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styleContent = fs.readFileSync(path.join(root, 'css', 'style.css'), 'utf8');
const reviewsContent = fs.readFileSync(path.join(root, 'js', 'reviews-data.js'), 'utf8');
let mainJsContent = fs.readFileSync(path.join(root, 'js', 'main.js'), 'utf8');

// In main.js, adapt asset base and Shopify cart redirect
mainJsContent = mainJsContent.replace(/images\//g, `${cdnBase}/images/`);

// Extract body inner HTML
const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
let bodyInner = bodyMatch ? bodyMatch[1] : htmlContent;

// Replace image src with CDN URLs
bodyInner = bodyInner
  .replace(/src="images\//g, `src="${cdnBase}/images/`)
  .replace(/data-src="images\//g, `data-src="${cdnBase}/images/`)
  .replace(/<script src="js\/reviews-data\.js"><\/script>/g, '')
  .replace(/<script src="js\/main\.js"><\/script>/g, '');

const allInOne = `{% comment %}
  ==============================================================
  AquaSphere™ All-In-One Self-Contained Shopify Section
  File to create in Shopify: sections/aquasphere-landing.liquid
  ==============================================================
{% endcomment %}

<style>
${styleContent}
</style>

<div class="aquasphere-shopify-root">
${bodyInner.trim()}
</div>

<script>
${reviewsContent}
</script>

<script>
${mainJsContent}
</script>

{% schema %}
{
  "name": "AquaSphere Landing Page",
  "settings": [],
  "presets": [
    {
      "name": "AquaSphere Landing Page"
    }
  ]
}
{% endschema %}
`;

fs.writeFileSync(path.join(root, 'aquasphere-section.liquid'), allInOne, 'utf8');
console.log('Successfully generated self-contained aquasphere-section.liquid (' + allInOne.length + ' bytes)');
