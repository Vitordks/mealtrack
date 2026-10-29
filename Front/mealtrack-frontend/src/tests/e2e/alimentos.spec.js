import { test, expect } from "@playwright/test";

test.describe("Alimentos", () => {

    test("deve cadastrar um novo alimento", async ({ page }) => {

        const nomeAlimento = `Arroz E2E ${Date.now()}`;

        // Login
        await page.goto("/login");

        await page
            .getByLabel("E-mail")
            .fill("admin@mealtrack.com");

        await page
            .getByLabel("Senha")
            .fill("123456");

        await page
            .getByRole("button", { name: "Entrar" })
            .click();

        await expect(page).toHaveURL(/\/$/);

        // Acessa alimentos
        await page.goto("/alimentos");

        await expect(
            page.getByRole("heading", { name: "Alimentos" })
        ).toBeVisible();

        // Abre o formulário
        await page
            .getByRole("button", { name: /Novo alimento/i })
            .click();

        await expect(
            page.getByRole("heading", { name: /Novo alimento/i })
        ).toBeVisible();

        // Preenche o formulário
        await page
            .getByLabel("Nome")
            .fill(nomeAlimento);

        await page
            .getByLabel("Categoria")
            .fill("Cereais e grãos");

        await page
            .getByLabel("Valor (R$/kg)")
            .fill("8.50");

        await page
            .getByLabel("Quantidade Inicial (kg)")
            .fill("20");

        await page
            .getByLabel("Quantidade Atual (kg)")
            .fill("20");

        await page
            .getByLabel("Quantidade Desperdiçada (kg)")
            .fill("0");

        // Salva
        await page
            .getByRole("button", { name: /salvar|cadastrar|criar/i })
            .click();

        // Aguarda o alimento aparecer na tabela
        await expect(
            page.getByText(nomeAlimento)
        ).toBeVisible();

    });


    test("deve editar um alimento existente", async ({ page }) => {

        const nomeOriginal = `Alimento edição E2E ${Date.now()}`;
        const nomeEditado = `Alimento editado E2E ${Date.now()}`;

        // Login
        await page.goto("/login");

        await page
            .getByLabel("E-mail")
            .fill("admin@mealtrack.com");

        await page
            .getByLabel("Senha")
            .fill("123456");

        await page
            .getByRole("button", { name: "Entrar" })
            .click();

        await expect(page).toHaveURL(/\/$/);

        // Acessa alimentos
        await page.goto("/alimentos");

        await expect(
            page.getByRole("heading", { name: "Alimentos" })
        ).toBeVisible();

        // Cria o alimento que será utilizado no teste de edição
        await page
            .getByRole("button", { name: /Novo alimento/i })
            .click();

        await expect(
            page.getByRole("heading", { name: /Novo alimento/i })
        ).toBeVisible();

        await page
            .getByLabel("Nome")
            .fill(nomeOriginal);

        await page
            .getByLabel("Categoria")
            .fill("Cereais e grãos");

        await page
            .getByLabel("Valor (R$/kg)")
            .fill("8.50");

        await page
            .getByLabel("Quantidade Inicial (kg)")
            .fill("20");

        await page
            .getByLabel("Quantidade Atual (kg)")
            .fill("20");

        await page
            .getByLabel("Quantidade Desperdiçada (kg)")
            .fill("0");

        await page
            .getByRole("button", { name: /salvar|cadastrar|criar/i })
            .click();

        // Aguarda o alimento aparecer
        await expect(
            page.getByText(nomeOriginal)
        ).toBeVisible();

        // Localiza a linha específica do alimento
        const alimento = page
            .getByRole("row")
            .filter({ hasText: nomeOriginal });

        await expect(alimento).toBeVisible();

        // Abre o menu de ações
        await alimento
            .getByRole("button", { name: "Abrir ações" })
            .click();

        // Clica em Editar
        await page
            .getByRole("menuitem", { name: "Editar" })
            .click();

        // Verifica se o formulário de edição abriu
        await expect(
            page.getByRole("heading", { name: /Editar alimento/i })
        ).toBeVisible();

        // Altera o nome
        await page
            .getByLabel("Nome")
            .fill(nomeEditado);

        // Salva
        await page
            .getByRole("button", { name: /salvar|cadastrar|criar/i })
            .click();

        // Verifica se o nome foi alterado
        await expect(
            page.getByText(nomeEditado)
        ).toBeVisible();

    });
test("deve excluir um alimento existente", async ({ page }) => {

    const nomeAlimento = `Alimento exclusão E2E ${Date.now()}`;

    // Login
    await page.goto("/login");

    await page
        .getByLabel("E-mail")
        .fill("admin@mealtrack.com");

    await page
        .getByLabel("Senha")
        .fill("123456");

    await page
        .getByRole("button", { name: "Entrar" })
        .click();

    await expect(page).toHaveURL(/\/$/);

    // Acessa alimentos
    await page.goto("/alimentos");

    await expect(
        page.getByRole("heading", { name: "Alimentos" })
    ).toBeVisible();

    // Abre o formulário de cadastro
    await page
        .getByRole("button", { name: /Novo alimento/i })
        .click();

    await expect(
        page.getByRole("heading", { name: /Novo alimento/i })
    ).toBeVisible();

    // Preenche o alimento
    await page
        .getByLabel("Nome")
        .fill(nomeAlimento);

    await page
        .getByLabel("Categoria")
        .fill("Teste");

    await page
        .getByLabel("Valor (R$/kg)")
        .fill("10");

    await page
        .getByLabel("Quantidade Inicial (kg)")
        .fill("10");

    await page
        .getByLabel("Quantidade Atual (kg)")
        .fill("10");

    await page
        .getByLabel("Quantidade Desperdiçada (kg)")
        .fill("0");

    // Salva
    await page
        .getByRole("button", { name: /salvar|cadastrar|criar/i })
        .click();

    // Confirma que foi criado
    await expect(
        page.getByText(nomeAlimento)
    ).toBeVisible();

    // Localiza a linha do alimento
    const alimento = page
        .getByRole("row")
        .filter({ hasText: nomeAlimento });

    await expect(alimento).toBeVisible();

    // Abre o menu de ações
    await alimento
        .getByRole("button", { name: "Abrir ações" })
        .click();

    // Clica em Excluir
    await page
        .getByRole("menuitem", { name: "Excluir" })
        .click();

    // Verifica o diálogo de confirmação
    await expect(
        page.getByRole("heading", { name: "Excluir alimento" })
    ).toBeVisible();

    // Confirma a exclusão
    await page
        .getByRole("button", { name: /Excluir|Confirmar|Sim/i })
        .click();

    // Verifica que o alimento foi removido
    const alimentoExcluido = page
        .getByRole("row")
        .filter({ hasText: nomeAlimento });

    await expect(alimentoExcluido).toHaveCount(0);

});


});
