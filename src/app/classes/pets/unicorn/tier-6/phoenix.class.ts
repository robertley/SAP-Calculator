import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { shuffle } from "../../../../util/helper-functions";
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
        let targets = [
            ...this.parent.petArray,
            ...this.parent.opponent.petArray
        ];

        targets = targets.filter(pet => {
            return pet != this && pet.alive;
        });

        shuffle(targets);

        let cripsAmt = this.level * 3;
        let criped = 0;
        if (targets.length > 0) {
            for (let target of targets) {
                if (criped >= cripsAmt) {
                    break;
                }

                this.logService.createLog({
                    message: `${this.name} gave ${target.name} Crisp.`,
                    type: 'ability',
                    randomEvent: targets.length > cripsAmt,
                    tiger: tiger,
                    player: this.parent
                })

                target.givePetEquipment(new Crisp());

                criped++;
            }
        }

        this.abilityService.setAfterFaintEvents({
            callback: () => {
                let power = 4 * this.level;
                let youngPhoenix = new YoungPhoenix(this.logService, this.abilityService, this.parent, power, power, 0);
        
                this.logService.createLog(
                    {
                        message: `${this.name} spawned a Young Phoenix (${power}/${power}).`,
                        type: "ability",
                        player: this.parent,
                        tiger: tiger,
                        pteranodon: pteranodon
                    }
                )

                if (this.parent.summonPet(youngPhoenix, this.savedPosition)) {
                    this.abilityService.triggerFriendSummonedEvents(youngPhoenix);
                }
            },
            priority: this.attack
        })

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