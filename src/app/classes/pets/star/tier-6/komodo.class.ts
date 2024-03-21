import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.servicee";
import { shuffle } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Komodo extends Pet {
    name = "Komodo";
    tier = 6;
    pack: Pack = 'Star';
    attack = 6;
    health = 6;
    endTurn(gameApi: GameAPI): void {
        if (!gameApi.komodoShuffle) {
            return;
        }

        let start = 0;
        let end = this.position;
        if (end == 0) {
            return;
        }

        let shuffledPets = this.shufflePets(start, end);
        let shuffledPetNames = shuffledPets.map(pet => pet.name).join(', ');

        this.logService.createLog({
            message: `${this.name} shuffled positions of pets (${shuffledPetNames}).`,
            type: 'ability',
            player: this.parent,
            randomEvent: true
        })
    }
    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        parent: Player,
        health?: number,
        attack?: number,
        mana?: number,
        exp?: number,
        equipment?: Equipment) {
        super(logService, abilityService, parent);
        this.initPet(exp, health, attack, mana, equipment);
    }

    shufflePets(start: number, end: number) {
        let pets = this.parent.petArray.slice(start, end);
        shuffle(pets);
        for (let i = 0; i < pets.length; i++) {
            this.parent[`pet${i}`] = pets[i];
        }
        return pets;
    }
}