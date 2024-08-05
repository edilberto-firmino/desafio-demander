// Função para converter número arábico para romano
function convertToRoman(num) {
    if (isNaN(num) || num < 1 || num > 3999) {
        return 'Número inválido. Por favor, insira um número entre 1 e 3999.';
    }

    const val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    let roman = '';

    for (let i = 0; i < val.length; i++) {
        while (num >= val[i]) {
            roman += syms[i];
            num -= val[i];
        }
    }

    return roman;
}

// Função para converter número romano para arábico
function convertToArabic(roman) {
    const romanToArabic = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
    };
    let num = 0;
    let prevValue = 0;

    for (let i = roman.length - 1; i >= 0; i--) {
        let char = roman[i];
        let value = romanToArabic[char];

        if (value < prevValue) {
            num -= value;
        } else {
            num += value;
        }

        prevValue = value;
    }

    return num;
}

// Função para determinar se a entrada é romana ou arábica e converter
function convert() {
    const input = document.getElementById('input').value.toUpperCase().trim();
    let result = '';

    if (/^[IVXLCDM]+$/.test(input)) {
        // Entrada é um número romano
        const arabicNumber = convertToArabic(input);
        result = isNaN(arabicNumber) ? 'Número romano inválido.' : `O número arábico é ${arabicNumber}.`;
    } else {
        // Entrada é um número arábico
        const arabicNumber = parseInt(input);
        result = isNaN(arabicNumber) ? 'Por favor, insira um número válido.' : `O número romano é ${convertToRoman(arabicNumber)}.`;
    }

    document.getElementById('result').innerText = result;
}
