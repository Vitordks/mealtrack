# 🍽 MealTrack

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
### 3. Inserir restaurante (OBRIGATÓRIO)
```
INSERT INTO restaurante (nome, cnpj, email, telefone, endereco, data_fundacao)
VALUES (
    'Restaurante Teste',
    '12.345.678/0001-99',
    'teste@mealtrack.com',
    '(71)99999-9999',
    'Rua Central, 100',
    '2020-01-01'
);
```
### 4. Configurar backend
```
spring.datasource.url=jdbc:mysql://localhost:3306/mealtrack
spring.datasource.username=root
spring.datasource.password=SUA_SENHA

spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
```

### 5. Rodar backend
```
cd mealtrack
./mvnw spring-boot:run
```

### 6.Rodar frontend
```
cd Front/mealtrack-frontend
npm install
npm run dev
```

### Login
- Criar usuário pelo cadastro
- Ou inserir direto no banco

## Equipe
- João Vitor Moreira
- João Vitor Sampaio
- Esdras
- Caique
- Felipe Borges