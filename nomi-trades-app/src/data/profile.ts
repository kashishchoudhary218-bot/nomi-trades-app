import { colors } from '../theme/colors';

export interface ProfileItem {
  mark: string;
  name: string;
  sub: string;
  value: string;
  bg: string;
  fg: string;
}

export interface ProfileGroup {
  title: string;
  items: ProfileItem[];
}

// Static content ported 1:1 from the Claude Design prototype's profileGroups.
export const PROFILE_GROUPS: ProfileGroup[] = [
  {
    title: 'ACCOUNT',
    items: [
      { mark: 'ID', name: 'Identity verification', sub: 'Step 2 of 3 · address proof', value: '', bg: colors.downSoftest, fg: colors.downText },
      { mark: '₹', name: 'Payment methods', sub: 'UPI · 2 cards linked', value: '', bg: colors.accentSoft, fg: colors.accent },
      { mark: 'SF', name: 'Swap-free trading', sub: 'Applied to NOMI ZERO', value: 'Active', bg: colors.upSofter, fg: colors.up },
    ],
  },
  {
    title: 'WALLET',
    items: [
      { mark: 'W', name: 'Crypto wallet', sub: 'USDT · TRC-20', value: '0.00 USD', bg: 'rgba(127,168,255,.14)', fg: colors.blue },
      { mark: 'CT', name: 'Copy trading', sub: 'Follow verified strategies', value: '', bg: 'rgba(169,180,245,.14)', fg: colors.purple },
      { mark: 'RF', name: 'Referral programme', sub: 'Earn per funded referral', value: '', bg: 'rgba(240,199,94,.14)', fg: colors.gold },
    ],
  },
  {
    title: 'SUPPORT',
    items: [
      { mark: '?', name: 'Help centre', sub: 'Guides and answers', value: '', bg: colors.whiteWash07, fg: colors.textBody },
      { mark: 'LC', name: 'Live chat', sub: 'Typical reply under 2 min', value: '', bg: colors.whiteWash07, fg: colors.textBody },
      { mark: 'LG', name: 'Legal documents', sub: 'Nomi Trades Ltd', value: '', bg: colors.whiteWash07, fg: colors.textBody },
    ],
  },
];

export const PROFILE_USER = {
  initials: 'AR',
  name: 'Aarav Rathore',
  email: 'aarav.r@nomitrades.app',
  verified: false,
};
