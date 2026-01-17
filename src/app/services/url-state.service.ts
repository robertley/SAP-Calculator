import { Injectable } from "@angular/core";

const REVERSE_KEY_MAP = {
    "pP": "playerPack", "oP": "opponentPack", "pT": "playerToy", "pTL": "playerToyLevel",
    "pHT": "playerHardToy", "pHTL": "playerHardToyLevel",
    "oT": "opponentToy", "oTL": "opponentToyLevel",
    "oHT": "opponentHardToy", "oHTL": "opponentHardToyLevel",
    "t": "turn", "pGS": "playerGoldSpent",
    "oGS": "opponentGoldSpent", "pRA": "playerRollAmount", "oRA": "opponentRollAmount",
    "pSA": "playerSummonedAmount", "oSA": "opponentSummonedAmount", "pL3": "playerLevel3Sold",
    "oL3": "opponentLevel3Sold", "p": "playerPets", "o": "opponentPets",
    "ap": "allPets", "lf": "logFilter", "cp": "customPacks",
    "os": "oldStork", "tp": "tokenPets", "ks": "komodoShuffle", "m": "mana", "tc": "triggersConsumed",
    "sa": "showAdvanced", "swl": "showSwallowedLevels", "ae": "ailmentEquipment", "pTA": "playerTransformationAmount", "oTA": "opponentTransformationAmount",
    // Pet Object Keys
    "n": "name", "a": "attack", "h": "health", "e": "exp", "eq": "equipment", "bSP": "belugaSwallowedPet", "tH": "timesHurt"
};

function expandKeys(data) {
    if (Array.isArray(data)) {
        return data.map(item => expandKeys(item));
    }
    if (data !== null && typeof data === 'object') {
        const newObj = {};
        for (const key in data) {
            const newKey = REVERSE_KEY_MAP[key] || key;
            newObj[newKey] = expandKeys(data[key]);
        }
        return newObj;
    }
    return data;
}

@Injectable({
    providedIn: "root"
})
export class UrlStateService {
    parseCalculatorStateFromUrl(): { state: any | null; error?: string } {
        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get('c');

        if (!encodedData) {
            return { state: null };
        }

        try {
            const decodedData = decodeURIComponent(encodedData);
            let truncatedJson;
            if (decodedData.trim().startsWith('{')) {
                truncatedJson = JSON.parse(decodedData);
            } else {
                const compressedData = atob(encodedData);
                const inflatedData = decodeURIComponent(compressedData);
                truncatedJson = JSON.parse(inflatedData);
            }

            const fullKeyJson = expandKeys(truncatedJson);
            return { state: fullKeyJson };
        } catch (e) {
            return { state: null, error: "Failed to parse calculator state from URL." };
        }
    }

    parseApiStateFromUrl(): { state: any | null; error?: string } {
        const params = new URLSearchParams(window.location.search);
        const apiCode = params.get('code');

        if (!apiCode) {
            return { state: null };
        }

        try {
            const jsonData = JSON.parse(decodeURIComponent(apiCode));
            return { state: jsonData };
        } catch (e) {
            return { state: null, error: "Error parsing API data from URL." };
        }
    }
}
