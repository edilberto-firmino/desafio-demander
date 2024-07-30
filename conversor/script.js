
function convertToRoman() {
    let num = parseInt(document.getElementById('number').value);
    if (isNaN(num) || num < 1 || num > 3999) {
        document.getElementById('result').innerText = 'Por favor, insira um número entre 1 e 3999.';
        return;
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

    document.getElementById('result').innerText = `O número romano é ${roman}.`;
}
