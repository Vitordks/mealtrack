import { defineConfig, devices } from "@playwright/test";

export default defineConfig({

    testDir: "./src/tests",

    fullyParallel: false,

    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 2 : 0,

    workers: 1,

    reporter: "html",

    use: {

        baseURL: "http://localhost:9091",

        trace: "on-first-retry",

        screenshot: "only-on-failure",

        video: "off",

        headless: false,

        launchOptions: {
            executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        },

    },

    projects: [

        {
            name: "chrome",
            use: {
                ...devices["Desktop Chrome"],
            },
        },

    ],

});