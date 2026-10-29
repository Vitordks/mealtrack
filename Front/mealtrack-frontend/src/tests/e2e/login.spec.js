import { test, expect } from "@playwright/test";

test.describe("Autenticação do MealTrack", () => {

    test("deve realizar login com usuário válido", async ({ page }) => {

        await page.goto("/login");

        await expect(
            page.getByRole("heading", { name: "Entrar" })
        ).toBeVisible();

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

    });

    test("não deve realizar login com senha inválida", async ({ page }) => {

        await page.goto("/login");

        await page
            .getByLabel("E-mail")
            .fill("admin@mealtrack.com");

        await page
            .getByLabel("Senha")
            .fill("senha_errada");

        await page
            .getByRole("button", { name: "Entrar" })
            .click();

        await expect(page).toHaveURL(/\/login/);

    });
});

