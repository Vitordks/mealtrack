#  MealTrack

Sistema full stack para gerenciamento de restaurantes, usuários, alimentos e produção.

---

##  Sobre o projeto

O MealTrack é uma aplicação para controle de processos internos de restaurantes, permitindo:

- Cadastro de usuários
- Login
- Cadastro de alimentos
- Registro de produção
- Controle de refeições
- Relatórios e desperdício

---

##  Tecnologias

### Frontend
- React
- Vite
- Axios
- React Router

### Backend
- Java 24
- Spring Boot
- Spring Data JPA

### Banco de dados
- MySQL

---

##  Como rodar o projeto

### 1. Clonar o projeto

```bash
git clone https://github.com/Vitordks/mealtrack.git
```

### 2. Criar banco de dados

```bash
CREATE DATABASE mealtrack;
USE mealtrack;
```
### 3. Seed automático (DataLoader)
O sistema já inicia com dados padrão automaticamente:

- 1 restaurante base
- 1 admin
- 1 supervisor
- 3 funcionários
- alimentos padrão

Isso permite testar o sistema sem cadastrar nada manualmente.

### 4. Login padrão
Após iniciar o backend:

```bash
Email: admin@mealtrack.com
Senha: 123456
```

### 5. Configurar backend
```
spring.datasource.url=jdbc:mysql://localhost:3306/mealtrack
spring.datasource.username=root
spring.datasource.password=SUA_SENHA

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
```

### 6. Rodar backend
```
cd mealtrack
./mvnw spring-boot:run
```

### 7.Rodar frontend
```
cd Front/mealtrack-frontend
npm install
npm run dev
```

### Login
- Criar usuário pelo cadastro
- Ou inserir direto no banco

## Funcionalidades
Funcionalidades
- ✔Usuários
Login
Cadastro
Edição
Exclusão
- ✔ Alimentos
CRUD completo
- ✔ Refeições
Cadastro e listagem
- ✔ Produção
Registro de produção diária
- ✔ Relatórios
Controle de desperdício
Economia gerada

## Equipe
- João Vitor Moreira
- João Vitor Sampaio
- Esdras
- Caique
- Felipe Borges