"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  DemoState,
  Filter,
  TitleItem,
  View,
} from "./types/financial-title";

type FontScale = "normal" | "large" | "largest";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR");

const today = new Date();
today.setHours(0, 0, 0, 0);

function dateFromToday(days: number) {
  const date = new Date(today);
  date.setDate(date.getDate() + days);
  return date;
}

const titleItems: TitleItem[] = [
  {
    id: "TIT-2025-0187",
    description: "Fornecimento de materiais",
    issuedAt: dateFromToday(-74),
    dueAt: dateFromToday(-44),
    nominalValue: 4850,
    paidValue: 1250,
  },
  {
    id: "TIT-2025-0214",
    description: "Serviços de manutenção",
    issuedAt: dateFromToday(-57),
    dueAt: dateFromToday(-27),
    nominalValue: 2780.4,
    paidValue: 0,
  },
  {
    id: "TIT-2025-0259",
    description: "Locação de equipamentos",
    issuedAt: dateFromToday(-39),
    dueAt: dateFromToday(-9),
    nominalValue: 1960,
    paidValue: 400,
  },
  {
    id: "TIT-2025-0312",
    description: "Insumos para operação",
    issuedAt: dateFromToday(-30),
    dueAt: dateFromToday(0),
    nominalValue: 1290.9,
    paidValue: 0,
  },
  {
    id: "TIT-2025-0341",
    description: "Serviços de transporte",
    issuedAt: dateFromToday(-20),
    dueAt: dateFromToday(10),
    nominalValue: 5340,
    paidValue: 1000,
  },
  {
    id: "TIT-2025-0368",
    description: "Fornecimento mensal",
    issuedAt: dateFromToday(-12),
    dueAt: dateFromToday(18),
    nominalValue: 3725.65,
    paidValue: 0,
  },
  {
    id: "TIT-2025-0396",
    description: "Peças e componentes",
    issuedAt: dateFromToday(-3),
    dueAt: dateFromToday(27),
    nominalValue: 2180,
    paidValue: 500,
  },
];

function openValue(item: TitleItem) {
  return item.nominalValue - item.paidValue;
}

