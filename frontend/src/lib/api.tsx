export async function shortenUrl(longUrl: string) {
    console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: longUrl }),
    });

    if (!res.ok) {
        throw new Error("Failed to shorten URL");
    }

    return res.json();
}