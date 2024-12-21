const puppeteer = require("puppeteer");

async function scrapeSemMarksData() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Navigate to the ERP login page
        await page.goto("https://erp.cbit.org.in/", { waitUntil: "networkidle2" });

        // Use sample credentials (replace with actual login logic for your case)
        const username = "160123733036";
        const password = "160123733036";

        // Input username
        await page.type("#txtUserName", username);
        await page.click("#btnNext");

        // Wait for the password field
        await page.waitForSelector("#txtPassword", { visible: true });
        await page.type("#txtPassword", password);

        // Submit the form and wait for the page to load
        await Promise.all([
            page.click("#btnSubmit"),
            page.waitForNavigation({ waitUntil: "networkidle2" }),
        ]);

        // Navigate to the semester marks page
        await page.click("#ctl00_cpStud_lnkOverallMarksSemwiseMarks");
        await page.waitForNavigation({ waitUntil: "networkidle2" });

        // Wait for the div containing the marks data
        await page.waitForSelector("#ctl00_cpStud_PanelDueSubjects", { visible: true });

        // Scrape data from the table
        const semMarksData = await page.evaluate(() => {
            // Initialize result object
            const data = {};

            // Extract CGPA
            const cgpa = document.querySelector("#ctl00_cpStud_lblMarks")?.textContent.trim();
            if (cgpa) {
                data.cgpa = cgpa;
            }

            // Extract Credits Obtained
            const credits = document.querySelector("#ctl00_cpStud_lblCredits")?.textContent.trim();
            if (credits) {
                data.creditsObtained = credits;
            }

            // Extract Subject Due
            const subjectDue = document.querySelector("#ctl00_cpStud_lblDue")?.textContent.trim();
            if (subjectDue) {
                data.subjectDue = subjectDue;
            }

            return data;
        });

        // Output the scraped data in JSON format
        console.log(JSON.stringify(semMarksData, null, 2));

        await browser.close();
    } catch (error) {
        console.error("Error scraping semester data:", error.message);
    }
}

// Run the scraping function
scrapeSemMarksData();