export interface CollectionType {
  id: number;
  orderNumber: string;
  category: number;
  subCategory: number;
  manufacturer: string;
}

export interface CollectionState {
  collectionList: {
    loading: boolean;
    data: CollectionType[];
  };
}
