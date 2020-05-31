const fs = require('fs');

const available = JSON.parse(fs.readFileSync('../data/availability.json', 'utf8'));
const need = JSON.parse(fs.readFileSync('../data/need.json', 'utf8'));
const connectedCountry = JSON.parse(fs.readFileSync('../data/connected-countries.json', 'utf8'));

// Sort the neighbouring countries from closest to furthest
for (const country in connectedCountry) {
  connectedCountry[country] = connectedCountry[country].sort((a, b) => a[1] - b[1]);
  console.log(connectedCountry[country])
}

const outFile = '../out/transfer.csv';

fs.truncateSync(outFile);

const difference = {};

for (const country in available) {
  difference[country] = available[country] - need[country];
  // console.log(`Difference of ${country} = ${available[country]} - ${need[country]} = ${available[country] - need[country]} (${difference[country]})`)
  
  // List of country that needs
  // if (difference[country] < 0) console.log(country)
}

const columnHeads = 'origin,destination,amount\n';
fs.appendFileSync(outFile, columnHeads);

// console.log(difference)

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

  // const transferLog = `Send from: ${origin} -to-> ${destination} ${sentAmount} (${difference[origin]} left)\n`;
  const transferLog = `${origin},${destination},${sentAmount}\n`;
  fs.appendFileSync(outFile, transferLog);
  // console.log(transferLog)
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
