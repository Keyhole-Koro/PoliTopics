"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function fetchKokkaiRecords(_a) {
    return __awaiter(this, arguments, void 0, function* ({ endpoint, query = {} }) {
        // Base URL
        const baseUrl = `https://kokkai.ndl.go.jp/api/${endpoint}`;
        // Convert query parameters to URL query string
        const queryString = new URLSearchParams(query).toString();
        // Construct full URL
        const url = `${baseUrl}?${queryString}`;
        try {
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = yield response.json();
            console.log(`Data from ${endpoint}:`, data);
            return data;
        }
        catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error);
        }
    });
}