function getStatus(item: TitleItem) {
  if (item.dueAt < today) return "overdue";
  if (item.dueAt.getTime() === today.getTime()) return "today";
  return "upcoming";
}

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: "eye" | "eyeOff" | "logout" | "arrowLeft" | "wallet" | "alert" | "calendar" | "chevron";
  className?: string;
}) {
  const paths = {
    eye: (
      <>
        <path d="M2.1 12s3.6-6 9.9-6 9.9 6 9.9 6-3.6 6-9.9 6S2.1 12 2.1 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    eyeOff: (
      <>
        <path d="m3 3 18 18M10.6 6.2A9.8 9.8 0 0 1 12 6c6.3 0 9.9 6 9.9 6a15 15 0 0 1-2.1 2.7M6.6 6.6C3.7 8.4 2.1 12 2.1 12s3.6 6 9.9 6a9.8 9.8 0 0 0 3.4-.6M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      </>
    ),
    logout: (
      <>
        <path d="M9 5H5.8A1.8 1.8 0 0 0 4 6.8v10.4A1.8 1.8 0 0 0 5.8 19H9M15 8l4 4-4 4M19 12H9" />
      </>
    ),
    arrowLeft: <path d="m15 18-6-6 6-6" />,
    wallet: (
      <>
        <path d="M4 7.5V6a2 2 0 0 1 2-2h11M4 7.5h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8a2 2 0 0 1 1-1.7Z" />
        <path d="M16 13h2" />
      </>
    ),
    alert: (
      <>
        <path d="M10.3 4.1 2.7 17.2A1.9 1.9 0 0 0 4.3 20h15.4a1.9 1.9 0 0 0 1.6-2.8L13.7 4.1a1.9 1.9 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths[name]}
    </svg>
  );
}

function Brand({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className={`h-10 w-1 rounded-full ${light ? "bg-white" : "bg-[#16324F]"}`}
      />
      <div>
        <p
          className={`text-xs font-semibold tracking-[0.12em] uppercase ${light ? "text-blue-100" : "text-[#526071]"}`}
        >
          Grupo Queiroz
        </p>
        <p className={`font-semibold ${light ? "text-white" : "text-[#1F2937]"}`}>
          Portal de Fornecedores
        </p>
      </div>
    </div>
  );
}

function AccessibilityControls({
  fontScale,
  onFontScaleChange,
  highContrast,
  onHighContrastChange,
  darkTheme,
  onDarkThemeChange,
}: {
  fontScale: FontScale;
  onFontScaleChange: (scale: FontScale) => void;
  highContrast: boolean;
  onHighContrastChange: (enabled: boolean) => void;
  darkTheme: boolean;
  onDarkThemeChange: (enabled: boolean) => void;
}) {
  const scales: FontScale[] = ["normal", "large", "largest"];
  const scaleLabels: Record<FontScale, string> = {
    normal: "padrão",
    large: "grande",
    largest: "maior",
  };
  const scaleIndex = scales.indexOf(fontScale);

  return (
    <section
      aria-label="Opções de acessibilidade"
      className="flex flex-wrap items-center justify-end gap-2"
    >
      <span aria-live="polite" className="mr-1 text-sm font-medium">
        Texto {scaleLabels[fontScale]}
      </span>
      <button
        aria-label="Diminuir tamanho do texto"
        className="accessibility-button"
        disabled={scaleIndex === 0}
        onClick={() => onFontScaleChange(scales[scaleIndex - 1])}
        type="button"
      >
        A−
      </button>
      <button
        aria-label="Aumentar tamanho do texto"
        className="accessibility-button"
        disabled={scaleIndex === scales.length - 1}
        onClick={() => onFontScaleChange(scales[scaleIndex + 1])}
        type="button"
      >
        A+
      </button>
      <button
        aria-pressed={highContrast}
        className="accessibility-button"
        onClick={() => onHighContrastChange(!highContrast)}
        type="button"
      >
        {highContrast ? "Contraste padrão" : "Alto contraste"}
      </button>
      <button
        aria-pressed={darkTheme}
        className="accessibility-button"
        onClick={() => onDarkThemeChange(!darkTheme)}
        type="button"
      >
        {darkTheme ? "Tema claro" : "Tema escuro"}
      </button>
    </section>
  );
}

  function Login({
    onLogin,
    headingRef,
    accessibilityControls,
  }: {
    onLogin: (nomeFornecedor: string) => void;
    headingRef: React.RefObject<HTMLHeadingElement | null>;
    accessibilityControls: React.ReactNode;
  }) {
  const [supplier, setSupplier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const [error, setError] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);


async function submit(event: React.FormEvent) {
  event.preventDefault();

  if (!supplier.trim() || !password.trim()) {
    setError(true);
    return;
  }

  setError(false);
  setIsSubmitting(true);

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codigo: supplier.trim(),
        senha: password,
      }),
    });

    if (!response.ok) {
      setError(true);
      return;
    }

    const data = await response.json();
    const nomeFornecedor = data?.fornecedor?.nome;

    if (
      typeof nomeFornecedor !== "string" ||
      !nomeFornecedor.trim()
    ) {
      setError(true);
      return;
    }

    onLogin(nomeFornecedor);
  } catch {
    setError(true);
  } finally {
    setIsSubmitting(false);
  }
}

  return (
    <>
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo principal
      </a>
      <main
        className="min-h-screen bg-[#F5F7FA] px-4 py-8 sm:grid sm:place-items-center sm:px-6"
        id="main-content"
        tabIndex={-1}
      >
      <div className="mx-auto grid w-full max-w-[1040px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_70px_rgba(15,45,75,0.12)] md:min-h-[650px] md:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#16324F] p-12 md:flex md:flex-col md:justify-between">
          <Brand light />
          <div className="relative z-10 max-w-sm">
            <div className="mb-6 h-1 w-12 rounded-full bg-[#2563EB]" />
            <h2 className="text-[2.55rem] leading-[1.15] font-semibold tracking-[-0.03em] text-white">
              Sua situação financeira, de forma simples.
            </h2>
            <p className="mt-5 text-base leading-7 text-blue-100">
              Consulte títulos em aberto e acompanhe seus vencimentos com segurança.
            </p>
          </div>
          <p className="relative z-10 text-sm text-blue-200">Acesso exclusivo para fornecedores</p>
          <div className="absolute -right-28 -bottom-24 h-80 w-80 rounded-full border-[55px] border-white/5" />
          <div className="absolute top-24 -left-16 h-40 w-40 rounded-full bg-white/[0.035]" />
        </section>

        <section className="flex items-center px-6 py-10 sm:px-12 md:px-16">
          <div className="mx-auto w-full max-w-[410px]">
            <div className="mb-10 md:hidden">
              <Brand />
            </div>
            <div className="mb-6">{accessibilityControls}</div>
            <p className="mb-2 text-sm font-semibold text-[#2563EB]">Bem-vindo</p>
            <h1
              className="text-3xl font-semibold tracking-[-0.025em] text-[#1F2937]"
              id="login-heading"
              ref={headingRef}
              tabIndex={-1}
            >
              Acesse sua área financeira
            </h1>
            <p className="mt-3 text-[0.9375rem] leading-6 text-[#526071]">
              Informe seus dados para continuar.
            </p>

            <form className="mt-9 space-y-5" onSubmit={submit}>
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-[#1F2937]"
                  htmlFor="supplier"
                >
                  Código ou identificação do fornecedor
                </label>
                <input
                  autoComplete="username"
                  aria-describedby={error ? "login-error" : undefined}
                  className="field"
                  id="supplier"
                  required
                  onChange={(event) => {
                    setSupplier(event.target.value);
                    setError(false);
                  }}
                  placeholder="Digite sua identificação"
                  value={supplier}
                />
              </div>
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-[#1F2937]"
                  htmlFor="password"
                >
                  Senha
                </label>
                <div className="relative">
                  <input
                    autoComplete="current-password"
                    aria-describedby={error ? "login-error" : undefined}
                    className="field pr-12"
                    id="password"
                    required
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError(false);
                    }}
                    placeholder="Digite sua senha"
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-[#526071] hover:text-[#2563EB] focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#2563EB]"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    <Icon name={showPassword ? "eyeOff" : "eye"} />
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="flex gap-3 rounded-xl border border-red-200 bg-[#FEE2E2] p-4 text-sm text-[#991B1B]"
                  id="login-error"
                  role="alert"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0" name="alert" />
                  <p>Não foi possível entrar. Confira seus dados e tente novamente.</p>
                </div>
              )}

              <button
                className="primary-button w-full"
                aria-busy={isSubmitting}
                disabled={isSubmitting}
                type="submit"
              >
                <span aria-live="polite">
                  {isSubmitting ? "Validando acesso..." : "Entrar"}
                </span>
              </button>
            </form>
            <div className="mt-7 rounded-xl bg-[#F5F7FA] px-4 py-3 text-center text-xs leading-5 text-[#526071]">
            </div>
          </div>
        </section>
      </div>
      </main>
    </>
  );
}

