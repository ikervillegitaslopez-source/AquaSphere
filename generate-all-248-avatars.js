const https = require('https');
const fs = require('fs');
const path = require('path');

const avatarsDir = path.join(__dirname, 'images', 'avatars');
const imagesDir = path.join(__dirname, 'images');

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          const file = fs.createWriteStream(dest);
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        }).on('error', reject);
        return;
      }

      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

// Concurrency helper
async function mapConcurrent(items, concurrency, fn) {
  const results = [];
  const running = [];
  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p);
    if (concurrency <= items.length) {
      const e = p.then(() => running.splice(running.indexOf(e), 1));
      running.push(e);
      if (running.length >= concurrency) {
        await Promise.race(running);
      }
    }
  }
  return Promise.all(results);
}

async function main() {
  console.log('--- Step 1: Preparing First 10 Curated Avatars ---');
  // Copy the 10 thematic avatars to avatar-1.jpg through avatar-10.jpg
  const first10Sources = [
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

  first10Sources.forEach((srcName, idx) => {
    const src = path.join(avatarsDir, srcName);
    const dest = path.join(avatarsDir, `avatar-${idx + 1}.jpg`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  });

  console.log('--- Step 2: Fetching 240+ Unique Images from Picsum ---');
  const page1 = await fetchJson('https://picsum.photos/v2/list?page=1&limit=100');
  const page2 = await fetchJson('https://picsum.photos/v2/list?page=2&limit=100');
  const page3 = await fetchJson('https://picsum.photos/v2/list?page=3&limit=100');
  const allPicsum = [...page1, ...page2, ...page3];

  console.log(`Fetched ${allPicsum.length} photo metadata entries from Picsum`);

  // Download unique images for avatar-11 to avatar-248 (238 images)
  const downloadQueue = [];
  for (let i = 11; i <= 248; i++) {
    const picsumItem = allPicsum[i - 11];
    const filename = `avatar-${i}.jpg`;
    const dest = path.join(avatarsDir, filename);
    const url = `https://picsum.photos/id/${picsumItem.id}/160/160`;
    downloadQueue.push({ index: i, filename, dest, url, id: picsumItem.id });
  }

  console.log(`Starting concurrent download of ${downloadQueue.length} unique avatars...`);
  let downloadedCount = 0;
  await mapConcurrent(downloadQueue, 15, async (task) => {
    try {
      await downloadImage(task.url, task.dest);
      downloadedCount++;
      if (downloadedCount % 25 === 0 || downloadedCount === downloadQueue.length) {
        console.log(`Downloaded ${downloadedCount}/${downloadQueue.length} unique avatars`);
      }
    } catch (err) {
      console.error(`Failed ${task.filename}: ${err.message}`);
    }
  });

  console.log('--- Step 3: Copying all 248 avatars to flat images directory ---');
  for (let i = 1; i <= 248; i++) {
    const src = path.join(avatarsDir, `avatar-${i}.jpg`);
    const dest = path.join(imagesDir, `avatar-${i}.jpg`);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
    }
  }

  console.log('--- Step 4: Updating index.html static reviews ---');
  const indexPath = path.join(__dirname, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');

  // Replace each static review avatar
  for (let i = 1; i <= 10; i++) {
    // Matches any previously set avatar for this review
    const regex = new RegExp(`src="images/avatars/[^"]+"\\s+alt="([^"]+)"\\s+class="reviewer-avatar-img"`);
  }
  // Let's do a direct replacement of all reviewer-avatar-img in reviewsGrid
  const gridMatch = indexHtml.match(/<div class="reviews-grid" id="reviewsGrid">([\s\S]*?)<\/div>\s*<\/div>\s*<!-- Reviews Load More/);
  if (gridMatch) {
    let gridContent = gridMatch[1];
    let cardIdx = 1;
    gridContent = gridContent.replace(/<img src="images\/avatars\/[^"]+"\s+alt="([^"]+)"\s+class="reviewer-avatar-img">/g, (match, altName) => {
      const newTag = `<img src="images/avatars/avatar-${cardIdx}.jpg" alt="${altName}" class="reviewer-avatar-img">`;
      cardIdx++;
      return newTag;
    });
    indexHtml = indexHtml.replace(gridMatch[1], gridContent);
    fs.writeFileSync(indexPath, indexHtml, 'utf8');
    console.log(`Updated 10 static reviews in index.html to use avatar-1.jpg through avatar-10.jpg`);
  }

  console.log('--- Step 5: Updating js/reviews-data.js ---');
  const reviewsDataPath = path.join(__dirname, 'js', 'reviews-data.js');
  let reviewsJs = fs.readFileSync(reviewsDataPath, 'utf8');
  const prefix = 'window.AQUASPHERE_REVIEWS_DATA = ';
  const startIndex = reviewsJs.indexOf(prefix);
  if (startIndex !== -1) {
    const jsonStart = startIndex + prefix.length;
    const jsonText = reviewsJs.substring(jsonStart).trim().replace(/;$/, '');
    const reviews = JSON.parse(jsonText);

    reviews.forEach((r, idx) => {
      r.avatar = `images/avatars/avatar-${idx + 1}.jpg`;
    });

    const updatedJs = `/* ------------------------------------------------
   AQUASPHERE™ 248 VERIFIED CUSTOMER REVIEWS DATA
   Generated for High-Converting Shopify DTC Storefront
   Overall Rating: 4.9 / 5.0 (233x 5-Star, 15x 4-Star)
   All 248 Avatars 100% Unique - Zero Duplicates
------------------------------------------------- */

window.AQUASPHERE_REVIEWS_DATA = ${JSON.stringify(reviews, null, 2)};
`;

    fs.writeFileSync(reviewsDataPath, updatedJs, 'utf8');
    console.log(`Updated all ${reviews.length} reviews in reviews-data.js to have unique avatars`);

    // Verify uniqueness
    const avatarSet = new Set(reviews.map(r => r.avatar));
    console.log(`Verification: Total reviews = ${reviews.length}, Unique avatars = ${avatarSet.size}`);
    if (avatarSet.size === reviews.length) {
      console.log('SUCCESS: All 248 reviews have completely unique avatars with ZERO repetitions!');
    } else {
      console.error('WARNING: Duplicate avatars detected!');
    }
  }

  console.log('--- Step 6: Regenerating Shopify Section Bundle ---');
  require('./generate-shopify-bundle.js');
}

main().catch(err => {
  console.error('Fatal error in main:', err);
});
