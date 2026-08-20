declare module 'lucide-react' {
  import * as React from 'react'

  export type IconProps = React.SVGProps<SVGSVGElement> & {
    size?: number | string
    className?: string
  }

  export const Bell: React.FC<IconProps>
  export const BriefcaseBusiness: React.FC<IconProps>
  export const Building2: React.FC<IconProps>
  export const ChartNoAxesCombined: React.FC<IconProps>
  export const Boxes: React.FC<IconProps>
  export const Plus: React.FC<IconProps>
  export const SlidersHorizontal: React.FC<IconProps>
  export const ChevronDown: React.FC<IconProps>
  export const ClipboardList: React.FC<IconProps>
  export const ContactRound: React.FC<IconProps>
  export const LayoutDashboard: React.FC<IconProps>
  export const FileText: React.FC<IconProps>
  export const Home: React.FC<IconProps>
  export const Layers3: React.FC<IconProps>
  export const Menu: React.FC<IconProps>
  export const Package: React.FC<IconProps>
  export const Search: React.FC<IconProps>
  export const Settings: React.FC<IconProps>
  export const ShoppingCart: React.FC<IconProps>
  export const UserRound: React.FC<IconProps>
  export const WalletCards: React.FC<IconProps>

  // Fallback for any other icons
  export function Icon(props: IconProps): JSX.Element

  const _default: {
    [key: string]: React.FC<IconProps>
  }

  export default _default
}
