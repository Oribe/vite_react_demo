export interface CollectionType {
  orderNumber: string;
  category: number;
  subCategory: number;
  manufacturer: string;
}

export interface CollectionState {
  collectionList: CollectionType[];
}
