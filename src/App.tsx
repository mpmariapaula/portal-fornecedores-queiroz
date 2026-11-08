import { useMemo, useState } from "react";

type Filter = "all" | "overdue" | "upcoming";
type View = "dashboard" | "list";
type DemoState = "data" | "empty" | "error";

type TitleItem = {
  id: string;
  description: string;
  issuedAt: Date;
  dueAt: Date;
  nominalValue: number;
  paidValue: number;
};

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

function Login({ onLogin }: { onLogin: () => void }) {
  const [supplier, setSupplier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!supplier.trim() || !password.trim()) {
      setError(true);
      return;
    }
    onLogin();
  }

  return (
    <main className="min-h-screen bg-[#F5F7FA] px-4 py-8 sm:grid sm:place-items-center sm:px-6">
      <div className="mx-auto grid w-full max-w-[1040px] overflow-hidden rounded-[24px] bg-white shadow-[0_24px_70px_rgba(15,45,75,0.12)] md:min-h-[650px] md:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden overflow-hidden bg-[#16324F] p-12 md:flex md:flex-col md:justify-between">
          <Brand light />
          <div className="relative z-10 max-w-sm">
            <div className="mb-6 h-1 w-12 rounded-full bg-[#2563EB]" />
            <h1 className="text-[2.55rem] leading-[1.15] font-semibold tracking-[-0.03em] text-white">
              Sua situação financeira, de forma simples.
            </h1>
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
            <p className="mb-2 text-sm font-semibold text-[#2563EB]">Bem-vindo</p>
            <h2 className="text-3xl font-semibold tracking-[-0.025em] text-[#1F2937]">
              Acesse sua área financeira
            </h2>
            <p className="mt-3 text-[15px] leading-6 text-[#526071]">
              Informe seus dados para continuar.
            </p>

            <form className="mt-9 space-y-5" onSubmit={submit} noValidate>
              <div>
                <label
                  className="mb-2 block text-sm font-semibold text-[#1F2937]"
                  htmlFor="supplier"
                >
                  Código ou identificação do fornecedor
                </label>
                <input
                  autoComplete="username"
                  className="field"
                  id="supplier"
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
                    className="field pr-12"
                    id="password"
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
                  aria-live="polite"
                  className="flex gap-3 rounded-xl border border-red-200 bg-[#FEE2E2] p-4 text-sm text-[#991B1B]"
                  role="alert"
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0" name="alert" />
                  <p>Não foi possível entrar. Confira seus dados e tente novamente.</p>
                </div>
              )}

              <button className="primary-button w-full" type="submit">
                Entrar
              </button>
            </form>
            <div className="mt-7 rounded-xl bg-[#F5F7FA] px-4 py-3 text-center text-xs leading-5 text-[#526071]">
              Protótipo visual: use qualquer identificação e senha para acessar os dados de exemplo.
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Header({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="border-b border-[#16324F] bg-[#16324F]">
      <div className="mx-auto flex h-[76px] max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand light />
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-blue-100">Fornecedor</p>
            <p className="text-sm font-semibold text-white">Comercial Horizonte Ltda.</p>
          </div>
          <div className="hidden h-8 w-px bg-white/20 sm:block" />
          <button className="header-button px-3 sm:px-4" onClick={onLogout} type="button">
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
    <div className="grid min-h-72 place-items-center px-5 py-12 text-center">
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
          <p className="mt-1 text-xs text-[#526071]">Valores e datas apresentados como exemplo.</p>
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
              <thead>
                <tr className="bg-[#F5F7FA] text-xs font-semibold tracking-[0.02em] text-[#526071]">
                  <th className="px-6 py-3.5">Número do título</th>
                  <th className="px-4 py-3.5">Descrição</th>
                  <th className="px-4 py-3.5">Emissão</th>
                  <th className="px-4 py-3.5">Vencimento</th>
                  <th className="px-4 py-3.5 text-right">Valor em aberto</th>
                  <th className="px-6 py-3.5">Situação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((item) => (
                  <tr
                    className={`${getStatus(item) === "overdue" ? "bg-[#FEE2E2]/30" : ""} transition-colors hover:bg-[#F5F7FA]`}
                    key={item.id}
                  >
                    <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-[#2563EB]">
                      {item.id}
                    </td>
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
                    <p className="text-sm font-semibold text-[#2563EB]">{item.id}</p>
                    <p className="mt-1 text-sm text-[#526071]">{item.description}</p>
                  </div>
                  <StatusBadge status={getStatus(item)} />
                </div>
                <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 border-t border-slate-100 pt-4">
                  <div>
                    <p className="text-[11px] font-medium tracking-wide text-[#526071] uppercase">
                      Emissão
                    </p>
                    <p className="mt-1 text-sm text-[#1F2937]">
                      {dateFormatter.format(item.issuedAt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium tracking-wide text-[#526071] uppercase">
                      Vencimento
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#1F2937]">
                      {dateFormatter.format(item.dueAt)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[11px] font-medium tracking-wide text-[#526071] uppercase">
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
            <p className="text-xs text-[#526071]">
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

function Portal({ onLogout }: { onLogout: () => void }) {
  const [view, setView] = useState<View>("dashboard");
  const [filter, setFilter] = useState<Filter>("all");
  const [demoState, setDemoState] = useState<DemoState>("data");

  const totals = useMemo(() => {
    const overdue = titleItems.filter((item) => getStatus(item) === "overdue");
    const upcoming = titleItems.filter((item) => getStatus(item) !== "overdue");
    const sum = (items: TitleItem[]) => items.reduce((total, item) => total + openValue(item), 0);
    return {
      all: { value: sum(titleItems), count: titleItems.length },
      overdue: { value: sum(overdue), count: overdue.length },
      upcoming: { value: sum(upcoming), count: upcoming.length },
    };
  }, []);
  const displayedTotals =
    demoState === "empty"
      ? {
          all: { value: 0, count: 0 },
          overdue: { value: 0, count: 0 },
          upcoming: { value: 0, count: 0 },
        }
      : totals;

  function openDetails(nextFilter: Filter) {
    setFilter(nextFilter);
    setView("list");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1F2937]">
      <Header onLogout={onLogout} />
      <main className="mx-auto max-w-[1200px] px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {view === "list" && (
              <button
                className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:text-[#16324F]"
                onClick={() => setView("dashboard")}
                type="button"
              >
                <Icon className="h-4 w-4" name="arrowLeft" />
                Voltar ao painel financeiro
              </button>
            )}
            <p className="text-sm font-semibold text-[#2563EB]">
              {view === "dashboard" ? "Olá, Comercial Horizonte" : "Consulta detalhada"}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.025em] text-[#1F2937] sm:text-3xl">
              {view === "dashboard"
                ? "Confira seus títulos"
                : filter === "overdue"
                  ? "Títulos vencidos"
                  : filter === "upcoming"
                    ? "Títulos a vencer"
                    : "Todos os títulos"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#526071] sm:text-base">
              {view === "dashboard"
                ? "Acompanhe seus vencimentos e valores em aberto."
                : "Consulte os detalhes e use os filtros para encontrar o que precisa."}
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-full border border-green-200 bg-[#DCFCE7] px-3 py-2 text-xs font-medium text-[#166534] sm:self-auto">
            <span className="h-2 w-2 rounded-full bg-[#166534]" />
            Dados fictícios para demonstração
          </div>
        </div>

        {view === "dashboard" && (
          <section aria-label="Resumo financeiro" className="mb-8 grid gap-4 md:grid-cols-3">
            <SummaryCard
              count={displayedTotals.all.count}
              onClick={() => openDetails("all")}
              selected={false}
              title="Total em aberto"
              type="all"
              value={displayedTotals.all.value}
            />
            <SummaryCard
              count={displayedTotals.overdue.count}
              onClick={() => openDetails("overdue")}
              selected={false}
              title="Títulos vencidos"
              type="overdue"
              value={displayedTotals.overdue.value}
            />
            <SummaryCard
              count={displayedTotals.upcoming.count}
              onClick={() => openDetails("upcoming")}
              selected={false}
              title="Títulos a vencer"
              type="upcoming"
              value={displayedTotals.upcoming.value}
            />
          </section>
        )}

        {view === "list" && (
          <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-1">
            {(["all", "overdue", "upcoming"] as Filter[]).map((type) => (
              <button
                aria-pressed={filter === type}
                className={`min-w-[190px] rounded-xl border bg-white px-4 py-3 text-left transition-all ${
                  filter === type
                    ? "border-[#2563EB] shadow-[0_0_0_2px_rgba(37,99,235,0.1)]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                key={type}
                onClick={() => setFilter(type)}
                type="button"
              >
                <span className="block text-xs font-medium text-[#526071]">
                  {type === "all"
                    ? "Total em aberto"
                    : type === "overdue"
                      ? "Títulos vencidos"
                      : "Títulos a vencer"}
                </span>
                <span className="mt-1 block text-base font-semibold text-[#1F2937]">
                  {currency.format(displayedTotals[type].value)}
                </span>
              </button>
            ))}
          </div>
        )}

        <TitlesList
          demoState={demoState}
          filter={filter}
          items={titleItems}
          onFilter={setFilter}
          onRetry={() => setDemoState("data")}
        />

        <aside className="mt-6 flex flex-col gap-3 rounded-xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-[#1F2937]">Estados do protótipo</p>
            <p className="mt-0.5 text-xs text-[#526071]">
              Use os controles para visualizar as variações previstas.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["data", "Com títulos"],
                ["empty", "Sem títulos"],
                ["error", "Falha ao carregar"],
              ] as [DemoState, string][]
            ).map(([value, label]) => (
              <button
                aria-pressed={demoState === value}
                className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  demoState === value
                    ? "bg-[#16324F] text-white"
                    : "bg-white text-[#526071] hover:bg-[#F5F7FA]"
                }`}
                key={value}
                onClick={() => setDemoState(value)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
        </aside>
      </main>
      <footer className="mt-6 border-t border-slate-200 bg-white py-6 text-center text-xs text-[#526071]">
        Portal de Fornecedores · Grupo Queiroz
      </footer>
    </div>
  );
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  return authenticated ? (
    <Portal onLogout={() => setAuthenticated(false)} />
  ) : (
    <Login onLogin={() => setAuthenticated(true)} />
  );
}
