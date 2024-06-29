import { QInputProps, QSelect } from 'quasar';
import { t } from 'src/boot/i18n';

export function requiredValidator(input: QInputProps['modelValue'] | QSelect) {
  if (input?.toString().trim() || input === 0) {
    return true;
  }

  return t('validations.required');
}

export function numberValidator(input: QInputProps['modelValue']) {
  const str = input?.toString() ?? '';
  const value = Number(str);
  if (isNaN(value)) {
    return t('validations.shouldBeNumber');
  }
  return true;
}
