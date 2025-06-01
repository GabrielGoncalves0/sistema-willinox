export class FormatString {
    static nome = /^[A-Za-zÀ-ú\s]+$/;
    static endereco = /^[A-Za-zÀ-ú0-9\s,]*$/;

    static filtrarNome(value: string): string {
        return value.replace(/[^A-Za-zÀ-ú\s]/g, '');
    }

    static filtrarEndereco(value: string): string {
        return value.replace(/[^A-Za-zÀ-ú0-9\s,]/g, '');
    }

    static formatTelefone(value: string): string {
        const numbersOnly = value.replace(/\D/g, '').slice(0, 11);
        if (numbersOnly.length <= 10) {
            return numbersOnly.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
        } else {
            return numbersOnly.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
        }
    }

    static formatCPF(value: string): string {
        return value
            .replace(/\D/g, '')
            .slice(0, 11)
            .replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
            .trim();
    }

    static formatCNPJ(value: string): string {
        return value
            .replace(/\D/g, '')
            .slice(0, 14)
            .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})$/, '$1.$2.$3/$4-$5')
            .trim();
    }

    static isValidCPF(cpf: string): boolean {
        cpf = cpf.replace(/\D/g, '');

        if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        let resto;

        for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[9])) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        return resto === parseInt(cpf[10]);
    }

    static isValidCNPJ(cnpj: string): boolean {
        cnpj = cnpj.replace(/\D/g, '');

        if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

        const calcCheckDigit = (cnpj: string, length: number): number => {
            const weights = length === 12
                ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
                : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

            const numbers = cnpj.substring(0, length).split('').map(Number);

            const sum = numbers.reduce((acc, num, idx) => acc + num * weights[idx], 0);

            const remainder = sum % 11;
            return remainder < 2 ? 0 : 11 - remainder;
        };

        const firstCheckDigit = calcCheckDigit(cnpj, 12);
        const secondCheckDigit = calcCheckDigit(cnpj, 13);

        return (
            firstCheckDigit === parseInt(cnpj.charAt(12)) &&
            secondCheckDigit === parseInt(cnpj.charAt(13))
        );
    }


}
