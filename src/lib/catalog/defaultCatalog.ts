// src/lib/catalog/defaultCatalog.ts
import type { Catalog } from "@/types/catalog";

// ✅ Imágenes locales (src/image/)
import administrativoImg from "@/image/administrativo.jpg";
import antifluidoImg from "@/image/antifluido.jpg";
import empresarialImg from "@/image/empresarial.jpg";
import industrialImg from "@/image/industrial.jpg";
import oficinaImg from "@/image/oficina.jpg";
import bannerImg from "@/image/banner.jpg";
import bannerImg2 from "@/image/banner2.jpg";
import bannerImg3 from "@/image/banner3.jpg";


export const defaultCatalog: Catalog = {
  updatedAt: new Date().toISOString(),

  categories: [
    { id: "cat-industrial", slug: "industrial", name: "Industrial", description: "Dotación para planta, bodega y operación", icon: "Engineering", order: 1 },
    { id: "cat-enfermeria", slug: "enfermeria", name: "Enfermería", description: "Uniformes para personal asistencial", icon: "LocalHospital", order: 2 },
    { id: "cat-empresarial", slug: "empresarial", name: "Empresarial", description: "Presentación corporativa y dotación formal", icon: "BusinessCenter", order: 3 },
    { id: "cat-administrativo", slug: "administrativo", name: "Administrativo", description: "Uniformes cómodos para área administrativa", icon: "AssignmentInd", order: 4 },
    { id: "cat-oficina", slug: "oficina", name: "Oficina", description: "Prendas para oficina y atención al cliente", icon: "WorkOutline", order: 5 },
    { id: "cat-antifluido", slug: "antifluido", name: "Antifluido", description: "Prendas antifluido para salud y servicios", icon: "HealthAndSafety", order: 6 },
  ],

  products: [
    // ===================== INDUSTRIAL =====================
    {
      id: "p-ind-001",
      slug: "overol-industrial-ripstop",
      ref: "ORI-IND-001",
      name: "Overol industrial Ripstop",
      description: "Overol resistente para operación. Tela ripstop, costuras reforzadas y excelente durabilidad.",
      categorySlugs: ["industrial"],
      images: [
        { url: industrialImg.src, alt: "Industrial (principal)" }, // ✅ local
        { url: "https://picsum.photos/seed/origen-ind-001-b/1200/900", alt: "Overol industrial (detalle tela)" },
        { url: "https://picsum.photos/seed/origen-ind-001-c/1200/900", alt: "Overol industrial (costuras)" },
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Azul", "Gris", "Negro"],
      showPrice: false,
      featured: true,
      tags: ["Industrial", "Top"],
    },
    {
      id: "p-ind-002",
      slug: "camisa-industrial-manga-larga",
      ref: "ORI-IND-002",
      name: "Camisa industrial manga larga",
      description: "Camisa de trabajo cómoda y resistente. Ideal para logística, bodega y planta.",
      categorySlugs: ["industrial"],
      images: [
        { url: industrialImg.src, alt: "Industrial (principal)" }, // ✅ local
        { url: "https://picsum.photos/seed/origen-ind-002-b/1200/900", alt: "Camisa industrial (detalle bolsillo)" },
      ],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Azul", "Gris", "Beige"],
      showPrice: false,
      featured: false,
      tags: ["Industrial"],
    },
    {
      id: "p-ind-003",
      slug: "pantalon-industrial-cargo",
      ref: "ORI-IND-003",
      name: "Pantalón industrial cargo",
      description: "Pantalón tipo cargo con bolsillos funcionales. Resistente y cómodo para uso diario.",
      categorySlugs: ["industrial"],
      images: [
        { url: industrialImg.src, alt: "Industrial (principal)" }, // ✅ local
        { url: "https://picsum.photos/seed/origen-ind-003-b/1200/900", alt: "Pantalón cargo (detalle bolsillos)" },
      ],
      sizes: ["28", "30", "32", "34", "36", "38"],
      colors: ["Negro", "Gris", "Caqui"],
      showPrice: false,
      featured: false,
      tags: ["Industrial"],
    },

    // ===================== ENFERMERIA =====================
    // (No tienes imagen "enfermeria.jpg", así que reutilizo antifluido.jpg como principal ✅)
    {
      id: "p-enf-001",
      slug: "uniforme-enfermeria-scrub-basico",
      ref: "ORI-ENF-001",
      name: "Uniforme enfermería (scrub) básico",
      description: "Conjunto scrub cómodo para jornadas largas. Fácil de lavar y de secado rápido.",
      categorySlugs: ["enfermeria"],
      images: [
        { url: antifluidoImg.src, alt: "Enfermería (principal)" }, // ✅ local (reusada)
        { url: "https://picsum.photos/seed/origen-enf-001-b/1200/900", alt: "Scrub (detalle tela)" },
        { url: "https://picsum.photos/seed/origen-enf-001-c/1200/900", alt: "Scrub (bolsillos)" },
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Azul", "Verde", "Negro"],
      showPrice: true,
      price: 99000,
      currency: "COP",
      featured: true,
      tags: ["Salud", "Recomendado"],
    },
    {
      id: "p-enf-002",
      slug: "filipina-enfermeria-premium",
      ref: "ORI-ENF-002",
      name: "Filipina enfermería premium",
      description: "Filipina con mejor caída y ajuste. Ideal para imagen profesional en clínica y consultorio.",
      categorySlugs: ["enfermeria"],
      images: [
        { url: antifluidoImg.src, alt: "Enfermería (principal)" }, // ✅ local (reusada)
        { url: "https://picsum.photos/seed/origen-enf-002-b/1200/900", alt: "Filipina (detalle cuello)" },
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Blanco", "Azul", "Negro"],
      showPrice: true,
      price: 85000,
      currency: "COP",
      featured: false,
      tags: ["Salud"],
    },

    // ===================== EMPRESARIAL =====================
    {
      id: "p-emp-001",
      slug: "camisa-empresarial-corporativa",
      ref: "ORI-EMP-001",
      name: "Camisa empresarial corporativa",
      description: "Camisa formal para dotación empresarial. Ideal para equipos comerciales y atención.",
      categorySlugs: ["empresarial"],
      images: [
        { url: empresarialImg.src, alt: "Empresarial (principal)" }, // ✅ local
        { url: "https://picsum.photos/seed/origen-emp-001-b/1200/900", alt: "Camisa corporativa (detalle puño)" },
        { url: "https://picsum.photos/seed/origen-emp-001-c/1200/900", alt: "Camisa corporativa (detalle cuello)" },
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Blanco", "Azul", "Negro"],
      showPrice: false,
      featured: true,
      tags: ["Corporativo", "Top"],
    },
    {
      id: "p-emp-002",
      slug: "chaleco-empresarial-ejecutivo",
      ref: "ORI-EMP-002",
      name: "Chaleco empresarial ejecutivo",
      description: "Chaleco corporativo para uniformes de alta presentación. Ideal para recepción y eventos.",
      categorySlugs: ["empresarial"],
      images: [
        { url: empresarialImg.src, alt: "Empresarial (principal)" }, // ✅ local
        { url: "https://picsum.photos/seed/origen-emp-002-b/1200/900", alt: "Chaleco ejecutivo (detalle botones)" },
      ],
      sizes: ["S", "M", "L", "XL"],
      colors: ["Negro", "Gris"],
      showPrice: false,
      featured: false,
      tags: ["Corporativo"],
    },

    // ===================== ADMINISTRATIVO =====================
    {
      id: "p-adm-001",
      slug: "polo-administrativo-corporativo",
      ref: "ORI-ADM-001",
      name: "Polo administrativo corporativo",
      description: "Polo cómodo y presentable para área administrativa. Ideal para uso diario y atención.",
      categorySlugs: ["administrativo"],
      images: [
        { url: administrativoImg.src, alt: "Administrativo (principal)" }, // ✅ local
        { url: "https://picsum.photos/seed/origen-adm-001-b/1200/900", alt: "Polo corporativo (detalle logo)" },
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["Negro", "Azul", "Blanco"],
      showPrice: false,
      featured: true,
      tags: ["Administrativo"],
    },
    {
      id: "p-adm-002",
      slug: "pantalon-administrativo-formal",
      ref: "ORI-ADM-002",
      name: "Pantalón administrativo formal",
      description: "Pantalón formal cómodo para oficina. Corte moderno y fácil mantenimiento.",
      categorySlugs: ["administrativo"],
      images: [
        { url: administrativoImg.src, alt: "Administrativo (principal)" }, // ✅ local
        { url: "https://picsum.photos/seed/origen-adm-002-b/1200/900", alt: "Pantalón formal (detalle tela)" },
      ],
      sizes: ["28", "30", "32", "34", "36", "38"],
      colors: ["Negro", "Gris"],
      showPrice: false,
      featured: false,
      tags: ["Administrativo"],
    },

    // ===================== OFICINA =====================
    {
      id: "p-ofi-001",
      slug: "blusa-oficina-ejecutiva",
      ref: "ORI-OFI-001",
      name: "Blusa de oficina ejecutiva",
      description: "Blusa elegante para dotación de oficina y atención al cliente. Fresca y cómoda.",
      categorySlugs: ["oficina"],
      images: [
        { url: oficinaImg.src, alt: "Oficina (principal)" }, // ✅ local
        { url: "https://picsum.photos/seed/origen-ofi-001-b/1200/900", alt: "Blusa ejecutiva (detalle cuello)" },
        { url: "https://picsum.photos/seed/origen-ofi-001-c/1200/900", alt: "Blusa ejecutiva (detalle manga)" },
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Blanco", "Azul", "Negro"],
      showPrice: false,
      featured: false,
      tags: ["Oficina"],
    },
    {
      id: "p-ofi-002",
      slug: "pantalon-oficina-stretch",
      ref: "ORI-OFI-002",
      name: "Pantalón oficina stretch",
      description: "Pantalón stretch con buena movilidad. Ideal para jornada completa en oficina.",
      categorySlugs: ["oficina"],
      images: [
        { url: oficinaImg.src, alt: "Oficina (principal)" }, // ✅ local
        { url: "https://picsum.photos/seed/origen-ofi-002-b/1200/900", alt: "Pantalón stretch (detalle pretina)" },
      ],
      sizes: ["28", "30", "32", "34", "36", "38"],
      colors: ["Negro", "Azul oscuro", "Gris"],
      showPrice: false,
      featured: true,
      tags: ["Oficina", "Recomendado"],
    },

    // ===================== ANTIFLUIDO =====================
    {
      id: "p-af-001",
      slug: "bata-antifluido-clasica",
      ref: "ORI-AF-001",
      name: "Bata antifluido clásica",
      description: "Bata antifluido ideal para clínicas y laboratorios. Cómoda, ligera y fácil de limpiar.",
      categorySlugs: ["antifluido"],
      images: [
        { url: antifluidoImg.src, alt: "Antifluido (principal)" }, // ✅ local
        { url: "https://picsum.photos/seed/origen-af-001-b/1200/900", alt: "Bata antifluido (detalle cierre)" },
        { url: "https://picsum.photos/seed/origen-af-001-c/1200/900", alt: "Bata antifluido (detalle tela)" },
      ],
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Blanco", "Azul", "Verde"],
      showPrice: true,
      price: 85000,
      currency: "COP",
      featured: true,
      tags: ["Antifluido", "Salud"],
    },
    {
      id: "p-af-002",
      slug: "delantal-antifluido-servicio",
      ref: "ORI-AF-002",
      name: "Delantal antifluido de servicio",
      description: "Delantal antifluido para servicios y manipulación. Protege y es fácil de lavar.",
      categorySlugs: ["antifluido"],
      images: [
        { url: antifluidoImg.src, alt: "Antifluido (principal)" }, // ✅ local
        { url: "https://picsum.photos/seed/origen-af-002-b/1200/900", alt: "Delantal antifluido (detalle ajuste)" },
      ],
      sizes: ["Única"],
      colors: ["Negro", "Azul", "Verde"],
      showPrice: false,
      featured: false,
      tags: ["Antifluido"],
    },
    {
      id: "p-af-003",
      slug: "gorro-antifluido-clinico",
      ref: "ORI-AF-003",
      name: "Gorro antifluido clínico",
      description: "Gorro clínico antifluido. Ajuste cómodo, ideal para cocina, clínica y laboratorio.",
      categorySlugs: ["antifluido"],
      images: [
        { url: antifluidoImg.src, alt: "Antifluido (principal)" }, // ✅ local
        { url: "https://picsum.photos/seed/origen-af-003-b/1200/900", alt: "Gorro (detalle ajuste)" },
      ],
      sizes: ["Única"],
      colors: ["Azul", "Verde", "Negro"],
      showPrice: false,
      featured: false,
      tags: ["Antifluido"],
    },
  ],

  banners: [
    {
      id: "b1",
      title: "Dotación empresarial Origen",
      subtitle: "Cotiza rápido • Atención para empresas",
      imageUrl: bannerImg2.src, // ✅ local
      ctaLabel: "Ver categorías",
      ctaHref: "/#categorias",
      order: 1,
    },
    {
      id: "b2",
      title: "Industrial • Oficina • Antifluido",
      subtitle: "Uniformes • Personalización • Entregas",
      imageUrl: bannerImg.src, // ✅ local
      ctaLabel: "Ver destacados",
      ctaHref: "/#destacados",
      order: 2,
    },
        {
      id: "b3",
      title: "Dotación empresarial Origen",
      subtitle: "Cotiza rápido • Atención para empresas",
      imageUrl: bannerImg3.src, // ✅ local
      ctaLabel: "Ver categorías",
      ctaHref: "/#categorias",
      order: 1,
    },
  ],
};
