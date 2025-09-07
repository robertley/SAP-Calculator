import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { Power } from "../../../../interfaces/power.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";
import { ChimGoat } from "../../hidden/chim-goat.class";
import { ChimLion } from "../../hidden/chim-lion.class";
import { ChimSnake } from "../../hidden/chim-snake.class";

export class Chimera extends Pet {
    name = "Chimera";
    tier = 4;
    pack: Pack = 'Unicorn';
    attack = 2;
    health = 6;
    afterFaint(gameApi?: GameAPI, tiger?: boolean, pteranodon?: boolean): void {
        if (this.mana <= 0) {
            super.superAfterFaint(gameApi, tiger, pteranodon);
            return;
        }

        const buffMultiplier = Math.floor(this.mana / 2);
        const bonusAttack = buffMultiplier * 1;
        const bonusHealth = buffMultiplier * 2;

        const finalAttack = 3 + bonusAttack;
        const finalHealth = 3 + bonusHealth;

        this.logService.createLog(
            {
                message: `${this.name} spent ${this.mana} mana.`,
                type: "ability",
                player: this.parent,
                tiger: tiger,
                pteranodon: pteranodon
            }
        )

         
        let lion = new ChimLion(this.logService, this.abilityService, this.parent, finalHealth, finalAttack);

        let lionSummonResult = this.parent.summonPet(lion, this.savedPosition, false, this);
        if (lionSummonResult.success) {
            this.logService.createLog(
                {
                    message: `${this.name} spawned a ${lion.name} ${finalAttack}/${finalHealth}.`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: lionSummonResult.randomEvent
                }
            )

            this.abilityService.triggerFriendSummonedEvents(lion);
        }

        if (this.level == 1) {
            this.mana = 0;
            super.superAfterFaint(gameApi, tiger, pteranodon);
            return;
        }

         
        let goat = new ChimGoat(this.logService, this.abilityService, this.parent, finalHealth, finalAttack);

        let goatSummonResult = this.parent.summonPet(goat, this.savedPosition, false, this);
        if (goatSummonResult.success) {
            this.logService.createLog(
                {
                    message: `${this.name} spawned a ${goat.name} ${finalAttack}/${finalHealth}.`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: goatSummonResult.randomEvent
                }
            )

            this.abilityService.triggerFriendSummonedEvents(goat);
        }

        if (this.level == 2) {
            this.mana = 0;
            super.superAfterFaint(gameApi, tiger, pteranodon);
            return;
        }

         
        let snake = new ChimSnake(this.logService, this.abilityService, this.parent, finalHealth, finalAttack);

        let snakeSummonResult = this.parent.summonPet(snake, this.savedPosition, false, this);
        if (snakeSummonResult.success) {
            this.logService.createLog(
                {
                    message: `${this.name} spawned a ${snake.name} ${finalAttack}/${finalHealth}.`,
                    type: "ability",
                    player: this.parent,
                    tiger: tiger,
                    pteranodon: pteranodon,
                    randomEvent: snakeSummonResult.randomEvent
                }
            )

            this.abilityService.triggerFriendSummonedEvents(snake);
        }

        this.mana = 0;
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