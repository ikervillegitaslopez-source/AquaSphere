const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

// Extract body inner HTML
const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
const bodyInner = bodyMatch ? bodyMatch[1] : htmlContent;

// Build section template
let sectionContent = `{% comment %}
  ==============================================================
  AquaSphere™ High-Converting Shopify Section
  File to create in Shopify: sections/aquasphere-landing.liquid
  ==============================================================
{% endcomment %}

{{ 'style.css' | asset_url | stylesheet_tag }}

<div class="aquasphere-shopify-root">
${bodyInner.trim()}
</div>

<script>
  window.AQUASPHERE_ASSET_BASE = "{{ 'aquasphere-base-asset.png' | asset_url }}".replace(/aquasphere-base-asset\\.png(\\?.*)?$/, '');
</script>

{{ 'reviews-data.js' | asset_url | script_tag }}
{{ 'main.js' | asset_url | script_tag }}

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

// Replace image sources with Shopify asset_url filter (handling subdirectories like avatars/ and icons/)
sectionContent = sectionContent
  .replace(/src="images\/(?:avatars\/|icons\/)?([^"]+)"/g, 'src="{{ \'$1\' | asset_url }}"')
  .replace(/data-src="images\/(?:avatars\/|icons\/)?([^"]+)"/g, 'data-src="{{ \'$1\' | asset_url }}"')
  .replace(/<script src="js\/reviews-data\.js"><\/script>/g, '')
  .replace(/<script src="js\/main\.js"><\/script>/g, '');

fs.writeFileSync(path.join(__dirname, 'aquasphere-section.liquid'), sectionContent, 'utf8');

console.log('Successfully generated aquasphere-section.liquid');
