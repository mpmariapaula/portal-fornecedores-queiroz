import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portal de Fornecedores | Grupo Queiroz",
  description: "Portal financeiro para consulta de títulos e valores em aberto dos fornecedores do Grupo Queiroz.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
