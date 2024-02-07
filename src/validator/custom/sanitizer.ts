import {formatISO} from "date-fns";

export const dateSanitizer = (value: Date) => formatISO(value);
export const objectSanitizer = (value: object) => JSON.stringify(value);
