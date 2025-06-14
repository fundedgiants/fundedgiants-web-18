
export interface Program {
    id: string;
    name: string;
    description: string;
    price: number;
    size: string;
}

export interface AddOn {
    id: string;
    name: string;
    description: string;
    pricePercent: number;
}

export const programs: Program[] = [
    { id: 'stellar', name: 'Stellar Account', description: 'Beginner-friendly, perfect for starting out.', price: 150, size: '25K' },
    { id: 'galaxy', name: 'Galaxy Account', description: 'For experienced traders ready to scale up.', price: 300, size: '50K' },
    { id: 'universe', name: 'Universe Account', description: 'The ultimate account for professional traders.', price: 550, size: '100K' }
];

export const addOns: AddOn[] = [
    { id: 'leverage', name: 'Increase Leverage to 1:50', description: 'Boost your trading power with higher leverage.', pricePercent: 20 },
    { id: 'drawdown', name: 'Increase DrawDown by 2%', description: 'Get more room for your trades to breathe.', pricePercent: 20 },
    { id: 'no_profit_target', name: 'Remove Profit Target from 1st, 2nd, and 3rd Withdrawals', description: 'Removes profit targets and minimum trading days for your first 3 payouts.', pricePercent: 30 },
    { id: 'profit_split', name: 'Increase Profit Split (80:20 from onset)', description: 'Enjoy an 80:20 profit split from the very beginning.', pricePercent: 50 }
];

export const steps = [
    { id: 1, name: 'Choose Program' },
    { id: 2, name: 'Select Add-ons' },
    { id: 3, name: 'Confirm & Pay' }
];

export const stepsWithAuth = [
    { id: 1, name: 'Choose Program' },
    { id: 2, name: 'Select Add-ons' },
    { id: 3, name: 'Account' },
    { id: 4, name: 'Confirm & Pay' }
];
