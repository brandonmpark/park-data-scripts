/* eslint-disable import/prefer-default-export */
import type { Weather } from "../types/waitTime";

const API_URL =
    "https://api.open-meteo.com/v1/forecast?latitude=33.8121&longitude=-117.919&hourly=temperature_2m,weathercode&temperature_unit=fahrenheit&windspeed_unit=ms&forecast_days=1";

export const get = async (): Promise<Weather> => {
    const response = await (await fetch(API_URL)).json();
    const date = new Date();
    const hour = date.getHours();
    return {
        temperature: response.hourly.temperature_2m[hour],
        conditions: response.hourly.weathercode[hour],
    };
};
