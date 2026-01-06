// src/components/Footer.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Box,
    Container,
    Typography,
    Divider,
    Stack,
    IconButton,
    Tooltip,
    Button,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

import origenLogoDark from "@/logo/origen_logo_transparent.png";
import origenLogoLight from "@/logo/origen_logo_transparentc.png";

function safeDigits(v: string) {
    return (v ?? "").replace(/[^\d]/g, "");
}

export default function Footer() {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    const border = isDark ? "rgba(255,255,255,.10)" : "rgba(15,23,42,.10)";
    const bg = isDark ? "rgba(255,255,255,.02)" : "#FFFFFF";
    const subBg = isDark ? "rgba(255,255,255,.03)" : "#F8FAFC";
    const textMuted = alpha(theme.palette.text.primary, isDark ? 0.70 : 0.72);

    const logoSrc = isDark ? origenLogoDark : origenLogoLight;

    // Contactos desde env (opcional)
    const whatsappNumber = safeDigits(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "");
    const quoteEmail = process.env.NEXT_PUBLIC_QUOTE_EMAIL ?? "ventas@origen.com";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

    const waHref = whatsappNumber
        ? `https://wa.me/${whatsappNumber}`
        : `https://wa.me/`;

    const mailHref = `mailto:${quoteEmail}?subject=${encodeURIComponent(
        "Contacto - Origen"
    )}`;

    // ✅ JSON-LD (SEO)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Origen Dotaciones y Confecciones B&R",
        url: siteUrl,
        // Ideal: si tienes logo en /public, usa una URL absoluta aquí.
        // Si no, lo dejamos con favicon por defecto o lo actualizas luego.
        logo: `${siteUrl}/favicon.ico`,
        address: {
            "@type": "PostalAddress",
            addressLocality: "Cali",
            addressRegion: "Valle del Cauca",
            addressCountry: "CO",
        },
        areaServed: [
            { "@type": "City", name: "Cali" },
            { "@type": "Country", name: "Colombia" },
        ],
        email: quoteEmail,
        telephone: whatsappNumber ? `+${whatsappNumber}` : undefined,
    };

    return (
        <Box
            component="footer"
            sx={{
                mt: 6,
                borderTop: `1px solid ${border}`,
                background: bg,
            }}
        >
            {/* JSON-LD para SEO */}
            <Box
                component="script"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Container maxWidth="lg">
                <Box
                    sx={{
                        py: 4,
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1.4fr .8fr .8fr" },
                        gap: 3,
                        alignItems: "start",
                    }}
                >
                    {/* Marca + Descripción */}
                    <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                            <Box
                                sx={{
                                    position: "relative",
                                    width: { xs: 210, sm: 240, md: 280 },
                                    height: { xs: 56, sm: 64, md: 72 },
                                }}
                            >
                                <Image
                                    src={logoSrc}
                                    alt="Origen Dotaciones"
                                    fill
                                    sizes="(max-width: 600px) 210px, (max-width: 900px) 240px, 280px"
                                    style={{ objectFit: "contain" }}
                                    priority
                                />
                            </Box>
                        </Box>

                        <Typography
                            component="h2"
                            sx={{ mt: 1.2, fontWeight: 900, fontSize: 16 }}
                        >
                            Origen dotaciones y confecciones B&R
                        </Typography>

                        <Typography sx={{ mt: 0.6, color: textMuted, lineHeight: 1.6 }}>
                            Empresa colombiana ubicada en Cali, con más de 5 años en la confección
                            de dotación para empresas. Nos enfocamos en la calidad y la satisfacción
                            de nuestros clientes. Realizamos envíos en Cali y a nivel nacional.
                        </Typography>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.2}
                            sx={{ mt: 2 }}
                        >
                            <Button
                                component={Link}
                                href="/cotizacion"
                                variant="contained"
                                sx={{ borderRadius: 999, fontWeight: 900, textTransform: "none" }}
                            >
                                Cotizar ahora
                            </Button>

                            <Button
                                component={Link}
                                href="/#categorias"
                                variant="outlined"
                                sx={{
                                    borderRadius: 999,
                                    fontWeight: 900,
                                    textTransform: "none",
                                    borderColor: border,
                                    color: theme.palette.text.primary,
                                    "&:hover": {
                                        background: alpha(theme.palette.text.primary, isDark ? 0.06 : 0.04),
                                    },
                                }}
                            >
                                Ver categorías
                            </Button>
                        </Stack>

                        {/* “sellos” / info rápida */}
                        <Box
                            sx={{
                                mt: 2.2,
                                display: "grid",
                                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                                gap: 1,
                            }}
                        >
                            <Box
                                sx={{
                                    p: 1.2,
                                    borderRadius: 3,
                                    border: `1px solid ${border}`,
                                    background: subBg,
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "center",
                                }}
                            >
                                <VerifiedOutlinedIcon />
                                <Box>
                                    <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                                        Calidad garantizada
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: textMuted }}>
                                        Materiales y confección cuidadosa
                                    </Typography>
                                </Box>
                            </Box>

                            <Box
                                sx={{
                                    p: 1.2,
                                    borderRadius: 3,
                                    border: `1px solid ${border}`,
                                    background: subBg,
                                    display: "flex",
                                    gap: 1,
                                    alignItems: "center",
                                }}
                            >
                                <LocalShippingOutlinedIcon />
                                <Box>
                                    <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                                        Envíos Cali y nacional
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: textMuted }}>
                                        Cotiza y coordinamos entrega
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                            <Tooltip title="WhatsApp">
                                <IconButton
                                    component="a"
                                    href={waHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Contacto por WhatsApp"
                                    sx={{
                                        borderRadius: 999,
                                        border: `1px solid ${border}`,
                                        background: subBg,
                                        "&:hover": { background: alpha(theme.palette.primary.main, 0.08) },
                                    }}
                                >
                                    <WhatsAppIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Email">
                                <IconButton
                                    component="a"
                                    href={mailHref}
                                    aria-label="Contacto por email"
                                    sx={{
                                        borderRadius: 999,
                                        border: `1px solid ${border}`,
                                        background: subBg,
                                        "&:hover": { background: alpha(theme.palette.primary.main, 0.08) },
                                    }}
                                >
                                    <EmailOutlinedIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Cali, Colombia">
                                <IconButton
                                    aria-label="Ubicación"
                                    sx={{
                                        borderRadius: 999,
                                        border: `1px solid ${border}`,
                                        background: subBg,
                                        cursor: "default",
                                    }}
                                >
                                    <LocationOnOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    {/* Navegación (SEO: nav con links internos) */}
                    <Box component="nav" aria-label="Enlaces del sitio">
                        <Typography component="h2" sx={{ fontWeight: 900, mb: 1 }}>
                            Navegación
                        </Typography>

                        <Stack spacing={1}>
                            <Typography
                                component={Link}
                                href="/"
                                sx={{ color: theme.palette.text.primary, textDecoration: "none", fontWeight: 700 }}
                            >
                                Inicio
                            </Typography>
                            <Typography
                                component={Link}
                                href="/#categorias"
                                sx={{ color: theme.palette.text.primary, textDecoration: "none", fontWeight: 700 }}
                            >
                                Categorías
                            </Typography>
                            <Typography
                                component={Link}
                                href="/#destacados"
                                sx={{ color: theme.palette.text.primary, textDecoration: "none", fontWeight: 700 }}
                            >
                                Productos destacados
                            </Typography>
                            <Typography
                                component={Link}
                                href="/cotizacion"
                                sx={{ color: theme.palette.text.primary, textDecoration: "none", fontWeight: 700 }}
                            >
                                Cotización
                            </Typography>
                            <Typography
                                component={Link}
                                href="/categoria/todos"
                                sx={{ color: theme.palette.text.primary, textDecoration: "none", fontWeight: 700 }}
                            >
                                Ver todo el catálogo
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Contacto */}
                    <Box aria-label="Contacto">
                        <Typography component="h2" sx={{ fontWeight: 900, mb: 1 }}>
                            Contacto
                        </Typography>

                        <Typography sx={{ color: textMuted, lineHeight: 1.7 }}>
                            ¿Tienes dudas sobre los productos exhibidos o necesitas una dotación personalizada?
                            Escríbenos y te asesoramos.
                        </Typography>

                        <Stack spacing={1} sx={{ mt: 1.2 }}>
                            <Typography sx={{ color: theme.palette.text.primary, fontWeight: 800 }}>
                                Email:
                            </Typography>
                            <Typography
                                component="a"
                                href={mailHref}
                                sx={{ color: theme.palette.text.primary, textDecoration: "none", fontWeight: 700 }}
                            >
                                {quoteEmail}
                            </Typography>

                            <Typography sx={{ color: theme.palette.text.primary, fontWeight: 800, mt: 1 }}>
                                WhatsApp:
                            </Typography>
                            <Typography
                                component="a"
                                href={waHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{ color: theme.palette.text.primary, textDecoration: "none", fontWeight: 700 }}
                            >
                                {whatsappNumber ? `+${whatsappNumber}` : "Abrir WhatsApp"}
                            </Typography>

                            <Typography sx={{ color: theme.palette.text.primary, fontWeight: 800, mt: 1 }}>
                                Ubicación:
                            </Typography>
                            <Typography sx={{ color: textMuted }}>
                                Cali, Valle del Cauca, Colombia
                            </Typography>
                        </Stack>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: border }} />

                {/* Barra inferior */}
                <Box
                    sx={{
                        py: 2,
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <Typography variant="body2" sx={{ color: textMuted }}>
                        © {new Date().getFullYear()} Origen dotaciones y confecciones B&R. Todos los derechos reservados.
                    </Typography>

                    <Stack direction="row" spacing={2} component="nav" aria-label="Enlaces legales">
                        <Typography
                            component={Link}
                            href="/"
                            sx={{ color: textMuted, textDecoration: "none", fontWeight: 700 }}
                        >
                            Política de privacidad
                        </Typography>
                        <Typography
                            component={Link}
                            href="/"
                            sx={{ color: textMuted, textDecoration: "none", fontWeight: 700 }}
                        >
                            Términos
                        </Typography>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}