function Header({
  onLogout,
  supplierName,
}: {
  onLogout: () => void;
  supplierName: string;
}) {
  return (
    <header className="border-b border-[#16324F] bg-[#16324F]">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand light />
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-blue-100">Fornecedor</p>
            <p className="text-sm font-semibold text-white">
              {supplierName}
            </p>
          </div>
          <div className="hidden h-8 w-px bg-white/20 sm:block" />
          <button
            className="header-button px-3 sm:px-4"
            onClick={async () => {
              try {
                await fetch("/api/auth/logout", {
                  method: "POST",
                });
              } finally {
                onLogout();
              }
            }}
            type="button"
          >
            <Icon className="h-4 w-4" name="logout" />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

function StatusBadge({ status }: { status: ReturnType<typeof getStatus> }) {
  const config = {
    overdue: {
      label: "Vencido",
      classes: "border-[#FECACA] bg-[#FEE2E2] text-[#991B1B]",
      dot: "bg-[#991B1B]",
    },
    today: {
      label: "Vence hoje",
      classes: "border-[#FDE68A] bg-[#FEF3C7] text-[#92400E]",
      dot: "bg-[#92400E]",
    },
    upcoming: {
      label: "A vencer",
      classes: "border-[#D7DEE8] bg-[#F5F7FA] text-[#526071]",
      dot: "bg-[#2563EB]",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.classes}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

function SummaryCard({
  type,
  title,
  value,
  count,
  selected,
  onClick,
}: {
  type: Filter;
  title: string;
  value: number;
  count: number;
  selected: boolean;
  onClick: () => void;
}) {
  const style = {
    all: {
      icon: "wallet" as const,
      iconClass: "bg-blue-50 text-[#2563EB]",
      bar: "bg-[#16324F]",
    },
    overdue: {
      icon: "alert" as const,
      iconClass: "bg-[#FEE2E2] text-[#991B1B]",
      bar: "bg-[#991B1B]",
    },
    upcoming: {
      icon: "calendar" as const,
      iconClass: "bg-[#F5F7FA] text-[#2563EB]",
      bar: "bg-[#2563EB]",
    },
  }[type];

  return (
    <button
      aria-pressed={selected}
      aria-controls="titles-region"
      className={`summary-card group ${selected ? "summary-card-selected" : ""}`}
      onClick={onClick}
      type="button"
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${style.bar}`} />
      <span className="flex w-full items-start justify-between">
        <span className={`grid h-11 w-11 place-items-center rounded-xl ${style.iconClass}`}>
          <Icon name={style.icon} />
        </span>
        <span className="flex items-center gap-1 text-xs font-semibold text-[#526071] transition-colors group-hover:text-[#2563EB]">
          Ver detalhes <Icon className="h-4 w-4" name="chevron" />
        </span>
      </span>
      <span className="mt-5 block text-left text-sm font-medium text-[#526071]">{title}</span>
      <span className="mt-1 block text-left text-[1.7rem] font-semibold tracking-[-0.03em] text-[#1F2937]">
        {currency.format(value)}
      </span>
      <span className="mt-2 block text-left text-xs text-[#526071]">
        {count} {count === 1 ? "título" : "títulos"}
      </span>
    </button>
  );
}

function FilterButtons({ value, onChange }: { value: Filter; onChange: (value: Filter) => void }) {
  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "overdue", label: "Vencidos" },
    { value: "upcoming", label: "A vencer" },
  ];
  return (
    <div
      aria-label="Filtrar títulos por situação"
      className="flex gap-2 overflow-x-auto"
      role="group"
    >
      {filters.map((filter) => (
        <button
          aria-pressed={filter.value === value}
          className={`filter-button ${filter.value === value ? "filter-button-active" : ""}`}
          key={filter.value}
          onClick={() => onChange(filter.value)}
          type="button"
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

function StateMessage({
  type,
  onRetry,
}: {
  type: "empty" | "error" | "filtered";
  onRetry?: () => void;
}) {
  const content = {
    empty: {
      title: "Você não possui títulos em aberto para consultar.",
      text: "Quando houver novos títulos, eles serão exibidos nesta página.",
    },
    error: {
      title: "Não foi possível carregar seus títulos.",
      text: "Tente novamente. Se o problema continuar, acesse o portal mais tarde.",
    },
    filtered: {
      title: "Nenhum título encontrado neste filtro.",
      text: "Escolha outra opção para consultar seus títulos.",
    },
  }[type];
  return (
    <div
      className="grid min-h-72 place-items-center px-5 py-12 text-center"
      role={type === "error" ? "alert" : undefined}
    >
      <div className="max-w-md">
        <div
          className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${type === "error" ? "bg-[#FEE2E2] text-[#991B1B]" : "bg-blue-50 text-[#2563EB]"}`}
        >
          <Icon name={type === "error" ? "alert" : "wallet"} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-[#1F2937]">{content.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#526071]">{content.text}</p>
        {type === "error" && (
          <button className="secondary-button mx-auto mt-5" onClick={onRetry} type="button">
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}

function TitlesList({
  items,
  filter,
  onFilter,
  demoState,
  onRetry,
}: {
  items: TitleItem[];
  filter: Filter;
  onFilter: (filter: Filter) => void;
  demoState: DemoState;
  onRetry: () => void;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (filter === "overdue") return getStatus(item) === "overdue";
        if (filter === "upcoming") return getStatus(item) !== "overdue";
        return true;
      }),
    [filter, items],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function updateFilter(nextFilter: Filter) {
    setPage(1);
    onFilter(nextFilter);
  }

  return (
    <section
      aria-labelledby="titles-heading"
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_20px_rgba(15,45,75,0.04)]"
    >
      <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-[#1F2937]" id="titles-heading">
            Meus títulos em aberto
          </h2>
        </div>
        <FilterButtons onChange={updateFilter} value={filter} />
      </div>

      {demoState === "error" ? (
        <StateMessage onRetry={onRetry} type="error" />
      ) : demoState === "empty" ? (
        <StateMessage type="empty" />
      ) : visible.length === 0 ? (
        <StateMessage type="filtered" />
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Títulos financeiros em aberto</caption>
              <thead>
                <tr className="bg-[#F5F7FA] text-xs font-semibold tracking-[0.02em] text-[#526071]">
                  <th className="px-6 py-3.5" scope="col">Número do título</th>
                  <th className="px-4 py-3.5" scope="col">Descrição</th>
                  <th className="px-4 py-3.5" scope="col">Emissão</th>
                  <th className="px-4 py-3.5" scope="col">Vencimento</th>
                  <th className="px-4 py-3.5 text-right" scope="col">Valor em aberto</th>
                  <th className="px-6 py-3.5" scope="col">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((item) => (
                  <tr
                    className={`${getStatus(item) === "overdue" ? "bg-[#FEE2E2]/30" : ""} transition-colors hover:bg-[#F5F7FA]`}
                    key={item.id}
                  >
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap text-[#2563EB]" scope="row">
                      {item.id}
                    </th>
                    <td className="px-4 py-4 text-sm text-[#1F2937]">{item.description}</td>
                    <td className="px-4 py-4 text-sm whitespace-nowrap text-[#526071]">
                      {dateFormatter.format(item.issuedAt)}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-[#1F2937]">
                      {dateFormatter.format(item.dueAt)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-semibold whitespace-nowrap text-[#1F2937]">
                      {currency.format(openValue(item))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={getStatus(item)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {visible.map((item) => (
              <article
                className={`p-5 ${getStatus(item) === "overdue" ? "border-l-[3px] border-l-[#991B1B] bg-[#FEE2E2]/20" : ""}`}
                key={item.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-[#2563EB]">{item.id}</h3>
                    <p className="mt-1 text-sm text-[#526071]">{item.description}</p>
                  </div>
                  <StatusBadge status={getStatus(item)} />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[0.6875rem] font-medium tracking-wide text-[#526071] uppercase">
                      Emissão
                    </p>
                    <p className="mt-1 text-sm text-[#1F2937]">
                      {dateFormatter.format(item.issuedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[0.6875rem] font-medium tracking-wide text-[#526071] uppercase">
                      Vencimento
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#1F2937]">
                      {dateFormatter.format(item.dueAt)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[0.6875rem] font-medium tracking-wide text-[#526071] uppercase">
                      Valor em aberto
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#1F2937]">
                      {currency.format(openValue(item))}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p
              aria-live="polite"
              aria-atomic="true"
              className="text-xs text-[#526071]"
              role="status"
            >
              Exibindo {(safePage - 1) * pageSize + 1}–
              {Math.min(safePage * pageSize, filtered.length)} de {filtered.length} títulos
            </p>
            {totalPages > 1 && (
              <nav aria-label="Paginação" className="flex items-center gap-2">
                <button
                  className="page-button px-3"
                  disabled={safePage === 1}
                  onClick={() => setPage(safePage - 1)}
                  type="button"
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
                  <button
                    aria-current={number === safePage ? "page" : undefined}
                    aria-label={`Página ${number}`}
                    className={`page-button w-10 ${number === safePage ? "page-button-active" : ""}`}
                    key={number}
                    onClick={() => setPage(number)}
                    type="button"
                  >
                    {number}
                  </button>
                ))}
                <button
                  className="page-button px-3"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(safePage + 1)}
                  type="button"
                >
                  Próxima
                </button>
              </nav>
            )}
          </div>
        </>
      )}
    </section>
  );
}



function Portal({
  onLogout,
  supplierName,
  headingRef,
  accessibilityControls,
}: {
  onLogout: () => void;
  supplierName: string;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  accessibilityControls: React.ReactNode;
}) {
  const [view, setView] = useState<View>("dashboard");
  const [filter, setFilter] = useState<Filter>("all");
  const [demoState, setDemoState] = useState<DemoState>("data");
  const [items, setItems] = useState<TitleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadTitles() {
      setLoading(true);

      try {
        const response = await fetch("/api/portal/titulos");

        if (!response.ok) {
          throw new Error("Falha ao consultar os títulos.");
        }

        const data = await response.json();

        const titles: TitleItem[] = data.titulos.map(
          (titulo: {
            numero: number;
            especie: string;
            data_emissao: string;
            data_vencimento: string;
            valor_nominal: number;
            valor_pago: number;
          }) => ({
            id: String(titulo.numero),
            description: titulo.especie,
            issuedAt: new Date(titulo.data_emissao),
            dueAt: new Date(titulo.data_vencimento),
            nominalValue: Number(titulo.valor_nominal),
            paidValue: Number(titulo.valor_pago),
          }),
        );

        if (active) {
          setItems(titles);
          setDemoState(titles.length ? "data" : "empty");
        }
      } catch {
        if (active) {
          setDemoState("error");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTitles();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const totals = useMemo(() => {
    const overdue = items.filter(
      (item) => getStatus(item) === "overdue",
    );

    const upcoming = items.filter(
      (item) => getStatus(item) !== "overdue",
    );

    const sum = (list: TitleItem[]) =>
      list.reduce((total, item) => total + openValue(item), 0);

    return {
      all: { value: sum(items), count: items.length },
      overdue: { value: sum(overdue), count: overdue.length },
      upcoming: { value: sum(upcoming), count: upcoming.length },
    };
  }, [items]);

  const displayedTotals = totals;

  function selectFilter(nextFilter: Filter) {
    setFilter(nextFilter);
    setView("list");
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function showDashboard() {
    setView("dashboard");
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <a className="skip-link" href="#main-content">
        Pular para o conteúdo principal
      </a>
      <Header
        onLogout={onLogout}
        supplierName={supplierName}
      />

      <main
        className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8"
        id="main-content"
        tabIndex={-1}
      >
        <div className="mb-6">{accessibilityControls}</div>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#2563EB]">
              Área do fornecedor
            </p>
            <h1
              className="mt-2 text-2xl font-semibold tracking-tight text-[#1F2937] sm:text-3xl"
              ref={headingRef}
              tabIndex={-1}
            >
              {view === "dashboard"
                ? "Sua situação financeira"
                : "Consulta de títulos"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#526071]">
              Consulte seus títulos em aberto, vencimentos e valores pendentes.
            </p>
          </div>

          {view === "list" && (
            <button
              className="secondary-button"
              onClick={showDashboard}
              type="button"
            >
              <Icon name="arrowLeft" className="h-4 w-4" />
              Voltar ao resumo
            </button>
          )}
        </div>

        {view === "dashboard" && (
          <section aria-label="Resumo financeiro" className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#1F2937]">
                Resumo financeiro
              </h2>
              {loading && (
                <span className="text-xs text-[#526071]">
                  Atualizando dados...
                </span>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <SummaryCard
                type="all"
                title="Total em aberto"
                value={displayedTotals.all.value}
                count={displayedTotals.all.count}
                selected={filter === "all"}
                onClick={() => selectFilter("all")}
              />

              <SummaryCard
                type="overdue"
                title="Títulos vencidos"
                value={displayedTotals.overdue.value}
                count={displayedTotals.overdue.count}
                selected={filter === "overdue"}
                onClick={() => selectFilter("overdue")}
              />

              <SummaryCard
                type="upcoming"
                title="Títulos a vencer"
                value={displayedTotals.upcoming.value}
                count={displayedTotals.upcoming.count}
                selected={filter === "upcoming"}
                onClick={() => selectFilter("upcoming")}
              />
            </div>
          </section>
        )}

        <section
          aria-label="Títulos financeiros"
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          id="titles-region"
        >
          {loading ? (
            <div
              className="grid min-h-72 place-items-center px-5 py-12 text-center"
              aria-live="polite"
              aria-atomic="true"
              role="status"
            >
              <p className="text-sm text-[#526071]">
                Carregando seus títulos financeiros...
              </p>
            </div>
          ) : (
            <TitlesList
              demoState={demoState}
              filter={filter}
              items={items}
              onFilter={setFilter}
              onRetry={() => setReloadKey((current) => current + 1)}
            />
          )}
        </section>

        <p className="mt-5 text-center text-xs leading-5 text-[#526071]">
          As informações financeiras são consultadas conforme os dados
          disponibilizados pelo Grupo Queiroz.
        </p>
      </main>
    </div>
  );
}


export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [supplierName, setSupplierName] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [fontScale, setFontScale] = useState<FontScale>("normal");
  const [highContrast, setHighContrast] = useState(false);
  const [darkTheme, setDarkTheme] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.fontScale = fontScale;
    document.documentElement.dataset.contrast = highContrast ? "high" : "standard";
    document.documentElement.dataset.theme = darkTheme ? "dark" : "light";
  }, [fontScale, highContrast, darkTheme]);

  const accessibilityControls = (
    <AccessibilityControls
      fontScale={fontScale}
      onFontScaleChange={setFontScale}
      highContrast={highContrast}
      onHighContrastChange={setHighContrast}
      darkTheme={darkTheme}
      onDarkThemeChange={setDarkTheme}
    />
  );

  function logout() {
    setAuthenticated(false);
    setSupplierName("");
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function login(nomeFornecedor: string) {
    setSupplierName(nomeFornecedor);
    setAuthenticated(true);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  return authenticated ? (
    <Portal
      accessibilityControls={accessibilityControls}
      headingRef={headingRef}
      onLogout={logout}
      supplierName={supplierName}
    />
  ) : (
    <Login
      accessibilityControls={accessibilityControls}
      headingRef={headingRef}
      onLogin={login}
    />
  );
}
