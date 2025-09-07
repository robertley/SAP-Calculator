import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Crisp } from "../../../equipment/ailments/crisp.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { YoungPhoenix } from "../../hidden/young-phoenix.class";

export class Phoenix extends Pet {
    name = "Phoenix";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 8;
    health = 8;
    faint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        let cripsAmt = this.level * 3;
        // Exclude pets that already have Crisp
        let allPets = [...this.parent.petArray, ...this.parent.opponent.petArray];
        let petsWithCrisp = allPets.filter(pet => pet.equipment instanceof Crisp);
        
        let targetsResp = this.parent.getRandomPets(cripsAmt, petsWithCrisp, true, true, this, true);
        let targets = targetsResp.pets;
                
        if (targets.length > 0) {
            for (let target of targets) {
                this.logService.createLog({
                    message: `${this.name} gave ${target.name} Crisp.`,
                    type: 'ability',
                    randomEvent: targetsResp.random,
                    tiger: tiger,
                    player: this.parent,
                })

                target.givePetEquipment(new Crisp());
            }
        }

        // Create afterFaint ability dynamically when Phoenix faints
        this.afterFaint = (gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean) => {
            let power = 4 * this.level;
            let youngPhoenix = new YoungPhoenix(this.logService, this.abilityService, this.parent, power, power, 0);

            let summonResult = this.parent.summonPet(youngPhoenix, this.savedPosition, false, this);
            if (summonResult.success) {
                this.logService.createLog(
                    {
                        message: `${this.name} spawned a Young Phoenix (${power}/${power}).`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon,
                        randomEvent: summonResult.randomEvent
                    }
                )

                this.abilityService.triggerFriendSummonedEvents(youngPhoenix);
            }
            
            this.superAfterFaint(gameApi, tiger, pteranodon);
        };

        super.superFaint(gameApi, tiger);
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