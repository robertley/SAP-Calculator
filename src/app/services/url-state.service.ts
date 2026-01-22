import { Injectable } from '@angular/core';

const REVERSE_KEY_MAP = {
  pP: 'playerPack',
  oP: 'opponentPack',
  pT: 'playerToy',
  pTL: 'playerToyLevel',
  pHT: 'playerHardToy',
  pHTL: 'playerHardToyLevel',
  oT: 'opponentToy',
  oTL: 'opponentToyLevel',
  oHT: 'opponentHardToy',
  oHTL: 'opponentHardToyLevel',
  t: 'turn',
  pGS: 'playerGoldSpent',
  oGS: 'opponentGoldSpent',
  pRA: 'playerRollAmount',
  oRA: 'opponentRollAmount',
  pSA: 'playerSummonedAmount',
  oSA: 'opponentSummonedAmount',
  pL3: 'playerLevel3Sold',
  oL3: 'opponentLevel3Sold',
  p: 'playerPets',
  o: 'opponentPets',
  ap: 'allPets',
  lf: 'logFilter',
  cp: 'customPacks',
  os: 'oldStork',
  tp: 'tokenPets',
  ks: 'komodoShuffle',
  m: 'mana',
  tc: 'triggersConsumed',
  sa: 'showAdvanced',
  swl: 'showSwallowedLevels',
  ae: 'ailmentEquipment',
  pTA: 'playerTransformationAmount',
  oTA: 'opponentTransformationAmount',
  // Pet Object Keys
  n: 'name',
  a: 'attack',
  h: 'health',
  e: 'exp',
  eq: 'equipment',
  bSP: 'belugaSwallowedPet',
  pCP: 'parrotCopyPet',
  pCPB: 'parrotCopyPetBelugaSwallowedPet',
  pCPAS1: 'parrotCopyPetAbominationSwallowedPet1',
  pCPAS2: 'parrotCopyPetAbominationSwallowedPet2',
  pCPAS3: 'parrotCopyPetAbominationSwallowedPet3',
  pCPAS1B: 'parrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet',
  pCPAS2B: 'parrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet',
  pCPAS3B: 'parrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet',
  pCPAS1L: 'parrotCopyPetAbominationSwallowedPet1Level',
  pCPAS2L: 'parrotCopyPetAbominationSwallowedPet2Level',
  pCPAS3L: 'parrotCopyPetAbominationSwallowedPet3Level',
  pCPAS1T: 'parrotCopyPetAbominationSwallowedPet1TimesHurt',
  pCPAS2T: 'parrotCopyPetAbominationSwallowedPet2TimesHurt',
  pCPAS3T: 'parrotCopyPetAbominationSwallowedPet3TimesHurt',
  pCPAS1PCP: 'parrotCopyPetAbominationSwallowedPet1ParrotCopyPet',
  pCPAS2PCP: 'parrotCopyPetAbominationSwallowedPet2ParrotCopyPet',
  pCPAS3PCP: 'parrotCopyPetAbominationSwallowedPet3ParrotCopyPet',
  pCPAS1PCPB:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet',
  pCPAS2PCPB:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet',
  pCPAS3PCPB:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet',
  pCPAS1PCPAS1:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1',
  pCPAS1PCPAS2:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2',
  pCPAS1PCPAS3:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3',
  pCPAS2PCPAS1:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1',
  pCPAS2PCPAS2:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2',
  pCPAS2PCPAS3:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3',
  pCPAS3PCPAS1:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1',
  pCPAS3PCPAS2:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2',
  pCPAS3PCPAS3:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3',
  pCPAS1PCPAS1B:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet',
  pCPAS1PCPAS2B:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet',
  pCPAS1PCPAS3B:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet',
  pCPAS2PCPAS1B:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet',
  pCPAS2PCPAS2B:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet',
  pCPAS2PCPAS3B:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet',
  pCPAS3PCPAS1B:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet',
  pCPAS3PCPAS2B:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet',
  pCPAS3PCPAS3B:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet',
  pCPAS1PCPAS1L:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level',
  pCPAS1PCPAS2L:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level',
  pCPAS1PCPAS3L:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level',
  pCPAS2PCPAS1L:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level',
  pCPAS2PCPAS2L:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level',
  pCPAS2PCPAS3L:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level',
  pCPAS3PCPAS1L:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level',
  pCPAS3PCPAS2L:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level',
  pCPAS3PCPAS3L:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level',
  pCPAS1PCPAS1T:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt',
  pCPAS1PCPAS2T:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt',
  pCPAS1PCPAS3T:
    'parrotCopyPetAbominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt',
  pCPAS2PCPAS1T:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt',
  pCPAS2PCPAS2T:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt',
  pCPAS2PCPAS3T:
    'parrotCopyPetAbominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt',
  pCPAS3PCPAS1T:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt',
  pCPAS3PCPAS2T:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt',
  pCPAS3PCPAS3T:
    'parrotCopyPetAbominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt',
  aSP1PCP: 'abominationSwallowedPet1ParrotCopyPet',
  aSP2PCP: 'abominationSwallowedPet2ParrotCopyPet',
  aSP3PCP: 'abominationSwallowedPet3ParrotCopyPet',
  aSP1PCPB: 'abominationSwallowedPet1ParrotCopyPetBelugaSwallowedPet',
  aSP2PCPB: 'abominationSwallowedPet2ParrotCopyPetBelugaSwallowedPet',
  aSP3PCPB: 'abominationSwallowedPet3ParrotCopyPetBelugaSwallowedPet',
  aSP1PCPAS1: 'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1',
  aSP1PCPAS2: 'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2',
  aSP1PCPAS3: 'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3',
  aSP2PCPAS1: 'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1',
  aSP2PCPAS2: 'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2',
  aSP2PCPAS3: 'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3',
  aSP3PCPAS1: 'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1',
  aSP3PCPAS2: 'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2',
  aSP3PCPAS3: 'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3',
  aSP1PCPAS1B:
    'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet',
  aSP1PCPAS2B:
    'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet',
  aSP1PCPAS3B:
    'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet',
  aSP2PCPAS1B:
    'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet',
  aSP2PCPAS2B:
    'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet',
  aSP2PCPAS3B:
    'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet',
  aSP3PCPAS1B:
    'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1BelugaSwallowedPet',
  aSP3PCPAS2B:
    'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2BelugaSwallowedPet',
  aSP3PCPAS3B:
    'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3BelugaSwallowedPet',
  aSP1PCPAS1L:
    'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1Level',
  aSP1PCPAS2L:
    'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2Level',
  aSP1PCPAS3L:
    'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3Level',
  aSP2PCPAS1L:
    'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1Level',
  aSP2PCPAS2L:
    'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2Level',
  aSP2PCPAS3L:
    'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3Level',
  aSP3PCPAS1L:
    'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1Level',
  aSP3PCPAS2L:
    'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2Level',
  aSP3PCPAS3L:
    'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3Level',
  aSP1PCPAS1T:
    'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet1TimesHurt',
  aSP1PCPAS2T:
    'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet2TimesHurt',
  aSP1PCPAS3T:
    'abominationSwallowedPet1ParrotCopyPetAbominationSwallowedPet3TimesHurt',
  aSP2PCPAS1T:
    'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet1TimesHurt',
  aSP2PCPAS2T:
    'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet2TimesHurt',
  aSP2PCPAS3T:
    'abominationSwallowedPet2ParrotCopyPetAbominationSwallowedPet3TimesHurt',
  aSP3PCPAS1T:
    'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet1TimesHurt',
  aSP3PCPAS2T:
    'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet2TimesHurt',
  aSP3PCPAS3T:
    'abominationSwallowedPet3ParrotCopyPetAbominationSwallowedPet3TimesHurt',
  tH: 'timesHurt',
};

function expandKeys(data) {
  if (Array.isArray(data)) {
    return data.map((item) => expandKeys(item));
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
  providedIn: 'root',
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
      return {
        state: null,
        error: 'Failed to parse calculator state from URL.',
      };
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
      return { state: null, error: 'Error parsing API data from URL.' };
    }
  }
}
