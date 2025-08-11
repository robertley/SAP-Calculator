import { TestBed } from '@angular/core/testing';
import { Egg } from '../../app/classes/equipment/puppy/egg.class';
import { LogService } from '../../app/services/log.service';
import { AbilityService } from '../../app/services/ability.service';
import { Pet } from '../../app/classes/pet.class';
import { Panther } from '../../app/classes/pets/puppy/tier-5/panther.class';
import { Nest } from '../../app/classes/pets/hidden/nest.class';
import { Player } from '../../app/classes/player.class';

describe('Egg Equipment', () => {
    let equipment: Egg;
    let mockLogService: jasmine.SpyObj<LogService>;
    let mockAbilityService: jasmine.SpyObj<AbilityService>;
    let mockPet: jasmine.SpyObj<Pet>;
    let mockPanther: jasmine.SpyObj<Panther>;
    let mockNest: jasmine.SpyObj<Nest>;
    let mockTargetPet: jasmine.SpyObj<Pet>;
    let mockPlayer: jasmine.SpyObj<Player>;
    let mockOpponent: jasmine.SpyObj<Player>;
    let gameApi: any;

    beforeEach(() => {
        // Create mock services
        mockLogService = jasmine.createSpyObj('LogService', ['createLog']);
        mockAbilityService = jasmine.createSpyObj('AbilityService', [
            'setHurtEvent', 'setKnockOutEvent', 
            'triggerFriendHurtEvents', 'triggerEnemyHurtEvents'
        ]);
        
        // Create mock players
        mockPlayer = jasmine.createSpyObj('Player', ['getLastPet', 'getHighestHealthPet', 'getLowestHealthPet']);
        mockOpponent = jasmine.createSpyObj('Player', ['getLastPet', 'getHighestHealthPet', 'getLowestHealthPet']);
        
        // Create target pet
        mockTargetPet = jasmine.createSpyObj('Pet', ['useDefenseEquipment'], {
            name: 'TargetPet',
            health: 10,
            alive: true,
            parent: mockOpponent,
            hurt: jasmine.createSpy('hurt')
        });
        
        // Set up opponent petArray
        Object.defineProperty(mockOpponent, 'petArray', {
            value: [mockTargetPet],
            writable: true
        });
        
        // Create game API mock
        gameApi = {
            player: mockPlayer,
            opponet: mockOpponent
        };

        // Create mock pets
        mockPet = jasmine.createSpyObj('Pet', [
            'calculateDamgae', 'getManticoreMult', 'givePetEquipment'
        ], {
            name: 'TestPet',
            parent: mockPlayer,
            equipment: { name: 'Egg' },
            originalBeforeAttack: null,
            attack: 5,
            knockOut: null
        });

        mockPanther = jasmine.createSpyObj('Panther', [
            'calculateDamgae', 'getManticoreMult', 'givePetEquipment'
        ], {
            name: 'TestPanther',
            parent: mockPlayer,
            equipment: { name: 'Egg' },
            level: 2,
            attack: 5,
            originalBeforeAttack: null,
            knockOut: null
        });

        mockNest = jasmine.createSpyObj('Nest', [
            'calculateDamgae', 'getManticoreMult', 'givePetEquipment'
        ], {
            name: 'TestNest',
            parent: mockPlayer,
            equipment: { name: 'Egg' },
            level: 3,
            attack: 5,
            originalBeforeAttack: null,
            knockOut: null
        });

        // Mock damage calculation
        mockPet.calculateDamgae.and.returnValue({ 
            damage: 2, 
            defenseEquipment: null,
            attackEquipment: null,
            fortuneCookie: false,
            nurikabe: 0
        });
        mockPanther.calculateDamgae.and.returnValue({ 
            damage: 2, 
            defenseEquipment: null,
            attackEquipment: null,
            fortuneCookie: false,
            nurikabe: 0
        });
        mockNest.calculateDamgae.and.returnValue({ 
            damage: 2, 
            defenseEquipment: null,
            attackEquipment: null,
            fortuneCookie: false,
            nurikabe: 0
        });
        
        mockPet.getManticoreMult.and.returnValue([]);
        mockPanther.getManticoreMult.and.returnValue([]);
        mockNest.getManticoreMult.and.returnValue([]);

        TestBed.configureTestingModule({
            providers: [
                { provide: LogService, useValue: mockLogService },
                { provide: AbilityService, useValue: mockAbilityService }
            ]
        });

        equipment = new Egg(mockLogService, mockAbilityService);
    });

    it('should be created', () => {
        expect(equipment).toBeTruthy();
        expect(equipment.name).toBe('Egg');
        expect(equipment.tier).toBe(1);
        expect(equipment.equipmentClass).toBe('beforeAttack');
    });

    it('should deal damage to first alive enemy', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify damage calculation and dealing
        expect(mockPet.calculateDamgae).toHaveBeenCalledWith(mockTargetPet, [], 2, true);
        expect(mockTargetPet.health).toBe(8); // 10 - 2 = 8
        expect(mockLogService.createLog).toHaveBeenCalledWith({
            message: 'TestPet sniped TargetPet for 2 (Egg).',
            type: 'attack',
            player: mockPlayer
        });
    });

    it('should repeat for Panther level + 1 times', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPanther);
        
        // Call the beforeAttack method
        mockPanther.beforeAttack(gameApi);
        
        // Verify damage calculation called 3 times (level 2 + 1 = 3)
        expect(mockPanther.calculateDamgae).toHaveBeenCalledTimes(3);
        expect(mockTargetPet.health).toBe(4); // 10 - (2 * 3) = 4
        expect(mockLogService.createLog).toHaveBeenCalledTimes(3);
    });

    it('should trigger Nest level times', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockNest);
        
        // Call the beforeAttack method
        mockNest.beforeAttack(gameApi);
        
        // Verify damage calculation called 3 times (Nest level = 3)
        expect(mockNest.calculateDamgae).toHaveBeenCalledTimes(3);
        expect(mockTargetPet.health).toBe(4); // 10 - (2 * 3) = 4
        expect(mockLogService.createLog).toHaveBeenCalledTimes(3);
    });

    it('should not trigger if equipment is removed', () => {
        // Remove equipment
        mockPet.equipment = null;
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify no damage calculation or logging
        expect(mockPet.calculateDamgae).not.toHaveBeenCalled();
        expect(mockLogService.createLog).not.toHaveBeenCalled();
    });

    it('should handle defense equipment', () => {
        const mockDefenseEquipment = { name: 'Shield', power: -1, equipmentClass: 'defense' as any, callback: () => {}, reset: () => {} };
        mockPet.calculateDamgae.and.returnValue({ 
            damage: 1, 
            defenseEquipment: mockDefenseEquipment,
            attackEquipment: null,
            fortuneCookie: false,
            nurikabe: 0
        });
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify defense equipment interaction
        expect(mockTargetPet.useDefenseEquipment).toHaveBeenCalled();
        expect(mockLogService.createLog).toHaveBeenCalledWith({
            message: 'TestPet sniped TargetPet for 1 (Shield +1) (Egg).',
            type: 'attack',
            player: mockPlayer
        });
    });

    it('should trigger hurt events', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify hurt event is set
        expect(mockAbilityService.setHurtEvent).toHaveBeenCalledWith({
            callback: jasmine.any(Function),
            priority: 5,
            player: mockOpponent,
            callbackPet: mockTargetPet
        });
    });

    it('should trigger friend and enemy hurt events if target is alive', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify friend and enemy hurt events
        expect(mockAbilityService.triggerFriendHurtEvents).toHaveBeenCalledWith(mockOpponent, mockTargetPet);
        expect(mockAbilityService.triggerEnemyHurtEvents).toHaveBeenCalledWith(mockPlayer, mockTargetPet);
    });

    it('should trigger knockout event if target health drops below 1', () => {
        mockTargetPet.health = 1;
        mockPet.knockOut = jasmine.createSpy('knockOut');
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify knockout event is set (health goes from 1 to -1)
        expect(mockAbilityService.setKnockOutEvent).toHaveBeenCalledWith({
            callback: jasmine.any(Function),
            priority: 5,
            callbackPet: mockTargetPet
        });
    });

    it('should remove equipment after use', () => {
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify equipment is removed
        expect(mockPet.givePetEquipment).toHaveBeenCalledWith(null);
    });

    it('should handle no available targets', () => {
        // Remove all alive pets
        Object.defineProperty(mockTargetPet, 'alive', {
            value: false,
            writable: true
        });
        spyOn(console, 'warn');
        
        // Execute the callback to set up beforeAttack
        equipment.callback(mockPet);
        
        // Call the beforeAttack method
        mockPet.beforeAttack(gameApi);
        
        // Verify warning and no damage
        expect(console.warn).toHaveBeenCalledWith("egg didn't find target");
        expect(mockPet.calculateDamgae).not.toHaveBeenCalled();
    });
});