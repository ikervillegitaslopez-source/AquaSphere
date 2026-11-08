const https = require('https');
const fs = require('fs');
const path = require('path');

const avatars = [
  // Dogs / Puppies (10)
  { name: 'dog-corgi.jpg', id: '1543466835-00a7907e9de1' },
  { name: 'dog-happy.jpg', id: '1583511655857-d19b40a7a54e' },
  { name: 'dog-beagle.jpg', id: '1537151625747-768eb6cf92b2' },
  { name: 'dog-puppy.jpg', id: '1561037404-61cd46aa615b' },
  { name: 'dog-golden.jpg', id: '1552053831-71594a27632d' },
  { name: 'dog-frenchie.jpg', id: '1517849845537-4d257902454a' },
  { name: 'dog-pug.jpg', id: '1583337130417-3346a1be7dee' },
  { name: 'dog-running.jpg', id: '1548199973-03cce0bbc87b' },
  { name: 'dog-field.jpg', id: '1530281700549-e82e7bf110d6' },
  { name: 'dog-outdoor.jpg', id: '1587300003388-59208cc962cb' },

  // Nature & Scenery (10)
  { name: 'nature-mountains.jpg', id: '1464822759023-fed622ff2c3b' },
  { name: 'nature-yosemite.jpg', id: '1506744038136-46273834b3fb' },
  { name: 'nature-forest.jpg', id: '1470071459604-3b5ec3a7fe05' },
  { name: 'nature-beach.jpg', id: '1507525428034-b723cf961d3e' },
  { name: 'nature-stars.jpg', id: '1519681393784-d120267933ba' },
  { name: 'nature-autumn.jpg', id: '1447752875215-b2761acb3c5d' },
  { name: 'nature-lake.jpg', id: '1426604966848-d7adac402bff' },
  { name: 'nature-hills.jpg', id: '1472214103451-9374bd1c798e' },
  { name: 'nature-sunset.jpg', id: '1507525428034-b723cf961d3e' },
  { name: 'nature-trail.jpg', id: '1441974231531-c6227db76b6e' },

  // Lifestyle & Objects (8)
  { name: 'lifestyle-coffee.jpg', id: '1509042239860-f550ce710b93' },
  { name: 'lifestyle-camera.jpg', id: '1510812431401-41d2bd2722f3' },
  { name: 'lifestyle-boots.jpg', id: '1527631746610-bca00a040d60' },
  { name: 'lifestyle-backpack.jpg', id: '1526778548025-fa2f459cd5c1' },
  { name: 'lifestyle-roadtrip.jpg', id: '1506880018603-83d5b814b5a6' },
  { name: 'lifestyle-plant.jpg', id: '1489710437720-ebb67ec84dd2' },
  { name: 'lifestyle-camp.jpg', id: '1510312305653-8ed496efae75' },
  { name: 'lifestyle-sunsetcar.jpg', id: '1492144534655-ae79c964c9d7' },

  // Casual Portraits & Faces (12)
  { name: 'person-woman1.jpg', id: '1534528741775-53994a69daeb' },
  { name: 'person-man1.jpg', id: '1507003211169-0a1dd7228f2d' },
  { name: 'person-woman2.jpg', id: '1494790108377-be9c29b29330' },
  { name: 'person-man2.jpg', id: '1500648767791-00dcc994a43e' },
  { name: 'person-woman3.jpg', id: '1517841905240-472988babdf9' },
  { name: 'person-beanie.jpg', id: '1539571696357-5a69c17a67c6' },
  { name: 'person-sunglasses.jpg', id: '1524504388940-b1c1722653e1' },
  { name: 'person-woman4.jpg', id: '1544005313-94ddf0286df2' },
  { name: 'person-man3.jpg', id: '1506794778202-cad84cf45f1d' },
  { name: 'person-man4.jpg', id: '1519085360753-af0119f7cbe7' },
  { name: 'person-laughing.jpg', id: '1488426862026-3ee34a7d66df' },
  { name: 'person-casual.jpg', id: '1522075469751-3a6694fb2f61' }
];

const destDir = path.join(__dirname, 'images', 'avatars');
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function download(item) {
  return new Promise((resolve, reject) => {
    const url = `https://images.unsplash.com/photo-${item.id}?auto=format&fit=crop&w=200&h=200&q=80`;
    const dest = path.join(destDir, item.name);

    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          const file = fs.createWriteStream(dest);
          redirectRes.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${item.name}`);
            resolve();
          });
        }).on('error', reject);
        return;
      }

      if (res.statusCode !== 200) {
        console.error(`Failed ${item.name}: status ${res.statusCode}`);
        return resolve(); // don't reject to let others continue
      }

      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${item.name}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${item.name}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  console.log(`Downloading ${avatars.length} diverse avatars...`);
  for (const item of avatars) {
    await download(item);
  }
  console.log('All avatar downloads completed.');
}

run();
