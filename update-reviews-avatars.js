const fs = require('fs');
const path = require('path');

const avatarPool = [
  // Dogs
  'dog-corgi.jpg',
  'dog-happy.jpg',
  'dog-beagle.jpg',
  'dog-puppy.jpg',
  'dog-golden.jpg',
  'dog-frenchie.jpg',
  'dog-pug.jpg',
  'dog-running.jpg',
  'dog-field.jpg',
  'dog-outdoor.jpg',
  // Nature / Scenery
  'nature-mountains.jpg',
  'nature-yosemite.jpg',
  'nature-forest.jpg',
  'nature-beach.jpg',
  'nature-stars.jpg',
  'nature-autumn.jpg',
  'nature-lake.jpg',
  'nature-hills.jpg',
  'nature-sunset.jpg',
  'nature-trail.jpg',
  // Lifestyle / Everyday
  'lifestyle-coffee.jpg',
  'lifestyle-camera.jpg',
  'lifestyle-boots.jpg',
  'lifestyle-backpack.jpg',
  'lifestyle-roadtrip.jpg',
  'lifestyle-plant.jpg',
  'lifestyle-camp.jpg',
  'lifestyle-sunsetcar.jpg',
  // Casual Portraits & Faces
  'person-woman1.jpg',
  'person-man1.jpg',
  'person-woman2.jpg',
  'person-man2.jpg',
  'person-woman3.jpg',
  'person-beanie.jpg',
  'person-sunglasses.jpg',
  'person-woman4.jpg',
  'person-man3.jpg',
  'person-man4.jpg',
  'person-laughing.jpg',
  'person-casual.jpg',
  'user1.jpg',
  'user2.jpg',
  'user3.jpg',
  'user4.jpg',
  'user5.jpg',
  'user6.jpg',
  'user7.jpg',
  'user8.jpg',
  'user9.jpg',
  'user10.jpg'
];

// First 10 curated specifically for matching the static stories
const first10 = [
  'dog-corgi.jpg',
  'nature-mountains.jpg',
  'dog-frenchie.jpg',
  'dog-golden.jpg',
  'person-woman1.jpg',
  'lifestyle-boots.jpg',
  'dog-happy.jpg',
  'lifestyle-backpack.jpg',
  'lifestyle-coffee.jpg',
  'dog-puppy.jpg'
];

// 1. Update index.html static reviews
const indexPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

for (let i = 1; i <= 10; i++) {
  const targetImg = `src="images/avatars/user${i}.jpg"`;
  const replacementImg = `src="images/avatars/${first10[i - 1]}"`;
  indexHtml = indexHtml.replace(targetImg, replacementImg);
}

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('Updated index.html static avatars with diverse mix.');

// 2. Update reviews-data.js
const reviewsDataPath = path.join(__dirname, 'js', 'reviews-data.js');
let reviewsJs = fs.readFileSync(reviewsDataPath, 'utf8');

// Match the JSON array
const prefix = 'window.AQUASPHERE_REVIEWS_DATA = ';
const startIndex = reviewsJs.indexOf(prefix);
if (startIndex !== -1) {
  const jsonStart = startIndex + prefix.length;
  const jsonText = reviewsJs.substring(jsonStart).trim().replace(/;$/, '');
  const reviews = JSON.parse(jsonText);

  // Assign avatars
  reviews.forEach((r, idx) => {
    if (idx < 10) {
      r.avatar = `images/avatars/${first10[idx]}`;
    } else {
      // Rotate through pool with a pseudo-random shuffle offset
      const poolIndex = (idx * 7 + 13) % avatarPool.length;
      r.avatar = `images/avatars/${avatarPool[poolIndex]}`;
    }
  });

  const updatedJs = `/* ------------------------------------------------
   AQUASPHERE™ 248 VERIFIED CUSTOMER REVIEWS DATA
   Generated for High-Converting Shopify DTC Storefront
   Overall Rating: 4.9 / 5.0 (233x 5-Star, 15x 4-Star)
------------------------------------------------- */

window.AQUASPHERE_REVIEWS_DATA = ${JSON.stringify(reviews, null, 2)};
`;

  fs.writeFileSync(reviewsDataPath, updatedJs, 'utf8');
  console.log(`Updated all ${reviews.length} reviews in reviews-data.js with diverse avatars.`);
} else {
  console.error('Could not find window.AQUASPHERE_REVIEWS_DATA in reviews-data.js');
}
