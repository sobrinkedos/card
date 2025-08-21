-- Habilitar a extensão pgcrypto se ainda não estiver habilitada
create extension if not exists "pgcrypto" with schema "public";

-- 1. Criação dos Tipos (ENUMs)
create type "public"."user_role" as enum ('Admin', 'Operador', 'Visualizador');
create type "public"."card_status" as enum ('Ativo', 'Inativo', 'Bloqueado');
create type "public"."transaction_status" as enum ('Paga', 'Pendente', 'Atrasada', 'Cancelada');
create type "public"."invoice_status" as enum ('Paga', 'Aberta', 'Atrasada');
create type "public"."invite_status" as enum ('Pendente', 'Aceito', 'Expirado');
create type "public"."notification_type" as enum ('Cobrança', 'Cartão', 'Cliente', 'Sistema');
create type "public"."ticket_status" as enum ('Aberto', 'Em Andamento', 'Resolvido');

-- 2. Criação das Tabelas
-- Tabela de Clientes
create table "public"."clientes" (
    "id" uuid default gen_random_uuid() not null,
    "nome" text not null,
    "cpf" character varying(14) not null,
    "email" text not null,
    "telefone" text,
    "endereco" text,
    "limite_credito" numeric(10,2) not null,
    "status" public.card_status not null default 'Ativo'::public.card_status,
    "data_cadastro" timestamp with time zone not null default now(),
    constraint "clientes_pkey" primary key (id),
    constraint "clientes_cpf_key" unique (cpf),
    constraint "clientes_email_key" unique (email)
);

-- Tabela de Cartões
create table "public"."cartoes" (
    "id" uuid default gen_random_uuid() not null,
    "cliente_id" uuid not null,
    "numero_cartao" character varying(19) not null,
    "cvv" character varying(3) not null,
    "data_validade" date not null,
    "limite" numeric(10,2) not null,
    "saldo_utilizado" numeric(10,2) not null default 0.00,
    "status" public.card_status not null default 'Ativo'::public.card_status,
    "design" text,
    "data_emissao" timestamp with time zone not null default now(),
    constraint "cartoes_pkey" primary key (id),
    constraint "cartoes_numero_cartao_key" unique (numero_cartao),
    constraint "cartoes_cliente_id_fkey" foreign key (cliente_id) references clientes(id) on delete cascade
);

-- Tabela de Faturas
create table "public"."faturas" (
    "id" uuid default gen_random_uuid() not null,
    "cliente_id" uuid not null,
    "competencia" text not null,
    "data_vencimento" date not null,
    "data_fechamento" date not null,
    "valor_total" numeric(10,2) not null,
    "pagamento_minimo" numeric(10,2) not null,
    "status" public.invoice_status not null default 'Aberta'::public.invoice_status,
    "linha_digitavel" text,
    "data_criacao" timestamp with time zone not null default now(),
    constraint "faturas_pkey" primary key (id),
    constraint "faturas_cliente_id_fkey" foreign key (cliente_id) references clientes(id) on delete cascade
);

-- Tabela de Transações
create table "public"."transacoes" (
    "id" uuid default gen_random_uuid() not null,
    "cartao_id" uuid not null,
    "cliente_id" uuid not null,
    "fatura_id" uuid,
    "descricao" text not null,
    "valor" numeric(10,2) not null,
    "categoria" text,
    "parcela_atual" integer not null default 1,
    "total_parcelas" integer not null default 1,
    "status" public.transaction_status not null default 'Pendente'::public.transaction_status,
    "data_transacao" timestamp with time zone not null default now(),
    constraint "transacoes_pkey" primary key (id),
    constraint "transacoes_cartao_id_fkey" foreign key (cartao_id) references cartoes(id) on delete restrict,
    constraint "transacoes_cliente_id_fkey" foreign key (cliente_id) references clientes(id) on delete cascade,
    constraint "transacoes_fatura_id_fkey" foreign key (fatura_id) references faturas(id) on delete set null
);

-- Tabela de Membros da Equipe
create table "public"."membros_equipe" (
    "id" uuid default gen_random_uuid() not null,
    "nome" text not null,
    "email" text not null,
    "cargo" public.user_role not null,
    "status" public.card_status not null default 'Ativo'::public.card_status,
    "ultimo_acesso" timestamp with time zone,
    "data_criacao" timestamp with time zone not null default now(),
    constraint "membros_equipe_pkey" primary key (id),
    constraint "membros_equipe_email_key" unique (email)
);

-- Tabela de Convites
create table "public"."convites" (
    "id" uuid default gen_random_uuid() not null,
    "destinatario" text not null,
    "tipo" text not null,
    "status" public.invite_status not null default 'Pendente'::public.invite_status,
    "limite_inicial" numeric(10,2),
    "data_envio" timestamp with time zone not null default now(),
    "data_expiracao" timestamp with time zone,
    constraint "convites_pkey" primary key (id)
);

-- Tabela de Notificações
create table "public"."notificacoes" (
    "id" uuid default gen_random_uuid() not null,
    "tipo" public.notification_type not null,
    "titulo" text not null,
    "descricao" text,
    "lida" boolean not null default false,
    "data_criacao" timestamp with time zone not null default now(),
    constraint "notificacoes_pkey" primary key (id)
);

-- Tabela de Logs de Auditoria
create table "public"."logs_auditoria" (
    "id" uuid default gen_random_uuid() not null,
    "autor_id" uuid,
    "acao" text not null,
    "alvo_id" text,
    "detalhes" jsonb,
    "ip_address" text,
    "data_log" timestamp with time zone not null default now(),
    constraint "logs_auditoria_pkey" primary key (id),
    constraint "logs_auditoria_autor_id_fkey" foreign key (autor_id) references membros_equipe(id) on delete set null
);

