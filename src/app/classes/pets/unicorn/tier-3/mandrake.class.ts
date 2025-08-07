
import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { Dazed } from "../../../equipment/ailments/dazed.class";
import { shuffle } from "../../../../util/helper-functions";

export class Mandrake extends Pet {
    name = "Mandrake";
    tier = 3;
    pack: Pack = 'Unicorn';
    attack = 4;
    health = 2;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let opponentPets = this.parent.opponent.petArray;
        let potentialTargets = opponentPets.filter(pet => {
            return pet.tier <= this.level * 2;
        });

        let faintPets = potentialTargets.filter(pet => pet.faintPet);
        let target: Pet;

        if (faintPets.length > 0) {
            target = faintPets[Math.floor(Math.random() * faintPets.length)];
        } 
        else {
            shuffle(potentialTargets);
            target = potentialTargets[0];
        }

        // mandrake no longer targets highest tier pets
        // potentialTargets.sort((a, b) => {
        //     return b.tier - a.tier;
        // });

        this.logService.createLog({
            message: `${this.name} made ${target.name} Dazed.`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: true
        })

        target.givePetEquipment(new Dazed());

        this.superFaint(gameApi, tiger);
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
}