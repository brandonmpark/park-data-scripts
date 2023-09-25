/* eslint-disable no-await-in-loop */
import type { WebDriver, WebElement } from "selenium-webdriver";
import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { LabeledMetadata, Park } from "../../types/attraction";
import * as logger from "../../utils/logger";
import * as parser from "../../utils/parser";
import write from "./write";

const DISNEYLAND_URL =
    "https://disneyland.disney.go.com/attractions/disneyland/#/sort=alpha/";
const CALIFORNIA_ADVENTURE_URL =
    "https://disneyland.disney.go.com/attractions/disney-california-adventure/#/sort=alpha/";

const getUrl = (park: Park) =>
    park === Park.DISNEYLAND ? DISNEYLAND_URL : CALIFORNIA_ADVENTURE_URL;

const startDriver = async (park: Park) => {
    logger.log(`Starting driver for url: ${getUrl(park)}`);
    const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeOptions(
            new chrome.Options().addArguments("--enable-javascript")
        )
        .build();
    await driver.get(getUrl(park));
    return driver;
};

const loadPage = async (driver: WebDriver) => {
    await driver.wait(
        until.elementLocated(By.xpath("//*[contains(text(), 'Disneyland')]")),
        10000
    );

    try {
        await driver.wait(async () => {
            driver.executeScript("window.scrollBy(0, 500)");
            try {
                await driver.findElement(
                    By.xpath(
                        "//*[contains(text(), 'Closed for Refurbishment')]"
                    )
                );
                driver.executeScript("window.scrollBy(0, 500)");
                await driver.sleep(2000);
                return true;
            } catch (e) {
                return false;
            }
        }, 10000);
    } catch (e) {
        // Do nothing
    }
};

const parseName = async (card: WebElement): Promise<string> => {
    const nameText = await card.findElement(By.className("name")).getText();
    return parser.parseName(nameText);
};

const parseHoursAndTimes = async (card: WebElement) => {
    const returned: {
        todaysHours: [number, number] | [];
        todaysTimes: number[];
    } = {
        todaysHours: [],
        todaysTimes: [],
    };

    try {
        const timesText = await card
            .findElement(By.className("time-range"))
            .getText();
        if (timesText.includes("To"))
            returned.todaysHours = parser.parseHours(timesText);
        if (timesText.includes(","))
            returned.todaysTimes = parser.parseTimes(timesText);
    } catch (e) {
        // Do nothing
    }
    return returned;
};

const parseCard = async (card: WebElement, park: Park) => {
    const name = await parseName(card);
    const hoursAndTimes = await parseHoursAndTimes(card);
    return {
        name,
        park,
        ...hoursAndTimes,
    };
};

const getPark = async (park: Park): Promise<LabeledMetadata[]> => {
    const driver = await startDriver(park);
    const data: LabeledMetadata[] = [];

    await loadPage(driver);
    const cards = await driver.findElements(By.className("card"));

    // eslint-disable-next-line no-restricted-syntax
    for (const card of cards) {
        data.push(await parseCard(card, park));
    }

    await write(data);

    await driver.quit();
    return data;
};

const get = async () => {
    const [disneylandData, californiaAdventureData] = await Promise.all([
        getPark(Park.DISNEYLAND),
        getPark(Park.CALIFORNIA_ADVENTURE),
    ]);

    return [...disneylandData, ...californiaAdventureData];
};

export default get;
