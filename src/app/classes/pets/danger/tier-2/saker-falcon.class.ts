import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class SakerFalcon extends Pet {
    name = "Saker Falcon";
    tier = 2;
    pack: Pack = 'Danger';
    attack = 2;
    health = 3;

    beforeAttack(gameApi: GameAPI, tiger?: boolean): void {
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }

        // Check if outnumbered by comparing team sizes (petArray already excludes dead pets)
        let myAlivePets = this.parent.petArray.length;
        let enemyAlivePets = this.parent.opponent.petArray.length;

        if (myAlivePets < enemyAlivePets) {
            let targetResp = this.parent.getThis(this);
            let target = targetResp.pet;
            
            if (!target) {
                this.superBeforeAttack(gameApi, tiger);
                return;
            }

            let power = this.level * 2;
            target.increaseAttack(power);
            target.increaseHealth(power);

            this.logService.createLog({
                message: `${this.name} gave ${target.name} ${power} attack and ${power} health (outnumbered)`,
                type: 'ability',
                player: this.parent,
                tiger: tiger,
                randomEvent: targetResp.random
            });

            this.abilityUses++;
        }

        this.superBeforeAttack(gameApi, tiger);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 3;
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