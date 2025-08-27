// Export number to xxxđ
export const formatMoney = (money: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(money);
};
