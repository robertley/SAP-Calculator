import { Ability, AbilityContext } from "../../../../ability.class";
import { InjectorService } from "app/services/injector.service";
import { Pet } from "../../../../pet.class";
import { LogService } from "app/services/log.service";
import { PetService } from "app/services/pet/pet.service";
import { BASE_PACK_NAMES, BasePackName } from "app/util/pack-names";

export class DugongAbility extends Ability {
    private logService: LogService;

    constructor(owner: Pet, logService: LogService) {
        super({
            name: 'Dugong Ability',
            owner: owner,
            triggers: ['ThisDied'],
            abilityType: 'Pet',
            native: true,
            abilitylevel: owner.level,
            abilityFunction: (context) => this.executeAbility(context)
        });
        this.logService = logService;
    }

    private executeAbility(context: AbilityContext): void {
        const { tiger, pteranodon } = context;
        const owner = this.owner;
        const atkBuff = this.level;
        const hpBuff = 2 * this.level;

        const petService = InjectorService.getInjector().get(PetService);
        const activePackName = owner.parent.pack;

        const friends = owner.parent.petArray.filter(friend => friend.alive && friend !== owner && !this.isPetInActivePack(friend, activePackName, petService));

        for (const friend of friends) {
            friend.increaseAttack(atkBuff);
            friend.increaseHealth(hpBuff);
        }

        if (friends.length > 0) {
            this.logService.createLog({
                message: `${owner.name} gave +${atkBuff}/+${hpBuff} to pets outside ${activePackName}.`,
                type: 'ability',
                player: owner.parent,
                tiger: tiger,
                pteranodon: pteranodon
            });
        }

        this.triggerTigerExecution(context);
    }

    private isPetInActivePack(pet: Pet, activePackName: string, petService: PetService): boolean {
        if (!petService) {
            return pet.pack === activePackName;
        }

        if (BASE_PACK_NAMES.includes(activePackName as BasePackName)) {
            const tierPets = petService.basePackPetsByName[activePackName as BasePackName]?.get(pet.tier) ?? [];
            return tierPets.includes(pet.name);
        }

        const customPack = petService.playerCustomPackPets.get(activePackName);
        if (customPack) {
            return customPack.get(pet.tier)?.includes(pet.name) ?? false;
        }

        return pet.pack === activePackName;
    }

    override copy(newOwner: Pet): DugongAbility {
        return new DugongAbility(newOwner, this.logService);
    }
}
