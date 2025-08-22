import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class Sleipnir extends Pet {
    name = "Sleipnir";
    tier = 6;
    pack: Pack = 'Unicorn';
    attack = 8;
    health = 5;
    startOfBattle(gameApi: GameAPI, tiger?: boolean): void {
        let manaAmt = Math.floor(this.attack / 2);
        let target = this.parent.furthestUpPet;
        let targets = [];
        while(target) {
            targets.push(target);
            if (targets.length >= this.level) {
                break;
            }
            target = target.petBehind();
        }
        for (let target of targets) {
            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${manaAmt} mana.`,
                type: 'ability',
                player: this.parent,
                tiger: tiger
            })

            target.increaseMana(manaAmt);
        }

        this.superStartOfBattle(gameApi, tiger);
        
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