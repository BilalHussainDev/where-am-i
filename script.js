"use strict";

const btn = document.querySelector(".btn-country");
const countriesContainer = document.querySelector(".countries");

// Takes data and render it

const renderCountry = (data, className = "") => {
	const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row">
          <span>👫</span>${(+data.population / 1000000).toFixed(
				2
			)} million people
        </p>
        <p class="country__row">
          <span>🗣️</span>${Object.values(data.languages).slice(-1)[0]}
        </p>
        <p class="country__row">
          <span>💰</span>${Object.values(data.currencies)[0].name}
        </p>
      </div>
    </article>
  `;
	countriesContainer.insertAdjacentHTML("beforeend", html);
	countriesContainer.style.opacity = 1;
};

// Takes country name and gives data

const getCountryData = async (country) => {
	try {
		const CountryResponse = await fetch(
			`https://restcountries.com/v3.1/name/${country}`
		);
		const data = await CountryResponse.json();
		renderCountry(data[0]);
		const neighbour = data[0].borders ? data[0].borders[0] : null;
		if (!neighbour) throw new Error("No Neighbour Found");
		const neighbourResponse = await fetch(
			`https://restcountries.com/v3.1/name/${neighbour}`
		);
		const neighbourData = await neighbourResponse.json();
		renderCountry(neighbourData[0], "neighbour");
	} catch (err) {
		console.log(err);
	}
};

// Takes coordinates and give country name

const whereAmI = async (lat, lng) => {
	const response = await fetch(
		`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
	);
	if (!response.ok) throw new Error("Problem in geocode", res.status);
	const data = await response.json();
	console.log(data);
	getCountryData(data.countryName);
};

// gives coordinates of current country

const getPosition = () => {
	return new Promise((res, rej) => {
		navigator.geolocation.getCurrentPosition(res, rej);
	});
};

(async () => {
	try {
		const pos = await getPosition();
		const { latitude, longitude } = pos.coords;
		whereAmI(latitude, longitude);
	} catch (err) {
		console.log(err);
	}
})();
