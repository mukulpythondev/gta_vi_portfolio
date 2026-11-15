import {
  Building2,
  Camera,
  Code2,
  Flag,
  Layers3,
  MapPin,
  Phone,
  Trophy,
  UserRound,
} from "lucide-react";
export function DistrictIcon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  const Icon =
    (
      {
        building: Building2,
        camera: Camera,
        code: Code2,
        flag: Flag,
        layers: Layers3,
        phone: Phone,
        trophy: Trophy,
        user: UserRound,
      } as Record<string, typeof MapPin>
    )[name] ?? MapPin;
  return <Icon size={size} aria-hidden="true" />;
}
