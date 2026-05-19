export async function fetchHSNCode(itemName: string) {
  if (!itemName || itemName.length < 3) return null;

  try {
    const response = await fetch("/api/hsn-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemName }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch HSN code from server");
    }

    const data = await response.json();
    return data.hsnCode || null;
  } catch (error) {
    console.error("Error fetching HSN code:", error);
    return null;
  }
}
