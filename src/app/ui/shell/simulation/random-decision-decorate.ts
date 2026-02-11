import { LogMessagePart, parseLogMessage } from './app.component.simulation-log';
import { AILMENT_CATEGORIES } from 'app/integrations/equipment/equipment-categories';
import {
  buildInlineNameRegex,
  buildInlineNameTypeMap,
  decorateInlineIcons,
} from 'app/integrations/log/log-inline-icons';
import {
  getAllEquipmentNames,
  getAllPetNames,
  getAllToyNames,
} from 'app/runtime/asset-catalog';

const PET_NAMES = getAllPetNames();
const TOY_NAMES = getAllToyNames();
const EQUIPMENT_NAMES = getAllEquipmentNames();
const INLINE_NAME_TYPE_MAP = buildInlineNameTypeMap(
  PET_NAMES,
  TOY_NAMES,
  EQUIPMENT_NAMES,
);
const INLINE_NAME_REGEX = buildInlineNameRegex(
  PET_NAMES,
  TOY_NAMES,
  EQUIPMENT_NAMES,
);
const AILMENT_NAMES = new Set(
  Object.values(AILMENT_CATEGORIES).flat().filter(Boolean),
);

export function decorateRandomDecisionTextParts(text: string): LogMessagePart[] {
  const decorated = decorateInlineIcons(
    text ?? '',
    INLINE_NAME_REGEX,
    INLINE_NAME_TYPE_MAP,
    AILMENT_NAMES,
  );
  return parseLogMessage(decorated);
}
