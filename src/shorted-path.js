const available = {
  thailand: 10,
  laos: 2,
  singapore: 2,
};

const need = {
  thailand: 4,
  laos: 10,
  singapore: 8,
};

const difference = {};

for (const country in available) {
  difference[country] = available[country] - need[country];
}

console.log(difference)

function distribute(origin, destination) {
  if (difference[origin] <= 0) return;

  if (difference[origin] >= Math.abs(difference[destination])) {
    difference[origin] -= Math.abs(difference[destination]);
    difference[destination] += Math.abs(difference[destination]);
  } else {
    difference[destination] += difference[origin];
    difference[origin] = 0;
  }

  console.log(difference);
}

const connectedCountry = {
  thailand: [
    ['laos', 50],
  ],
  laos: [
    ['thailand', 50],
  ],
  singapore: [],
};

function shareResources() {
  for (const country in connectedCountry) {
    const listOfConnectedCountries = connectedCountry[country];
    let nextCountryToSendIndex = 0;
    console.log(`Sending from: ${country}`);

    while (difference[country] > 0) {
      const nextCountryKey = listOfConnectedCountries[nextCountryToSendIndex][0];
      console.log(`Sending to ${nextCountryKey}`)
      distribute(country, nextCountryKey);
    }
  }
}

shareResources();
