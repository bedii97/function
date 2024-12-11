function capitalizeWords(text) {
    if (!text || text.trim() === "") return text;

    return text.split(' ').map(word => {
        if (word.trim() !== "") {
            let modifiedWord = word.replace(/İ/g, 'i').toLowerCase();
            return modifiedWord.charAt(0).toUpperCase() + modifiedWord.slice(1);
        }
        return word;
    }).join(' ');
}
console.log(capitalizeWords("İSTANBUL İZMİR")); // Çıktı: "Istanbul Izmir"
console.log(capitalizeWords("ali veli")); // Çıktı: "Ali Veli"
console.log(capitalizeWords("ali İZMİRİİİRRR")); // Çıktı: "Ali Veli"
console.log(capitalizeWords("")); // Çıktı: ""
console.log(capitalizeWords("   ")); // Çıktı: ""