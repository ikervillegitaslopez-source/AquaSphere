const fs = require('fs');
const path = require('path');

// 1. Clean index.html
const indexPath = path.join(__dirname, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');
const dateRegex = /\s*<div class="review-date">[^<]*<\/div>/g;
const matches = indexHtml.match(dateRegex);
console.log('Found', matches ? matches.length : 0, 'dates in index.html');
indexHtml = indexHtml.replace(dateRegex, '');
fs.writeFileSync(indexPath, indexHtml, 'utf8');

// 2. Clean main.js
const mainJsPath = path.join(__dirname, 'js', 'main.js');
let mainJs = fs.readFileSync(mainJsPath, 'utf8');
const mainDateRegex = /\s*<div class="review-date">\$\{r\.date\}<\/div>/g;
const mainMatches = mainJs.match(mainDateRegex);
console.log('Found', mainMatches ? mainMatches.length : 0, 'dates in main.js');
mainJs = mainJs.replace(mainDateRegex, '');
fs.writeFileSync(mainJsPath, mainJs, 'utf8');

console.log('Successfully removed all review dates from index.html and main.js');
