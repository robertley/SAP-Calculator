import { describe, it, expect } from 'vitest';
import { runSimulation, SimulationConfig } from '../../../simulation/simulate';
import { LogService } from '../../../src/app/integrations/log.service';
import { parseLogMessage } from '../../../src/app/ui/shell/simulation/app.component.simulation';

describe('Pet Ability Patch Regressions', () => {
    const baseConfig: SimulationConfig = {
        playerPack: 'Custom',
        opponentPack: 'Custom',
        turn: 1,
        playerGoldSpent: 0,
        opponentGoldSpent: 0,
        simulationCount: 1,
        oldStork: false,
        tokenPets: false,
        komodoShuffle: false,
        mana: true,
        playerRollAmount: 0,
        opponentRollAmount: 0,
        playerLevel3Sold: 0,
        opponentLevel3Sold: 0,
        playerSummonedAmount: 0,
        opponentSummonedAmount: 0,
        playerTransformationAmount: 0,
        opponentTransformationAmount: 0,
        playerPets: [null, null, null, null, null],
        opponentPets: [null, null, null, null, null],
    };

    it('Tadpole should transform into a Frog upon fainted (PostRemovalFaint trigger)', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPets: [
                {
                    name: 'Tadpole',
                    attack: 1,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
            opponentPets: [
                {
                    name: 'Elephant',
                    attack: 10,
                    health: 10,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const transformLog = logs.find((log: any) =>
            log.type === 'ability' &&
            typeof log.message === 'string' &&
            log.message.includes('Tadpole transformed into a level 1 Frog')
        );

        expect(transformLog).toBeDefined();
    });

    it('Roadrunner should give Strawberry and +2 attack at StartBattle', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPets: [
                {
                    name: 'Ant',
                    attack: 2,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                {
                    name: 'Roadrunner',
                    attack: 4,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
            ],
            opponentPets: [
                {
                    name: 'Fish',
                    attack: 2,
                    health: 2,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const roadrunnerLog = logs.find((log: any) =>
            log.type === 'ability' &&
            typeof log.message === 'string' &&
            log.message.includes('Roadrunner gave Strawberry and +2 attack to Ant')
        );

        expect(roadrunnerLog).toBeDefined();
    });

    it('Cocoa Bean should transform pet into random enemy before attack', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPets: [
                {
                    name: 'Ant',
                    attack: 1,
                    health: 1,
                    exp: 0,
                    equipment: { name: 'Cocoa Bean' },
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
            opponentPets: [
                {
                    name: 'Elephant',
                    attack: 10,
                    health: 10,
                    exp: 0,
                    equipment: { name: 'Garlic' },
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const cocoaBeanLog = logs.find((log: any) =>
            log.type === 'equipment' &&
            typeof log.message === 'string' &&
            log.message.includes('transformed into Elephant (Cocoa Bean)')
        );

        expect(cocoaBeanLog).toBeDefined();
    });

    it('Mana Hound logs should not leak onerror text when decorated', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPack: 'Unicorn',
            opponentPack: 'Unicorn',
            playerPets: [
                {
                    name: 'Mana Hound',
                    attack: 2,
                    health: 2,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
            opponentPets: [
                {
                    name: 'Ant',
                    attack: 1,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const manaLog = logs.find(
            (log: any) =>
                typeof log.message === 'string' &&
                log.message.includes('Mana Hound'),
        );

        expect(manaLog).toBeDefined();

        const logService = new LogService();
        logService.decorateLogIfNeeded(manaLog);
        const parts = parseLogMessage(manaLog.message ?? '');
        const text = parts
            .map((part) => {
                if (part.type === 'text') {
                    return part.text;
                }
                if (part.type === 'img') {
                    return part.alt || '';
                }
                return '';
            })
            .join(' ')
            .toLowerCase();

        expect(text).toContain('mana hound');
        expect(text).not.toContain('onerror');
        expect(text).not.toContain('this.remove()');
    });

    it('Sea Cucumber logs should not leak onerror text when decorated', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPets: [
                {
                    name: 'Sea Cucumber',
                    attack: 3,
                    health: 5,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
            opponentPets: [
                {
                    name: 'Ant',
                    attack: 1,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const seaCucumberLog = logs.find(
            (log: any) =>
                typeof log.message === 'string' &&
                log.message.includes('Sea Cucumber made') &&
                log.message.includes('Tasty'),
        );

        expect(seaCucumberLog).toBeDefined();

        const logService = new LogService();
        logService.decorateLogIfNeeded(seaCucumberLog);
        const parts = parseLogMessage(seaCucumberLog.message ?? '');
        const text = parts
            .map((part) => {
                if (part.type === 'text') {
                    return part.text;
                }
                if (part.type === 'img') {
                    return part.alt || '';
                }
                return '';
            })
            .join(' ')
            .toLowerCase();

        expect(text).toContain('sea cucumber');
        expect(text).not.toContain('onerror');
        expect(text).not.toContain('this.remove()');
    });

    it('Caramel logs should not leak onerror text when decorated', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPets: [
                {
                    name: 'Ant',
                    attack: 2,
                    health: 2,
                    exp: 0,
                    equipment: { name: 'Caramel' },
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
            opponentPets: [
                {
                    name: 'Pig',
                    attack: 2,
                    health: 5,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const caramelLog = logs.find(
            (log: any) =>
                typeof log.message === 'string' &&
                log.message.includes('lost Caramel equipment'),
        );

        expect(caramelLog).toBeDefined();

        const logService = new LogService();
        logService.decorateLogIfNeeded(caramelLog);
        const parts = parseLogMessage(caramelLog.message ?? '');
        const text = parts
            .map((part) => {
                if (part.type === 'text') {
                    return part.text;
                }
                if (part.type === 'img') {
                    return part.alt || '';
                }
                return '';
            })
            .join(' ')
            .toLowerCase();

        expect(text).toContain('caramel');
        expect(text).not.toContain('onerror');
        expect(text).not.toContain('this.remove()');
    });

    it('Thunderbird should target the nearest pet ahead if the second is missing', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPack: 'Unicorn',
            opponentPack: 'Unicorn',
            playerPets: [
                {
                    name: 'Ant',
                    attack: 1,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                {
                    name: 'Thunderbird',
                    attack: 2,
                    health: 3,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
            ],
            opponentPets: [null, null, null, null, null],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const thunderbirdLog = logs.find((log: any) =>
            log.type === 'ability' &&
            typeof log.message === 'string' &&
            log.message.includes('Thunderbird gave Ant 3 mana.')
        );

        expect(thunderbirdLog).toBeDefined();
    });

    it('Mana Hound should give nearest friend ahead mana per roll (up to 3)', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPack: 'Unicorn',
            opponentPack: 'Unicorn',
            playerRollAmount: 2,
            opponentRollAmount: 0,
            playerPets: [
                {
                    name: 'Ant',
                    attack: 1,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                {
                    name: 'Mana Hound',
                    attack: 4,
                    health: 3,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
            ],
            opponentPets: [null, null, null, null, null],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const manaHoundLog = logs.find((log: any) =>
            log.type === 'ability' &&
            typeof log.message === 'string' &&
            log.message.includes('Mana Hound gave Ant 4 mana.')
        );

        expect(manaHoundLog).toBeDefined();
    });

    it('Chimera should round down after stat calculation', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPack: 'Unicorn',
            opponentPack: 'Unicorn',
            playerPets: [
                {
                    name: 'Chimera',
                    attack: 1,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 1,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
            opponentPets: [
                {
                    name: 'Elephant',
                    attack: 10,
                    health: 10,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const chimeraLog = logs.find((log: any) =>
            log.type === 'ability' &&
            typeof log.message === 'string' &&
            log.message.includes('Chimera Lion 3/4')
        );

        expect(chimeraLog).toBeDefined();
    });

    it('Panther should multiply Pancakes buffs by level', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPack: 'Puppy',
            opponentPack: 'Puppy',
            playerPets: [
                {
                    name: 'Panther',
                    attack: 3,
                    health: 5,
                    exp: 2,
                    equipment: { name: 'Pancakes' },
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                {
                    name: 'Ant',
                    attack: 2,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
            ],
            opponentPets: [
                {
                    name: 'Fish',
                    attack: 2,
                    health: 2,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const pancakesLog = logs.find((log: any) =>
            log.type === 'equipment' &&
            typeof log.message === 'string' &&
            log.message.includes('Ant gained 6 attack and 6 health (Pancakes) x3 (Panther)')
        );

        expect(pancakesLog).toBeDefined();
    });

    it('Donkey should push the last enemy to the enemy front', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPack: 'Star',
            opponentPack: 'Star',
            playerPets: [
                {
                    name: 'Ant',
                    attack: 1,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                {
                    name: 'Donkey',
                    attack: 4,
                    health: 6,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
            ],
            opponentPets: [
                {
                    name: 'Fish',
                    attack: 1,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                {
                    name: 'Camel',
                    attack: 3,
                    health: 5,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                {
                    name: 'Pig',
                    attack: 4,
                    health: 4,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const donkeyLogIndex = logs.findIndex(
            (log: any) =>
                log.type === 'ability' &&
                typeof log.message === 'string' &&
                log.message.includes('Donkey pushed'),
        );

        expect(donkeyLogIndex).toBeGreaterThan(-1);

        const boardLog = logs
            .slice(donkeyLogIndex + 1)
            .find(
                (log: any) =>
                    log.type === 'board' &&
                    typeof log.message === 'string' &&
                    log.message.includes('|'),
            );

        expect(boardLog).toBeDefined();

        const parts = parseLogMessage(boardLog?.message ?? '');
        const text = parts
            .map((part) => {
                if (part.type === 'text') {
                    return part.text;
                }
                if (part.type === 'img') {
                    return part.alt || '';
                }
                return '';
            })
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
        const [playerSide, opponentSide] = text.split('|').map((side) => side.trim());

        expect(playerSide).not.toMatch(/O1\s+Pig/);
        expect(opponentSide).toMatch(/O1\s+Pig/);
        expect(opponentSide).not.toMatch(/O1\s+Camel/);
    });

    it('Onion push should trigger Fairy Dust when the front becomes empty', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPack: 'Unicorn',
            opponentPack: 'Unicorn',
            playerPets: [
                {
                    name: 'Ant',
                    attack: 2,
                    health: 3,
                    exp: 0,
                    equipment: { name: 'Onion' },
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                {
                    name: 'Ant',
                    attack: 2,
                    health: 2,
                    exp: 0,
                    equipment: { name: 'Fairy Dust' },
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
            ],
            opponentPets: [
                {
                    name: 'Ant',
                    attack: 1,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const onionIndex = logs.findIndex(
            (log: any) =>
                log.type === 'equipment' &&
                typeof log.message === 'string' &&
                log.message.includes('(Onion)'),
        );
        const fairyDustIndex = logs.findIndex(
            (log: any) =>
                log.type === 'ability' &&
                typeof log.message === 'string' &&
                log.message.includes('Fairy Dust'),
        );

        expect(onionIndex).toBeGreaterThan(-1);
        expect(fairyDustIndex).toBeGreaterThan(-1);
        expect(onionIndex).toBeLessThan(fairyDustIndex);
    });

    it('Sneaky Egg should faint before spawning a Cracked Egg', () => {
        const config: SimulationConfig = {
            ...baseConfig,
            playerPack: 'Unicorn',
            opponentPack: 'Unicorn',
            playerPets: [
                {
                    name: 'Sneaky Egg',
                    attack: 1,
                    health: 4,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                {
                    name: 'Ant',
                    attack: 2,
                    health: 2,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                {
                    name: 'Ant',
                    attack: 2,
                    health: 2,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                {
                    name: 'Ant',
                    attack: 2,
                    health: 2,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                {
                    name: 'Ant',
                    attack: 2,
                    health: 2,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
            ],
            opponentPets: [
                {
                    name: 'Ant',
                    attack: 1,
                    health: 1,
                    exp: 0,
                    equipment: null,
                    belugaSwallowedPet: null,
                    mana: 0,
                    triggersConsumed: 0,
                    abominationSwallowedPet1: null,
                    abominationSwallowedPet2: null,
                    abominationSwallowedPet3: null,
                    battlesFought: 0,
                    timesHurt: 0,
                },
                null,
                null,
                null,
                null,
            ],
        };

        const result = runSimulation(config);
        const logs = result.battles?.[0]?.logs ?? [];
        const faintIndex = logs.findIndex(
            (log: any) =>
                log.type === 'death' &&
                typeof log.message === 'string' &&
                log.message.includes('Sneaky Egg fainted.'),
        );
        const spawnIndex = logs.findIndex(
            (log: any) =>
                log.type === 'ability' &&
                typeof log.message === 'string' &&
                log.message.includes('Cracked Egg'),
        );
        const noRoomLog = logs.find(
            (log: any) =>
                typeof log.message === 'string' &&
                log.message.includes('No room to spawn CrackedEgg!'),
        );

        expect(faintIndex).toBeGreaterThan(-1);
        expect(spawnIndex).toBeGreaterThan(-1);
        expect(faintIndex).toBeLessThan(spawnIndex);
        expect(noRoomLog).toBeUndefined();
    });
});




