export interface StoreConfig {
  storeId: string;
  storeName: string;
  primaryColor: string;
  logoUrl: string;
  font: string;
  layout: 'grid' | 'list';
  currency: string;
  stripeKey: string;
}
