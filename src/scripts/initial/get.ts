/* eslint-disable no-await-in-loop */
import type { WebDriver, WebElement } from "selenium-webdriver";
import { Builder, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import { Age, Attraction, Park, Status, Type } from "../../types/attraction";
import * as logger from "../../utils/logger";
import * as parser from "../../utils/parser";

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

const loadCard = async (driver: WebDriver, card: WebElement) => {
    await driver.actions().keyDown(Key.COMMAND).click(card).perform();

    await driver.wait(async () => {
        const windows = await driver.getAllWindowHandles();
        return windows.length === 2;
    }, 10000);

    const windows = await driver.getAllWindowHandles();
    const newWindow = windows[1];

    await driver.switchTo().window(newWindow);

    await driver.wait(
        until.elementLocated(By.className("entity-details")),
        10000
    );
};

const closeCard = async (driver: WebDriver) => {
    const windows = await driver.getAllWindowHandles();
    const originalWindow = windows[0];

    await driver.close();
    await driver.switchTo().window(originalWindow);
};

const getName = async (card: WebElement) => {
    const nameText = await card.findElement(By.className("name")).getText();
    return [parser.parseName(nameText), nameText];
};

const getTags = async (card: WebElement) => {
    try {
        const tagsText = await card.findElement(By.className("type")).getText();
        return parser.parseTags(tagsText);
    } catch (e) {
        return [];
    }
};

const getArea = async (details: WebElement) => {
    try {
        const elements = await details.findElements(
            By.css(".breadcrumb finder-anchor")
        );
        let areaText = await elements[1].getText();

        if (
            (
                await details
                    .findElement(By.className("container"))
                    .findElements(
                        By.xpath("//*[contains(text(), 'Main Street')]")
                    )
            ).length > 0
        )
            areaText = "Main Street, U.S.A.";
        if (
            (
                await details.findElements(
                    By.xpath("//*[contains(text(), 'Paradise Gardens Park')]")
                )
            ).length > 0
        )
            areaText = "Paradise Gardens Park";

        return parser.parseArea(areaText);
    } catch (e) {
        return "Disneyland Resort";
    }
};

const getHeightRequirement = async (details: WebElement) => {
    try {
        const heightIcon = await details.findElement(
            By.xpath("//*[contains(@style, 'icon_ride-height')]")
        );
        const heightRequirementText = await heightIcon
            .findElement(By.xpath("following-sibling::*"))
            .getText();
        return parser.parseHeightRequirement(heightRequirementText);
    } catch (e) {
        return 0;
    }
};

const getAges = async (details: WebElement) => {
    try {
        const agesIcon = await details.findElement(
            By.xpath("//*[contains(@style, 'visiting-with-children')]")
        );
        const agesText = await agesIcon
            .findElement(By.xpath("following-sibling::*"))
            .getText();
        return parser.parseAges(agesText);
    } catch (e) {
        return Object.values(Age);
    }
};

const parseCard = async (
    driver: WebDriver,
    card: WebElement,
    park: Park
): Promise<Attraction | null> => {
    const [name, actualName] = await getName(card);
    const tags = await getTags(card);

    try {
        await loadCard(driver, card);
    } catch (e) {
        logger.log(`Error loading card for ${name}`);
        await closeCard(driver);
        return null;
    }

    const details = await driver.findElement(By.className("entity-details"));

    const area = await getArea(details);
    const heightRequirement = await getHeightRequirement(details);
    const ages = await getAges(details);

    let type = Type.ATTRACTION;
    if (
        (
            await details.findElements(
                By.xpath("//*[contains(@style, 'thrill-seekers')]")
            )
        ).length > 0
    )
        type = Type.RIDE;
    if (tags.includes("fireworks") || tags.includes("parades"))
        type = Type.SHOW;

    const attraction: Attraction = {
        name,
        actualName,
        type,
        park,
        area,
        heightRequirement,
        ages,
        tags,
        seasonal: false,
        variant: false,
        todaysHours: [],
        todaysTimes: [],
        waitTime: 0,
        status: Status.CLOSED,
        waitTimeLastUpdated: new Date(),
    };

    await closeCard(driver);
    return attraction;
};

const getPark = async (park: Park): Promise<Attraction[]> => {
    const driver = await startDriver(park);
    const data: Attraction[] = [];

    await loadPage(driver);

    const cards = await driver.findElements(By.className("card"));

    // eslint-disable-next-line no-restricted-syntax
    for (const card of cards) {
        const attraction = await parseCard(driver, card, park);
        if (attraction != null) data.push(attraction);
    }

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
