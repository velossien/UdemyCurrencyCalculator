const axios = require("axios");

const getExchangeRate = async (from, to) => {
    try {
        const response = await axios.get(`http://api.fixer.io/latest?base=${from}`);
        const rate = response.data.rates[to];  //returns the exchange rate for the to value

        //below code will let this work for if to is invalid, instead of just for
        if (rate) {
            return rate;
        } else {
            throw new Error();
        }

    } catch (e) {
        throw new Error(`Unable to get exchange rate for ${from} and ${to}.`);
    }
};

const getCountries = async (currencyCode) => {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
        return response.data.map((country) => country.name);

    } catch (e) {
        throw new Error(`Unable to get countries that use ${currencyCode}`);
    }
};

const convertCurrency = (from, to, amount) => {
    let countries;
    return getCountries(to).then((tempCountries) => {
        countries = tempCountries;
        return getExchangeRate(from, to);
    }).then((rate) => {
        const exchangedAmount = amount * rate;

        return `${amount} ${from} is worth ${exchangedAmount} ${to}. ${to} can be used in the following countries: ${countries.join(", ")}.`;
    });
};

//CHALLENGE - DO THIS BY ASYNC/AWAIT

const convertCurrencyAlt = async (from, to, amount) => {
    const countries = await getCountries(to);
    const rate = await getExchangeRate(from, to);

    const exchangedAmount = amount * rate;

    return `${amount} ${from} is worth ${exchangedAmount} ${to}. ${to} can be used in the following countries: ${countries.join(", ")}.`;
};

//an even better way to do it using promise.all
const convertCurrencyAltWithPromiseAll = async (from, to, amount) => {
    const [countries, rate] = await Promise.all([getCountries(to), getExchangeRate(from, to)]); //this makes it so the request are sent out concurrently and don't have to wait on each other

    const exchangedAmount = amount * rate;

    return `${amount} ${from} is worth ${exchangedAmount} ${to}. ${to} can be used in the following countries: ${countries.join(", ")}.`;
};

convertCurrencyAltWithPromiseAll("USD", "EUR", 1000).then((status) => {
    console.log(status);
}).catch((err) => {
    console.log(err.message);
});

