import { colors } from '../tokens';
import { AppText, type AppTextProps } from './app-text';

/** Büyük harfli, aralıklı üst başlık (ör. "1. DURAK · SEVİYE 3"). */
export function Eyebrow({ color = colors.eyebrow, ...rest }: Omit<AppTextProps, 'variant'>) {
  return <AppText variant="eyebrow" color={color} {...rest} />;
}
