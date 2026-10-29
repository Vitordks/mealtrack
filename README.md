# MealTrack

Sistema full stack para monitoramento de desperdício de alimentos em restaurantes — MVP pronto para apresentação de banca.

---

## Sobre o projeto

O MealTrack simula um sistema real de controle operacional de buffet, com dados persistentes no banco. A arquitetura está preparada para futura integração com sensores Arduino.

Funcionalidades principais:

- Cadastro de usuários, restaurantes e alimentos
- Registro de produção
- Central de monitoramento operacional
- Dashboard gerencial com gráficos
- Relatórios de desperdício e eficiência
- Simulação semanal com alteração real dos dados

---

## Tecnologias

| Camada | Stack |
|--------|-------|
| Frontend | React, Vite, Tailwind, Recharts |
| Backend | Java, Spring Boot, Spring Data JPA |
| Banco | MySQL |
| Segurança | JWT |

---

## Como rodar

### 1. Banco de dados

```sql
CREATE DATABASE mealtrack;
```

### 2. Backend

Configure `mealtrack/src/main/resources/application.properties` com sua senha MySQL.

```bash
cd mealtrack
./mvnw spring-boot:run
```

O backend inicia na porta **9090**.

### 3. Frontend

```bash
cd Front/mealtrack-frontend
npm install
npm run dev
```

---

## Dados iniciais (seed automático)

Na primeira execução, o sistema carrega automaticamente:

| Recurso | Quantidade |
|---------|------------|
| Restaurante | 1 (dados completos) |
| Usuários | 13 (admin, supervisor, 11 funcionários) |
| Alimentos | 25 (valores variados) |
| Produções | ~200 registros (14 dias) |
| Eventos | 12 eventos históricos |

### Login padrão

| Campo | Valor |
|-------|-------|
| Email | `admin@mealtrack.com` |
| Senha | `123456` |

Outros usuários usam a mesma senha (`123456`).

---

## Simulação semanal

Na página **Simulação**, clique em **Executar Simulação**. O sistema evolui 7 dias de operação de forma real:

- Funcionários produzem alimentos
- Clientes consomem
- Reposições acontecem
- Sobras são descartadas (única fonte de desperdício)
- Eventos são registrados no histórico

Após a simulação, Dashboard, Monitoramento, Alimentos e Relatórios refletem os novos dados.

---

## Regra de desperdício

```
Produção → Consumo → Reposições → Quantidade restante → Descarte = Desperdício
```

**Exemplo:** 50 kg produzidos, 44 kg consumidos, 6 kg restantes, 2 kg descartados → **Desperdício = 2 kg** → **Eficiência = 96%**

O que resta na bandeja **não** é desperdício. Apenas a sobra descartada conta.

---

## Equipe

- João Vitor Moreira
- João Vitor Sampaio
- Esdras
- Caique
- Felipe Borges
