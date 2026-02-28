// Native fetch takes over

async function testApi() {
    try {
        console.log("1. Testing Registration...");
        const regRes = await fetch("http://localhost:3000/api/extension/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: `test${Date.now()}@example.com`, password: "password123", action: "register" })
        });
        const regData = await regRes.json();
        console.log("Registration Response:", regData);

        if (!regData.token) {
            console.error("Failed to get token");
            return;
        }

        console.log("\n2. Testing Verification Pipeline...");
        const verifyRes = await fetch("http://localhost:3000/api/extension/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", userToken: regData.token })
        });
        const verifyData = await verifyRes.json();
        console.log("Verification Response:", JSON.stringify(verifyData, null, 2));

        console.log("\n3. Testing Scan History...");
        const historyRes = await fetch("http://localhost:3000/api/extension/scans", {
            headers: { "Authorization": `Bearer ${regData.token}` }
        });
        const historyData = await historyRes.json();
        console.log("History Response:", JSON.stringify(historyData, null, 2));

    } catch (err) {
        console.error("Test failed:", err);
    }
}

testApi();
