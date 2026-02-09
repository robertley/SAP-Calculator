import {
  getEquipmentIconPath,
  getPetIconPath,
  getToyIconPath,
} from 'app/runtime/asset-catalog';

export type InlineIconType = 'pet' | 'toy' | 'equipment';

export function buildNameRegex(names: string[]): RegExp | null {
  const escaped = names
    .filter((name) => Boolean(name))
    .sort((a, b) => b.length - a.length)
    .map((name) => escapeRegExp(name));
  if (!escaped.length) {
    return null;
  }
  return new RegExp(
    `(?<![A-Za-z0-9])(${escaped.join('|')})(?![A-Za-z0-9])`,
    'g',
  );
}

export function buildInlineNameTypeMap(
  petNames: string[],
  toyNames: string[],
  equipmentNames: string[],
): Map<string, InlineIconType> {
  const map = new Map<string, InlineIconType>();
  for (const name of equipmentNames) {
    if (name) {
      map.set(name, 'equipment');
    }
  }
  for (const name of toyNames) {
    if (name) {
      map.set(name, 'toy');
    }
  }
  for (const name of petNames) {
    if (name) {
      map.set(name, 'pet');
    }
  }
  return map;
}

export function buildInlineNameRegex(
  petNames: string[],
  toyNames: string[],
  equipmentNames: string[],
): RegExp | null {
  const combined = new Set<string>();
  petNames.forEach((name) => name && combined.add(name));
  toyNames.forEach((name) => name && combined.add(name));
  equipmentNames.forEach((name) => name && combined.add(name));
  return buildNameRegex(Array.from(combined));
}

export function decorateInlineIcons(
  message: string,
  inlineNameRegex: RegExp | null,
  inlineNameTypeMap: Map<string, InlineIconType>,
  ailmentNames: Set<string>,
): string {
  if (!message || message.includes('<img') || !inlineNameRegex) {
    return message;
  }
  let updated = replaceMatchesWithIconsOutsideTags(
    message,
    inlineNameRegex,
    (name) => getInlineIconPath(name, inlineNameTypeMap, ailmentNames),
    (name) => getInlineIconHtml(name, inlineNameTypeMap, ailmentNames),
  );
  const manaIcon =
    'assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/mana.png';
  const manaRegex = /(?<![A-Za-z0-9])mana(?![A-Za-z0-9])(?!\s+Potion)/gi;
  updated = replaceMatchesWithIconsOutsideTags(updated, manaRegex, () => manaIcon);
  const expIcon =
    'assets/art/Public/Public/Icons/TextMap-resources.assets-31-split/xp.png';
  const expRegex = /(?<![A-Za-z0-9])(?:xp|exp)(?![A-Za-z0-9])/gi;
  updated = replaceMatchesWithIconsOutsideTags(updated, expRegex, () => expIcon);
  return updated;
}

export function getInlineIconPath(
  name: string,
  inlineNameTypeMap: Map<string, InlineIconType>,
  ailmentNames: Set<string>,
): string | null {
  const type = inlineNameTypeMap.get(name) ?? null;
  if (type === 'pet') {
    return getPetIconPath(name);
  }
  if (type === 'toy') {
    return getToyIconPath(name);
  }
  if (type === 'equipment') {
    const isAilment = ailmentNames.has(name);
    return (
      getEquipmentIconPath(name, isAilment) ?? getEquipmentIconPath(name, !isAilment)
    );
  }
  return null;
}

export function getInlineIconHtml(
  name: string,
  inlineNameTypeMap: Map<string, InlineIconType>,
  ailmentNames: Set<string>,
): string | null {
  const type = inlineNameTypeMap.get(name) ?? null;
  if (type !== 'equipment') {
    return null;
  }
  const isAilment = ailmentNames.has(name);
  const primary = getEquipmentIconPath(name, isAilment);
  if (!primary) {
    return null;
  }
  const secondary = getEquipmentIconPath(name, !isAilment);
  const secondaryAttr = secondary
    ? `this.dataset.step='1';this.src='${secondary}';`
    : `this.dataset.step='1';`;
  return `<img src="${primary}" class="log-inline-icon" alt="${name}" onerror="if(!this.dataset.step){${secondaryAttr}return;}this.remove();"> ${name}`;
}

export function replaceMatchesWithIconsOutsideTags(
  message: string,
  regex: RegExp,
  getIcon: (name: string) => string | null,
  getHtml?: (name: string, icon: string | null) => string | null,
): string {
  return message
    .split(/(<[^>]+>)/g)
    .map((segment) =>
      segment.startsWith('<')
        ? segment
        : replaceMatchesWithIcons(segment, regex, getIcon, getHtml),
    )
    .join('');
}

function replaceMatchesWithIcons(
  message: string,
  regex: RegExp,
  getIcon: (name: string) => string | null,
  getHtml?: (name: string, icon: string | null) => string | null,
): string {
  if (!regex) {
    return message;
  }
  return message.replace(regex, (match) => {
    const icon = getIcon(match);
    if (getHtml) {
      const html = getHtml(match, icon);
      if (html) {
        return html;
      }
    }
    if (!icon) {
      return match;
    }
    return `<img src="${icon}" class="log-inline-icon" alt="${match}" onerror="this.remove()"> ${match}`;
  });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
