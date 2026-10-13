export function formatTextToHtml(plainText) {
    if (!plainText) return "";

    // 1. Security: Escape raw HTML tags to prevent security issues (XSS)
    let safeText = plainText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

    // 2. Convert Bold (**text**) to <strong>
    safeText = safeText.replace(/\*\*(.*?)\*\*/g, "<strong>\$1</strong>");

    // 3. Convert Italics (*text*) to <em>
    safeText = safeText.replace(/\*(.*?)\*/g, "<em>\$1</em>");

    // 4. Convert new lines into <p> tags
    // Split the text by one or more newlines (\n)
    const paragraphs = safeText.split(/\n+/);
    
    // Wrap each non-empty line inside a <p> tag
    const htmlOutput = paragraphs
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .map(p => `<p>${p}</p>`)
        .join("\n");

    return htmlOutput;
}
