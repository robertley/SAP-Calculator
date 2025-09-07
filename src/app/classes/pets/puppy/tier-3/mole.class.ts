import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { getOpponent } from "../../../../util/helper-functions";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Mole extends Pet {
    name = "Mole";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 2;
    health = 3;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let power = this.level * 6;
        let equipmentPets: Pet[] = [];
        for (let pet of this.parent.petArray) {
            if (pet == this) {
                continue;
            }
            if (pet.equipment) {
                equipmentPets.push(pet);
            }
        }
        // TO DO: Sort By distance to remove perk from nearest friend
        equipmentPets = equipmentPets.slice(0, 2);
        if (equipmentPets.length < 2) {
            return;
        }
        for (let pet of equipmentPets) {
            this.logService.createLog({
                message: `${this.name} removed ${pet.name}'s equipment.`,
                type: 'ability',
                player: this.parent,
                pteranodon: pteranodon,
            })
            pet.removePerk();
        }
        let mole = new Mole(this.logService, this.abilityService, this.parent, power, power);
        
        let summonResult = this.parent.summonPet(mole, this.savedPosition, false, this);
        if (summonResult.success) {
            this.logService.createLog({
                message: `${this.name} summoned a ${power}/${power} Mole.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon,
                randomEvent: summonResult.randomEvent
            })

            this.abilityService.triggerFriendSummonedEvents(mole);
        }
        super.superAfterFaint(gameApi, tiger, pteranodon);
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