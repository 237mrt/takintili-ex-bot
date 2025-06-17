export function formatDate() {
    const now = new Date();
    const tarih = now.toLocaleDateString('tr-TR');
    const saat = now.toLocaleTimeString('tr-TR');
    return `[${tarih} ${saat}]`;
}
