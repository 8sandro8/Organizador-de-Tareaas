async function testAPI() {
    try {
        console.log("Fetching Sandro API...");
        const res1 = await fetch("http://minube.tail30f4e5.ts.net:3015/api/tasks");
        const data1 = await res1.json();
        const completed1 = data1.filter(t => t.isCompleted);
        console.log(`Sandro - ${completed1.length} completed tasks.`);
        console.log("Notes in Sandro:", completed1.map(t => ({ id: t.id, title: t.title, note: t.completionNote })));

        console.log("\nFetching Pareja API...");
        const res2 = await fetch("http://minube.tail30f4e5.ts.net:3016/api/tasks");
        if (res2.ok) {
            const data2 = await res2.json();
            const completed2 = data2.filter(t => t.isCompleted);
            console.log(`Pareja - ${completed2.length} completed tasks.`);
            console.log("Notes in Pareja:", completed2.map(t => ({ id: t.id, title: t.title, note: t.completionNote })));
        } else {
            console.log("Pareja API not ready or reachable.");
        }
    } catch (e) {
        console.error("API Error", e);
    }
}
testAPI();
