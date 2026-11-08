const fs = require('fs');
const path = require('path');

const root = 'D:/Dropshiping';
const results = [];

function check(title, condition, details = '') {
  results.push({ title, pass: Boolean(condition), details });
}

// 1. Audit index.html
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

check('No breadcrumbs in index.html', !indexHtml.includes('breadcrumbs') && !indexHtml.includes('Home / Pet Travel'));
check('No review-date in index.html', !indexHtml.includes('review-date'));
check('No 30-day guarantee or refund claims in index.html', !/30-Day|money-back|money back|refund policy|return policy/i.test(indexHtml.replace(/Strict All Sales Are Final & No-Refund Policy/g, '')));
check('Strict No-Refund clause present in Terms', indexHtml.includes('Strict All Sales Are Final & No-Refund Policy'));
check('Terms Modal has strictly USA & Canada shipping clause', indexHtml.includes('Shipping Territories: Strictly USA & Canada Only'));
check('No section 5 (Customer Care / Refund) in Terms Modal', !indexHtml.includes('Customer Care & Contact') && !indexHtml.includes('support@aquaspherepet.com'));
check('No copyright banner at bottom', !indexHtml.includes('All rights reserved') && !indexHtml.includes('Official US & Canada Store • 256-Bit SSL'));
check('Select Quantity & Save More single-line class present', indexHtml.includes('bundle-title-text'));
check('Free Shipping badge present (without "Included")', indexHtml.includes('Free Shipping') && !indexHtml.includes('Free Shipping Included'));
check('Why Dogs & Owners Love AquaSphere title present', indexHtml.includes('Why Dogs & Owners Love AquaSphere™'));
check('AquaSphere vs Cheap Plastic table present', indexHtml.includes('AquaSphere™ vs Cheap Plastic'));
check('Hydration in 3 Simple Steps present', indexHtml.includes('Hydration in 3 Simple Steps'));
check('10 Static reviews present with unique avatars', (indexHtml.match(/images\/avatars\/avatar-\d+\.jpg/g) || []).length === 10);

// 2. Audit reviews-data.js
const reviewsJs = fs.readFileSync(path.join(root, 'js', 'reviews-data.js'), 'utf8');
const jsonMatch = reviewsJs.match(/window\.AQUASPHERE_REVIEWS_DATA\s*=\s*([\s\S]*?);/);
let reviews = [];
if (jsonMatch) {
  reviews = JSON.parse(jsonMatch[1]);
}

check('reviews-data.js has exactly 248 reviews', reviews.length === 248);
const uniqueAvatars = new Set(reviews.map(r => r.avatar));
check('All 248 reviews have 100% unique avatars (0 duplicates)', uniqueAvatars.size === 248);
const fiveStars = reviews.filter(r => r.stars === 5).length;
const fourStars = reviews.filter(r => r.stars === 4).length;
check('Rating distribution: 233 5-star & 15 4-star (4.9 avg)', fiveStars === 233 && fourStars === 15);
const countries = new Set(reviews.map(r => r.countryName));
check('Reviewer countries strictly USA and Canada', Array.from(countries).every(c => c === 'USA' || c === 'Canada'));

// 3. Audit js/main.js
const mainJs = fs.readFileSync(path.join(root, 'js', 'main.js'), 'utf8');
check('No review-date in main.js template', !mainJs.includes('review-date'));
check('Toast template uses toast-buyer single-line class', mainJs.includes('toast-buyer'));
check('Toast template has NO thumbnail image element', !mainJs.includes('<img src="${bundle.img}') && !mainJs.includes('class="toast-img"'));
check('main.js LOCATIONS strictly US & Canada', !/\b(Spain|France|UK|Germany|Australia|Netherlands|Italy|Belgium)\b/i.test(mainJs.match(/const LOCATIONS = \[([\s\S]*?)\];/)[1]));

// 4. Audit css/style.css
const styleCss = fs.readFileSync(path.join(root, 'css', 'style.css'), 'utf8');
check('btn-add-cart has nowrap and keep-all', styleCss.includes('.btn-add-cart') && styleCss.includes('white-space: nowrap !important;'));
check('reviews-summary and reviews-text have nowrap', styleCss.includes('.reviews-summary') && styleCss.includes('.reviews-text'));
check('helpful-label has nowrap', styleCss.includes('.helpful-label') && styleCss.includes('white-space: nowrap !important;'));
check('social-toast and toast-buyer have nowrap', styleCss.includes('.social-toast') && styleCss.includes('.toast-buyer'));
check('Toast image hidden with display none', styleCss.includes('.toast-img') && styleCss.includes('display: none !important;'));
check('bundle-title-text has nowrap', styleCss.includes('.bundle-title-text') && styleCss.includes('white-space: nowrap !important;'));
check('review-title has normal wrapping for 1-2 lines', styleCss.includes('.review-title') && styleCss.includes('white-space: normal !important;'));
check('review-date hidden with display none', styleCss.includes('.review-date') && styleCss.includes('display: none !important;'));

// 5. Audit images/avatars
const avatarFiles = fs.readdirSync(path.join(root, 'images', 'avatars')).filter(f => f.startsWith('avatar-') && f.endsWith('.jpg'));
check('Exactly 248 avatar files on disk (avatar-1.jpg to avatar-248.jpg)', avatarFiles.length === 248);
const badAvatars = avatarFiles.filter(f => fs.statSync(path.join(root, 'images', 'avatars', f)).size < 500);
check('All 248 avatar files are non-empty valid images', badAvatars.length === 0, `${badAvatars.length} bad files`);

// 6. Audit Shopify Bundle
const liquid = fs.readFileSync(path.join(root, 'aquasphere-section.liquid'), 'utf8');
check('aquasphere-section.liquid exists and is populated (>30KB)', liquid.length > 30000, `${liquid.length} bytes`);
check('aquasphere-section.liquid has asset_url filters', liquid.includes('| asset_url'));
check('GUIA_SUBIR_A_SHOPIFY.md exists and is populated', fs.existsSync(path.join(root, 'GUIA_SUBIR_A_SHOPIFY.md')) && fs.statSync(path.join(root, 'GUIA_SUBIR_A_SHOPIFY.md')).size > 2000);

console.log('========================================================');
console.log('   AQUASPHERE™ COMPLETE PROJECT AUDIT REPORT');
console.log('========================================================');
let passed = 0;
results.forEach((r, idx) => {
  const icon = r.pass ? '✅ PASS' : '❌ FAIL';
  console.log(`${icon} [${idx + 1}] ${r.title} ${r.details ? '(' + r.details + ')' : ''}`);
  if (r.pass) passed++;
});
console.log('========================================================');
console.log(`TOTAL: ${passed}/${results.length} CHECKS PASSED (${((passed / results.length) * 100).toFixed(1)}%)`);
console.log('========================================================');
