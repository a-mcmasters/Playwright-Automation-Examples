import { expect, test } from '@playwright/test';

test('Browser Context Playwright Test',async ({ browser }) => {
   const context = await browser.newContext();
   const page = await context.newPage();
   await page.goto('https://a-mcmasters.github.io');
   console.log(await page.title());
   await expect(page).toHaveTitle('Alex McMasters');
});

test('Page Playwright Test', async ({ page }) => {
    const products = page.locator(".card-body")
    const productname = 'zara coat 3'
    const email = 'torsomanzer@gmail.com'
    
    await page.goto('https://rahulshettyacademy.com/client/');
    await expect(page).toHaveTitle("Let's Shop");

    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("!5.2wjCTXLQ2mr");
    await page.locator("#login").click();

    await page.waitForLoadState("networkidle");
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(titles);

    // Zara Coat 3
    const count = await products.count();
    //console.log(count);



    for(let i=0; i<count; i++){
        if(await products.nth(i).locator('b').textContent() === productname){
            //add to cart
            await products.nth(i).getByRole('button', {name: 'Add To Cart'}).click();
            break;
        }
    }

    await page.locator('[routerlink*=cart]').click();
    await page.locator("div li").first().waitFor();

    const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
    expect(bool).toBeTruthy();

    await page.getByRole('button', {name: 'Checkout'}).click();
    
    await expect(page.locator(".user__name")).toContainText(email);
    await page.locator("[placeholder*='Country']").type("uni", {delay:10});
    //await page.getByRole('button', { name: ' United States', exact: true }).click();

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

     await page.locator(".table").waitFor();
     const rows = await page.locator("tbody tr");

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

     const orderIDDetails = await page.locator(".col-text").textContent();
     await expect(orderID).toContain(orderIDDetails);
});