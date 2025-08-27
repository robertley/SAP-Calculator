import { GameAPI } from "../../../../interfaces/gameAPI.interface";
import { AbilityService } from "../../../../services/ability.service";
import { LogService } from "../../../../services/log.service";
import { PetService } from "../../../../services/pet.service";
import { Equipment } from "../../../equipment.class";
import { Pack, Pet } from "../../../pet.class";
import { Player } from "../../../player.class";

export class ShimaEnaga extends Pet {
    name = "Shima Enaga";
    tier = 2;
    pack: Pack = 'Star';
    attack = 2;
    health = 3;

    friendFaints(gameApi: GameAPI, pet?: Pet, tiger?: boolean): void {   
        if (!this.alive) {
            return;
        }     
        if (this.abilityUses >= this.maxAbilityUses) {
            return;
        }
        
        if (!pet || pet.equipment?.name != 'Strawberry') {
            this.superFriendFaints(gameApi, pet, tiger);
            return;
        }
        
        let power = this.level * 2;
        
        // Get random friend from current team
        let aliveFriends = this.parent.petArray.filter(p => p.alive);
        this.abilityUses++;
        if (aliveFriends.length === 0) {
            return;
        }
        
        let randomFriend = aliveFriends[Math.floor(Math.random() * aliveFriends.length)];
        let newPet = this.petService.createPet({
            name: randomFriend.name,
            attack: power,
            health: power,
            equipment: null,
            exp: randomFriend.exp,
            mana: 0
        }, this.parent);

        this.logService.createLog({
            message: `${this.name} summoned a (${power}/${power}) ${newPet.name} }`,
            type: 'ability',
            player: this.parent,
            tiger: tiger,
            randomEvent: true
        });
        
        if (this.parent.summonPet(newPet, pet.position)) {
            this.abilityService.triggerFriendSummonedEvents(newPet);
        }
        
        this.superFriendFaints(gameApi, pet, tiger);
    }

    setAbilityUses(): void {
        super.setAbilityUses();
        this.maxAbilityUses = 2;
    }

    constructor(protected logService: LogService,
        protected abilityService: AbilityService,
        protected petService: PetService,
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