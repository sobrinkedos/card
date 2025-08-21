-- Inserir dados de exemplo para popular o banco de dados
-- Certifique-se de que os UUIDs são únicos se você for relacioná-los manualmente.
-- Os UUIDs aqui são gerados aleatoriamente.

-- Inserir Membros da Equipe
INSERT INTO public.membros_equipe (id, nome, email, cargo, status) VALUES
('e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'Admin Loja', 'admin@loja.com', 'Admin', 'Ativo'),
('f1g2h3i4-j5k6-l7m8-n9o0-p1q2r3s4t5u6', 'João Operador', 'joao.op@loja.com', 'Operador', 'Ativo');

-- Inserir Clientes
-- UUIDs para clientes
DO $$
DECLARE
    cliente1_id uuid := 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    cliente2_id uuid := 'b1c2d3e4-f5g6-7890-1234-567890abcde0';
    cliente3_id uuid := 'c1d2e3f4-g5h6-7890-1234-567890abcde1';
BEGIN
    INSERT INTO public.clientes (id, nome, cpf, email, telefone, endereco, limite_credito, status) VALUES
    (cliente1_id, 'Ana Silva', '111.111.111-11', 'ana.silva@email.com', '(11) 91111-1111', 'Rua das Flores, 10', 5000.00, 'Ativo'),
    (cliente2_id, 'Bruno Costa', '222.222.222-22', 'bruno.costa@email.com', '(21) 92222-2222', 'Avenida Principal, 20', 3500.00, 'Ativo'),
    (cliente3_id, 'Carla Dias', '333.333.333-33', 'carla.dias@email.com', '(31) 93333-3333', 'Praça da Matriz, 30', 1500.00, 'Bloqueado');
END $$;

-- Inserir Cartões
DO $$
DECLARE
    cliente1_id uuid := 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    cliente2_id uuid := 'b1c2d3e4-f5g6-7890-1234-567890abcde0';
    cliente3_id uuid := 'c1d2e3f4-g5h6-7890-1234-567890abcde1';
    cartao1_id uuid := 'd1e2f3a4-b5c6-7890-1234-567890abcdef';
    cartao2_id uuid := 'e1f2g3h4-c5d6-7890-1234-567890abcde0';
    cartao3_id uuid := 'f1g2h3i4-d5e6-7890-1234-567890abcde1';
BEGIN
    INSERT INTO public.cartoes (id, cliente_id, numero_cartao, cvv, data_validade, limite, saldo_utilizado, status, design) VALUES
    (cartao1_id, cliente1_id, '4012 3456 7890 1234', '123', '2028-12-31', 5000.00, 1250.75, 'Ativo', 'Premium'),
    (cartao2_id, cliente2_id, '4012 3456 7890 5678', '456', '2027-10-31', 3500.00, 800.00, 'Ativo', 'Clássico'),
    (cartao3_id, cliente3_id, '4012 3456 7890 9101', '789', '2026-05-31', 1500.00, 1450.20, 'Bloqueado', 'Clássico');
END $$;

-- Inserir Faturas e Transações
DO $$
DECLARE
    cliente1_id uuid := 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    cliente2_id uuid := 'b1c2d3e4-f5g6-7890-1234-567890abcde0';
    cartao1_id uuid := 'd1e2f3a4-b5c6-7890-1234-567890abcdef';
    cartao2_id uuid := 'e1f2g3h4-c5d6-7890-1234-567890abcde0';
    fatura1_id uuid := gen_random_uuid();
    fatura2_id uuid := gen_random_uuid();
    fatura3_id uuid := gen_random_uuid();
BEGIN
    -- Fatura Paga (mês passado)
    INSERT INTO public.faturas (id, cliente_id, competencia, data_vencimento, data_fechamento, valor_total, pagamento_minimo, status) VALUES
    (fatura1_id, cliente1_id, to_char(now() - interval '1 month', 'YYYY-MM'), (now() - interval '1 month' + interval '10 days'), (now() - interval '1 month'), 850.25, 127.54, 'Paga');
    INSERT INTO public.transacoes (cartao_id, cliente_id, fatura_id, descricao, valor, categoria, status, data_transacao) VALUES
    (cartao1_id, cliente1_id, fatura1_id, 'Supermercado Dia', 350.50, 'Alimentação', 'Paga', now() - interval '40 days'),
    (cartao1_id, cliente1_id, fatura1_id, 'Posto Shell', 150.00, 'Transporte', 'Paga', now() - interval '35 days');

    -- Fatura Aberta (mês atual)
    INSERT INTO public.faturas (id, cliente_id, competencia, data_vencimento, data_fechamento, valor_total, pagamento_minimo, status) VALUES
    (fatura2_id, cliente1_id, to_char(now(), 'YYYY-MM'), (now() + interval '10 days'), now(), 400.50, 60.08, 'Aberta');
    INSERT INTO public.transacoes (cartao_id, cliente_id, fatura_id, descricao, valor, categoria, status, data_transacao) VALUES
    (cartao1_id, cliente1_id, fatura2_id, 'Restaurante Sabor', 120.00, 'Alimentação', 'Pendente', now() - interval '10 days'),
    (cartao1_id, cliente1_id, fatura2_id, 'Cinema', 80.50, 'Lazer', 'Pendente', now() - interval '5 days');
    
    -- Fatura Atrasada
    INSERT INTO public.faturas (id, cliente_id, competencia, data_vencimento, data_fechamento, valor_total, pagamento_minimo, status) VALUES
    (fatura3_id, cliente2_id, to_char(now() - interval '1 month', 'YYYY-MM'), (now() - interval '20 days'), (now() - interval '1 month'), 800.00, 120.00, 'Atrasada');
    INSERT INTO public.transacoes (cartao_id, cliente_id, fatura_id, descricao, valor, categoria, status, data_transacao) VALUES
    (cartao2_id, cliente2_id, fatura3_id, 'Loja de Roupas', 500.00, 'Vestuário', 'Atrasada', now() - interval '45 days'),
    (cartao2_id, cliente2_id, fatura3_id, 'Farmácia', 300.00, 'Saúde', 'Atrasada', now() - interval '42 days');
END $$;

-- Inserir Notificações
INSERT INTO public.notificacoes (tipo, titulo, descricao, lida) VALUES
('Cliente', 'Novo cliente cadastrado!', 'O cliente Bruno Costa acaba de se cadastrar.', false),
('Cobrança', 'Fatura em atraso', 'A fatura de Bruno Costa venceu há 20 dias.', false),
('Cartão', 'Cartão Bloqueado', 'O cartão de Carla Dias foi bloqueado por segurança.', true);

-- Inserir Logs de Auditoria
INSERT INTO public.logs_auditoria (autor_id, acao, alvo_id, detalhes, ip_address) VALUES
('e1a2b3c4-d5e6-f7a8-b9c0-d1e2f3a4b5c6', 'Bloqueio de Cartão', 'f1g2h3i4-d5e6-7890-1234-567890abcde1', '{"motivo": "Suspeita de fraude"}', '192.168.1.1'),
('f1g2h3i4-j5k6-l7m8-n9o0-p1q2r3s4t5u6', 'Alteração de Limite', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', '{"de": 4000, "para": 5000}', '200.201.202.203');

-- Inserir Convites
INSERT INTO public.convites (destinatario, tipo, status, limite_inicial) VALUES
('maria.souza@email.com', 'Email', 'Aceito', 2000.00),
('(41) 94444-4444', 'WhatsApp', 'Pendente', 1500.00),
('pedro.rocha@email.com', 'Email', 'Expirado', 1000.00);

-- Inserir Chamados de Suporte
INSERT INTO public.chamados_suporte (protocolo, autor_id, assunto, status) VALUES
('202501A', 'f1g2h3i4-j5k6-l7m8-n9o0-p1q2r3s4t5u6', 'Dúvida sobre exportação de relatório', 'Resolvido'),
('202502B', 'f1g2h3i4-j5k6-l7m8-n9o0-p1q2r3s4t5u6', 'Problema ao cadastrar novo cliente', 'Aberto');
