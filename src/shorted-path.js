// Requires the file system library
const fs = require('fs');

// Load the data files
const available = JSON.parse(fs.readFileSync('../data/availability.json', 'utf8'));
const need = JSON.parse(fs.readFileSync('../data/need.json', 'utf8'));
const connectedCountry = JSON.parse(fs.readFileSync('../data/connected-countries-all-possibilities.json', 'utf8'));

// Configs the output file
// Notes: it must exist before running
// const outFile = '../out/transfer.csv';
// const outFile = '../out/transfer-neighbours-only.csv';
const outFile = '../out/transfer-all-possibilities.csv';

// Clears the file so it doesn't have old content
fs.truncateSync(outFile);

// Set the CSV columns
const columnHeads = 'origin,destination,amount\n';
fs.appendFileSync(outFile, columnHeads);

// Sort the neighbouring countries from closest to furthest
// so it reduces the logistical costs
for (const country in connectedCountry) {
  connectedCountry[country] = connectedCountry[country].sort((a, b) => a[1] - b[1]);
}

// Creates a dictionary to store the difference between the availability and the needs
const difference = {};

for (const country in available) {
  difference[country] = available[country] - need[country];
}

function distribute(origin, destination) {
  // If it needs more than it has
  if (difference[origin] <= 0) return;

  // If it doesn't need
  if (difference[destination] >= 0) return;

  let sentAmount = 0;

  if (difference[origin] >= Math.abs(difference[destination])) {
    sentAmount = Math.abs(difference[destination]);
    difference[origin] -= sentAmount;
    difference[destination] += sentAmount;
  } else {
    sentAmount = difference[origin];
    difference[destination] += sentAmount;
    difference[origin] = 0;
  }

  const transferLog = `${origin},${destination},${sentAmount}\n`;
  fs.appendFileSync(outFile, transferLog);
}

function shareResources() {
  for (const country in connectedCountry) {
    const listOfConnectedCountries = connectedCountry[country];
    let nextCountryToSendIndex = 0;

    while (difference[country] > 0) {
      if (!listOfConnectedCountries[nextCountryToSendIndex + 1]) break;
      const nextCountryKey = listOfConnectedCountries[nextCountryToSendIndex++][0];
      distribute(country, nextCountryKey);
    }
  }
}

shareResources();

// console.log(difference)
