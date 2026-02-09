import { Log } from 'app/domain/interfaces/log.interface';

export function getMergedAttackHealthMessage(
  lastLog: Log | undefined,
  nextLog: Log,
): string | null {
  if (!lastLog || !nextLog) {
    return null;
  }
  if (lastLog.player !== nextLog.player) {
    return null;
  }
  if (lastLog.type !== nextLog.type) {
    return null;
  }
  if (lastLog.randomEvent !== nextLog.randomEvent) {
    return null;
  }
  if (lastLog.randomEventReason !== nextLog.randomEventReason) {
    return null;
  }
  if (
    lastLog.sourcePet !== nextLog.sourcePet ||
    lastLog.sourceIndex !== nextLog.sourceIndex
  ) {
    return null;
  }
  if (
    lastLog.targetPet !== nextLog.targetPet ||
    lastLog.targetIndex !== nextLog.targetIndex
  ) {
    return null;
  }
  if (lastLog.tiger !== nextLog.tiger) {
    return null;
  }
  if (lastLog.puma !== nextLog.puma) {
    return null;
  }
  if (lastLog.pteranodon !== nextLog.pteranodon) {
    return null;
  }
  const lastPanther = lastLog.pantherMultiplier ?? null;
  const nextPanther = nextLog.pantherMultiplier ?? null;
  if (lastPanther !== nextPanther) {
    return null;
  }

  const lastText = stripTags(lastLog.rawMessage ?? lastLog.message ?? '');
  const nextText = stripTags(nextLog.rawMessage ?? nextLog.message ?? '');
  if (!lastText || !nextText) {
    return null;
  }
  if (
    lastText.includes(' attack and ') ||
    lastText.includes(' health and ') ||
    nextText.includes(' attack and ') ||
    nextText.includes(' health and ')
  ) {
    return null;
  }

  return (
    combineAttackHealthLogs(lastText, nextText) ??
    combineAttackHealthLogs(nextText, lastText)
  );
}

function combineAttackHealthLogs(
  attackLog: string,
  healthLog: string,
): string | null {
  const lossAttack = parseStatLog(attackLog, 'lost', 'attack');
  const lossHealth = parseStatLog(healthLog, 'lost', 'health');
  if (lossAttack && lossHealth) {
    if (
      lossAttack.prefix === lossHealth.prefix &&
      lossAttack.suffix === lossHealth.suffix
    ) {
      return `${lossAttack.prefix}${lossAttack.value} attack and ${lossHealth.value} health${lossAttack.suffix}`;
    }
  }

  const gainAttack = parseStatLog(attackLog, 'gave', 'attack');
  const gainHealth = parseStatLog(healthLog, 'gave', 'health');
  if (gainAttack && gainHealth) {
    if (
      gainAttack.prefix === gainHealth.prefix &&
      gainAttack.suffix === gainHealth.suffix
    ) {
      return `${gainAttack.prefix}${gainAttack.plus}${gainAttack.value} attack and ${gainHealth.plus}${gainHealth.value} health${gainAttack.suffix}`;
    }
  }

  return null;
}

function parseStatLog(
  message: string,
  verb: 'lost' | 'gave',
  stat: 'attack' | 'health',
): { prefix: string; plus: string; value: string; suffix: string } | null {
  if (verb === 'lost') {
    const regex = new RegExp(`^(.*\\blost\\s+)(\\d+)\\s+${stat}\\b(.*)$`, 'i');
    const match = message.match(regex);
    if (!match) {
      return null;
    }
    return {
      prefix: match[1],
      plus: '',
      value: match[2],
      suffix: match[3],
    };
  }

  const regex = new RegExp(
    `^(.*\\b(?:gave|give|gives)\\b.*?\\s+)(\\+?)(\\d+)\\s+${stat}\\b(.*)$`,
    'i',
  );
  const match = message.match(regex);
  if (!match) {
    return null;
  }
  return {
    prefix: match[1],
    plus: match[2] ?? '',
    value: match[3],
    suffix: match[4],
  };
}

function stripTags(message: string): string {
  return message.replace(/<[^>]+>/g, '').trim();
}
