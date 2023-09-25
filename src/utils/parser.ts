import { Age, Status } from "../types/attraction";

export const parseName = (nameText: string) =>
    nameText
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, " ");

export const parseArea = (areaText: string) =>
    areaText
        .trim()
        .toLowerCase()
        .replace(/[^\w\s]/gi, "")
        .replace(/\s+/g, " ");

export const parseHeightRequirement = (heightText: string) => {
    if (heightText === "Any Height") return 0;
    return parseInt(heightText.split(" ")[0], 10);
};

export const parseAges = (agesText: string): Age[] => {
    if (agesText === "All Ages") return Object.values(Age);
    return agesText.split("\n").map((age) => age.trim().toLowerCase()) as Age[];
};

export const parseTags = (tagsText: string) =>
    tagsText.split(",").map((tag) => tag.trim().toLowerCase());

export const toDecimal = (timeText: string) => {
    const [number, period] = timeText.split(" ");
    const [hours, minutes] = number.split(":").map((num) => parseInt(num, 10));

    if ((period === "PM" && hours !== 12) || (period === "AM" && hours === 12))
        return hours + 12 + minutes / 60;
    return hours + minutes / 60;
};

export const parseHours = (hoursText: string): [number, number] =>
    hoursText.split("To").map((time) => toDecimal(time.trim())) as [
        number,
        number
    ];

export const parseTimes = (timesText: string) =>
    timesText.split(",").map((time) => toDecimal(time.trim()));

export const parseStatus = (statusText: string): Status => {
    const statusMap: Record<string, Status> = {
        operating: Status.OPEN,
        refurbishment: Status.CLOSED_FOR_REFURBISHMENT,
        closed: Status.CLOSED,
        down: Status.CLOSED_TEMPORARILY,
    };
    return statusText.toLowerCase() in statusMap
        ? statusMap[statusText.toLowerCase()]
        : Status.CLOSED;
};
