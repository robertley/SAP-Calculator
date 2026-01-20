import { Player } from "../../classes/player.class";
import { Battle } from "../../interfaces/battle.interface";
import { LogService } from "../../services/log.service";
import { GameService } from "../../services/game.service";
import { AbilityService } from "../../services/ability/ability.service";
import { AbilityEngine } from "../ability/ability-engine";

export interface EventProcessorContext {
	player: Player;
	opponent: Player;
	logService: LogService;
	gameService: GameService;
	abilityService: AbilityService;
	abilityEngine: AbilityEngine;
	maxTurns: number;
	getBattle: () => Battle | null;
	setBattle: (battle: Battle | null) => void;
	getBattleStarted: () => boolean;
	setBattleStarted: (value: boolean) => void;
	getTurns: () => number;
	setTurns: (value: number) => void;
	incrementPlayerWinner: () => void;
	incrementOpponentWinner: () => void;
	incrementDraw: () => void;
}

export class EventProcessor {
	constructor(private ctx: EventProcessorContext) {}

	executeBattleLoop() {
		while (this.ctx.getBattleStarted()) {
			this.nextTurn();
		}
	}

	startBattle() {
		this.reset();
		this.ctx.setBattleStarted(true);
		this.ctx.setTurns(0);
	}

	reset() {
		this.ctx.player.resetPets();
		this.ctx.opponent.resetPets();
	}

	nextTurn() {
		let finished = false;
		let winner: Player | null = null;
		this.ctx.setTurns(this.ctx.getTurns() + 1);

		let playerAlive = this.ctx.player.alive();
		let opponentAlive = this.ctx.opponent.alive();

		if (playerAlive && !opponentAlive) {
			const revived = this.tryAllEnemiesFaintedToyTrigger(this.ctx.player, this.ctx.opponent);
			opponentAlive = this.ctx.opponent.alive();
			if (!revived) {
				winner = this.ctx.player;
				const battle = this.ctx.getBattle();
				if (battle) {
					battle.winner = 'player';
				}
				this.ctx.incrementPlayerWinner();
				finished = true;
			}
		}
		if (!playerAlive && opponentAlive) {
			const revived = this.tryAllEnemiesFaintedToyTrigger(this.ctx.opponent, this.ctx.player);
			playerAlive = this.ctx.player.alive();
			if (!revived) {
				winner = this.ctx.opponent;
				const battle = this.ctx.getBattle();
				if (battle) {
					battle.winner = 'opponent';
				}
				this.ctx.incrementOpponentWinner();
				finished = true;
			}
		}
		if (!playerAlive && !opponentAlive) {
			this.ctx.incrementDraw();
			finished = true;
		}
		if (finished) {
			this.ctx.logService.printState(this.ctx.player, this.ctx.opponent);
			this.endLog(winner);
			this.ctx.setBattleStarted(false);
			return;
		}

		if (this.ctx.getTurns() >= this.ctx.maxTurns) {
			this.ctx.incrementDraw();
			finished = true;
		}

		if (finished) {
			this.ctx.logService.printState(this.ctx.player, this.ctx.opponent);
			this.endLog(winner);
			this.ctx.setBattleStarted(false);
			return;
		}

		this.pushPetsForwards();
		this.ctx.logService.printState(this.ctx.player, this.ctx.opponent);

		while (true) {
			let originalPlayerAttackingPet = this.ctx.player.pet0;
			let originalOpponentAttackingPet = this.ctx.opponent.pet0;

			if (this.ctx.player.pet0) {
				this.ctx.abilityService.triggerBeforeAttackEvent(this.ctx.player.pet0);
			}
			if (this.ctx.opponent.pet0) {
				this.ctx.abilityService.triggerBeforeAttackEvent(this.ctx.opponent.pet0);
			}
			this.ctx.abilityService.executeBeforeAttackEvents();

			this.ctx.abilityEngine.checkPetsAlive();
			do {
				this.ctx.abilityEngine.abilityCycle();
			} while (this.ctx.abilityService.hasAbilityCycleEvents);

			if (!this.ctx.player.alive() || !this.ctx.opponent.alive()) {
				return;
			}

			this.pushPetsForwards();

			if (originalPlayerAttackingPet && originalPlayerAttackingPet.transformed) {
				originalPlayerAttackingPet = originalPlayerAttackingPet.transformedInto ?? originalPlayerAttackingPet;
			}
			if (originalOpponentAttackingPet && originalOpponentAttackingPet.transformed) {
				originalOpponentAttackingPet = originalOpponentAttackingPet.transformedInto ?? originalOpponentAttackingPet;
			}

			if (this.ctx.player.pet0 == originalPlayerAttackingPet && this.ctx.opponent.pet0 == originalOpponentAttackingPet) {
				break;
			}
		}

		this.ctx.player.resetJumpedFlags();
		this.ctx.opponent.resetJumpedFlags();

		this.fight();
		this.ctx.abilityEngine.checkPetsAlive();

		do {
			this.ctx.abilityEngine.abilityCycle();
		} while (this.ctx.abilityService.hasAbilityCycleEvents);
	}

	fight() {
		const playerPet = this.ctx.player.pet0;
		const opponentPet = this.ctx.opponent.pet0;
		if (!playerPet || !opponentPet) {
			return;
		}

		playerPet.attackPet(opponentPet);
		opponentPet.attackPet(playerPet);

		playerPet.useAttackDefenseEquipment();
		opponentPet.useAttackDefenseEquipment();

		this.ctx.gameService.gameApi.FirstNonJumpAttackHappened = true;
		this.ctx.abilityEngine.checkPetsAlive();
		this.ctx.abilityService.executeAfterAttackEvents();
	}

	pushPetsForwards() {
		this.ctx.player.pushPetsForward();
		this.ctx.opponent.pushPetsForward();
	}

	endLog(winner?: Player | null) {
		let message;
		if (winner == null) {
			message = 'Draw';
		} else if (winner == this.ctx.player) {
			message = 'Player is the winner';
		} else {
			message = 'Opponent is the winner';
		}
		this.ctx.logService.createLog({
			message: message,
			type: 'board'
		});
	}

	private tryAllEnemiesFaintedToyTrigger(winner: Player, loser: Player): boolean {
		if (!winner.toy?.allEnemiesFainted) {
			return false;
		}
		winner.toy.allEnemiesFainted(this.ctx.gameService.gameApi);
		return loser.alive();
	}
}