-- Tabela de Chamados de Suporte
create table "public"."chamados_suporte" (
    "id" uuid default gen_random_uuid() not null,
    "protocolo" text not null,
    "autor_id" uuid not null,
    "assunto" text not null,
    "descricao" text,
    "status" public.ticket_status not null default 'Aberto'::public.ticket_status,
    "data_abertura" timestamp with time zone not null default now(),
    "data_resolucao" timestamp with time zone,
    constraint "chamados_suporte_pkey" primary key (id),
    constraint "chamados_suporte_autor_id_fkey" foreign key (autor_id) references membros_equipe(id) on delete cascade
);

-- 3. Criação de Funções (para relatórios e dados agregados)
create or replace function get_dashboard_stats()
returns table(cartoesAtivos bigint, vendasMes numeric, totalClientes bigint, taxaInadimplencia numeric) as $$
begin
  return query
  select
    (select count(*) from cartoes where status = 'Ativo') as cartoesAtivos,
    coalesce((select sum(valor) from transacoes where data_transacao >= date_trunc('month', current_date)), 0) as vendasMes,
    (select count(*) from clientes) as totalClientes,
    coalesce((select (count(case when status = 'Atrasada' then 1 end)::numeric * 100 / count(*)) from faturas), 0) as taxaInadimplencia;
end;
$$ language plpgsql;

create or replace function get_sales_last_6_months()
returns table(month text, total_sales numeric) as $$
begin
  return query
  select to_char(d.month, 'YYYY-MM') as month, coalesce(sum(t.valor), 0) as total_sales
  from generate_series(date_trunc('month', current_date) - interval '5 months', date_trunc('month', current_date), interval '1 month') as d(month)
  left join transacoes t on date_trunc('month', t.data_transacao) = d.month
  group by 1 order by 1;
end;
$$ language plpgsql;

create or replace function get_card_status_counts()
returns table(status public.card_status, count bigint) as $$
begin
  return query
  select c.status, count(*)
  from cartoes c
  group by c.status;
end;
$$ language plpgsql;

create or replace function get_cobrancas()
returns table (
    id uuid,
    cliente_id uuid,
    competencia text,
    data_vencimento date,
    data_fechamento date,
    valor_total numeric,
    pagamento_minimo numeric,
    status public.invoice_status,
    linha_digitavel text,
    data_criacao timestamp with time zone,
    clientes json,
    dias_atraso integer,
    status_cobranca text
) as $$
begin
    return query
    select
        f.*,
        json_build_object('nome', c.nome) as clientes,
        case
            when f.status = 'Atrasada' then (current_date - f.data_vencimento)
            else 0
        end as dias_atraso,
        case
            when f.status = 'Atrasada' and (current_date - f.data_vencimento) > 30 then 'Crítica'
            when f.status = 'Atrasada' then 'Em atraso'
            when f.data_vencimento < current_date and f.status = 'Aberta' then 'Vencida'
            else 'Em dia'
        end as status_cobranca
    from faturas f
    join clientes c on f.cliente_id = c.id
    where f.status in ('Aberta', 'Atrasada')
    order by dias_atraso desc;
end;
$$ language plpgsql;

create or replace function get_reports_data()
returns json as $$
declare
    _kpis json;
    _sales_chart json;
    _clients_chart json;
    _defaults_chart json;
begin
    select json_build_object(
        'receita', coalesce(sum(valor), 0),
        'novosClientes', count(case when data_cadastro >= date_trunc('month', current_date) then 1 end),
        'inadimplencia', coalesce((select (count(case when status = 'Atrasada' then 1 end)::numeric * 100 / count(*)) from faturas), 0),
        'cartoesAtivos', (select count(*) from cartoes where status = 'Ativo')
    ) into _kpis from transacoes;

    select json_agg(t) into _sales_chart from (select * from get_sales_last_6_months()) t;
    select json_agg(t) into _clients_chart from (select status, count(*) as count from clientes group by status) t;
    select json_agg(t) into _defaults_chart from (
        select to_char(d.month, 'YYYY-MM') as month, coalesce((select (count(case when status = 'Atrasada' then 1 end)::numeric * 100 / count(*)) from faturas where date_trunc('month', data_vencimento) = d.month), 0) as rate
        from generate_series(date_trunc('month', current_date) - interval '5 months', date_trunc('month', current_date), interval '1 month') as d(month)
        order by 1
    ) t;

    return json_build_object(
        'kpis', _kpis,
        'salesChart', _sales_chart,
        'clientsChart', _clients_chart,
        'defaultsChart', _defaults_chart
    );
end;
$$ language plpgsql;

create or replace function get_portal_dashboard_data(p_cliente_id uuid)
returns json as $$
begin
    return (
        select json_build_object(
            'nome_cliente', cl.nome,
            'limite_disponivel', ca.limite - ca.saldo_utilizado,
            'fatura_atual', coalesce((select valor_total from faturas where cliente_id = p_cliente_id and status = 'Aberta' order by data_vencimento asc limit 1), 0),
            'proximo_vencimento', (select data_vencimento from faturas where cliente_id = p_cliente_id and status = 'Aberta' order by data_vencimento asc limit 1),
            'limite_total', ca.limite
        )
        from clientes cl
        join cartoes ca on cl.id = ca.cliente_id
        where cl.id = p_cliente_id
    );
end;
$$ language plpgsql;
