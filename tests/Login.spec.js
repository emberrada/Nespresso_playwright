import { chromium,test } from "@playwright/test";

test("login",async()=>{
    const browser = await chromium.launch();
    const context = await browser.newContext();
    
})