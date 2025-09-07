import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ToyService } from "../../../../services/toy.service";
import { InjectorService } from "../../../../services/injector.service";

export class FlyingSquirrel extends Pet {
    name = "Flying Squirrel";
    tier = 3;
    pack: Pack = 'Puppy';
    attack = 3;
    health = 3;
    friendlyToyBroke(gameApi: GameAPI, tiger?: boolean): void {
        let power = this.level * 2
        let targetResp = this.parent.getThis(this);
        let target = targetResp.pet;
        if (target == null) {
            return;
        }
        target.increaseAttack(power)
        this.logService.createLog({
            message: `${this.name} gave ${target.name} +${power} attack`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: targetResp.random
        })
        if (this.parent.brokenToy == null) {
            return
        }
        //TO DO: Might need to change to create new object, might need to reset Used & trigger
        const newToy = InjectorService.getInjector().get(ToyService).createToy(this.parent.brokenToy.name, this.parent);
        newToy.level = Math.min(this.level, this.parent.brokenToy.level);
        
        this.parent.setToy(newToy);
        this.logService.createLog({
            message: `${newToy.name} respawned (Level ${newToy.level})!`,
            type: 'ability',
            player: this.parent,
            tiger: tiger
        })
        this.superFriendlyToyBroke(gameApi, tiger);
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