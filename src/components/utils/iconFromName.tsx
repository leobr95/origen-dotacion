// src/components/utils/iconFromName.tsx
"use client";

import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";

type IconComponent = typeof CategoryOutlinedIcon;

export function iconFromName(name?: string): IconComponent {
  switch ((name ?? "").trim()) {
    case "Engineering":
      return EngineeringOutlinedIcon;
    case "HealthAndSafety":
      return HealthAndSafetyOutlinedIcon;
    case "Shield":
      return ShieldOutlinedIcon;
    case "Construction":
      return ConstructionOutlinedIcon;
    case "LocalHospital":
      return LocalHospitalOutlinedIcon;
    default:
      return CategoryOutlinedIcon;
  }
}
