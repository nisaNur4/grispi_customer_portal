export const durumRengi = (d) => {
    switch (d) {
        case 'Açık': return 'blue';
        case 'İşlemde': return 'orange';
        case 'Beklemede': return 'gold';
        case 'Çözüldü': return 'green';
        default: return 'default';
    }
};

export const oncelikRengi = (o) => {
    switch (o) {
        case 'Acil': return 'red';
        case 'Yüksek': return 'volcano';
        case 'Normal': return 'blue';
        case 'Düşük': return 'green';
        default: return 'default';
    }
};