export const DBConfig = {
  name: 'WaysbookApp',
  version: 6,
  objectStoresMeta: [
    {
      store: 'cartbook',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        {
          name: 'id_book',
          keypath: 'id_book',
          options: { unique: true },
        },
        { name: 'author', keypath: 'author', options: { unique: false } },
        { name: 'price', keypath: 'price', options: { unique: false } },
        { name: 'image', keypath: 'image', options: { unique: false } },
      ],
    },
  ],
};
