import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { Pet } from "app/classes/pet.class";
import { Player } from "app/classes/player.class";
import { GameAPI } from "app/interfaces/gameAPI.interface";

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
export function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
 */
export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// https://stackoverflow.com/questions/14968615/rounding-to-the-nearest-hundredth-of-a-decimal-in-javascript
//to round up to two decimal places
export function money_round(num) {
  return Math.ceil(num * 100) / 100;
}
//TO DO: This is useless, replace all this with parent.opponent
export function getOpponent(gameApi: GameAPI, player: Player): Player {
  let opponent;
  if (gameApi.player == player) {
    opponent = gameApi.opponent;
  } else {
    opponent = gameApi.player;
  }
  return opponent;
}


export function createPack(customPack?) {
  let formGroup = new FormGroup({
    name: new FormControl(customPack.name ?? null, Validators.required),
    tier1Pets: new FormControl(customPack.tier1Pets ?? [], controlArrayLengthOf10()),
    // tier1Food: new FormControl([]),
    tier2Pets: new FormControl(customPack.tier2Pets ?? [], controlArrayLengthOf10()),
    // tier2Food: new FormControl([]),
    tier3Pets: new FormControl(customPack.tier3Pets ?? [], controlArrayLengthOf10()),
    // tier3Food: new FormControl([]),
    tier4Pets: new FormControl(customPack.tier4Pets ?? [], controlArrayLengthOf10()),
    // tier4Food: new FormControl([]),
    tier5Pets: new FormControl(customPack.tier5Pets ?? [], controlArrayLengthOf10()),
    // tier5Food: new FormControl([]),
    tier6Pets: new FormControl(customPack.tier6Pets ?? [], controlArrayLengthOf10()),
    // tier6Food: new FormControl([]),
    spells: new FormControl(customPack.spells ?? []),
  })
  return formGroup;
}

// custom angular validator
function controlArrayLengthOf10(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    if (control.value.length !== 10) {
      return { length: true };
    }
    return null;
  };
}

export { levelToExp, minExpForLevel } from "./leveling";
