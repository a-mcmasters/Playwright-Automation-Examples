import { expect, test } from '@playwright/test';

test('Rahul Shetty Shopping', async ({ page }) => {
    const products = page.locator(".card-body")
    const productname = 'zara coat 3'
    const email = 'torsomanzer@gmail.com'
    
    //Login Page
    await page.goto('https://rahulshettyacademy.com/client/');
    await expect(page).toHaveTitle("Let's Shop");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("!5.2wjCTXLQ2mr");
    await page.locator("#login").click();

    //Home Page
    await page.waitForLoadState("networkidle");
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);
    const count = await products.count();
    console.log(count);
    for(let i=0; i<count; i++){
        if(await products.nth(i).locator('b').textContent() === productname){
            await products.nth(i).getByRole('button', {name: 'Add To Cart'}).click();
            break;
        }
    }

    //Cart Page
    await page.locator('[routerlink*=cart]').click();
    await page.locator("div li").first().waitFor();
    const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
    expect(bool).toBeTruthy();
    await page.getByRole('button', {name: 'Checkout'}).click();
    
    //Checkout Page
    await expect(page.locator(".user__name")).toContainText(email);
    await page.locator("[placeholder*='Country']").type("uni", {delay:10});
    const dropdown = page.locator(".ta-results");
    await dropdown.waitFor();
    const dropdowncount = await dropdown.locator("button").count();
    for(let i=0; i<dropdowncount; i++){
        const text = await dropdown.locator("button").nth(i).textContent();
        if(text?.trim() === 'United States'){
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }
    await page.locator(".action__submit").click();
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ");
    const orderID = await page.locator(".em-spacer-1 .ng-star-inserted").textContent();
    console.log(orderID);
    await page.getByRole('button', { name: ' ORDERS'}).click();

    //Order Page
    await page.locator(".table").waitFor();
    const rows = page.locator("tbody tr");
    for(let i=0; i<await rows.count(); i++){
        const rowOrderID = await rows.nth(i).locator("th").textContent();
        if(orderID){
            if(rowOrderID && orderID.includes(rowOrderID)){
                await rows.nth(i).locator("button").first().click();
                break;
            }
        }
        else{
            console.log("OrderID is null");
        }
    }

    //Order Details Page
    const orderIDDetails = await page.locator(".col-text").textContent();
    expect(orderID).toContain(orderIDDetails);
    await expect(page.locator(".title")).toHaveText(productname);
});

test("Automation Practice", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

    //Display Values
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    
    //Dialog Boxes
    page.on('dialog', dialog => dialog.accept())
    await page.locator("#confirmbtn").click();

    //Mouse Hover
    await page.locator("#mousehover").hover();
    await expect(page.locator("(//a[normalize-space()='Reload'])[1]")).toBeVisible();
    await expect(page.locator("(//a[normalize-space()='Top'])[1]")).toBeVisible();

    //Frame
    const framesPage = page.frameLocator("#courses-iframe");
    await framesPage.locator("li a[href$='lifetime-access']:visible").click();
    expect(await framesPage.locator("div[class='text'] h2 span").textContent()).toEqual("13,522");
});