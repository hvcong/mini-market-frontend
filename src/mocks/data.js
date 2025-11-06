// Unit Types (đơn vị tính)
export const mockUnitTypes = [
  { id: 1, name: "Cái", convertionQuantity: 1 },
  { id: 2, name: "Thùng", convertionQuantity: 24 },
  { id: 3, name: "Lốc", convertionQuantity: 6 },
  { id: 4, name: "Hộp", convertionQuantity: 1 },
  { id: 5, name: "Kg", convertionQuantity: 1 },
];

// Fixed date for mock data consistency
const MOCK_DATE = "2024-11-06T00:00:00.000Z";
const MOCK_DATE_YESTERDAY = "2024-11-05T00:00:00.000Z";

export const mockProducts = [
  {
    id: "COCA001",
    name: "Coca Cola",
    barcode: "8934588123456",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Nước ngọt có ga Coca Cola 330ml",
    quantity: 100,
    state: true,
    SubCategoryId: "SUBCAT001",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: {
      id: "CAT001",
      name: "Đồ uống",
    },
    SubCategory: {
      id: "SUBCAT001",
      name: "Nước ngọt",
      Category: {
        id: "CAT001",
        name: "Đồ uống",
      },
    },
    // ProductUnitTypes: các đơn vị bán của sản phẩm (thùng, lốc, cái...)
    ProductUnitTypes: [
      {
        id: 1,
        ProductId: "COCA001",
        UnitTypeId: 1, // Cái
        barcode: "8934588123456",
        UnitType: {
          id: 1,
          name: "Cái",
          convertionQuantity: 1,
        },
      },
      {
        id: 2,
        ProductId: "COCA001",
        UnitTypeId: 3, // Lốc
        barcode: "8934588123457",
        UnitType: {
          id: 3,
          name: "Lốc",
          convertionQuantity: 6,
        },
      },
      {
        id: 3,
        ProductId: "COCA001",
        UnitTypeId: 2, // Thùng
        barcode: "8934588123458",
        UnitType: {
          id: 2,
          name: "Thùng",
          convertionQuantity: 24,
        },
      },
    ],
  },
  {
    id: "BREAD001",
    name: "Bánh mì",
    barcode: "8934588234567",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Bánh mì sandwich gói 80g",
    quantity: 50,
    state: true,
    SubCategoryId: "SUBCAT003",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: {
      id: "CAT002",
      name: "Thực phẩm",
    },
    SubCategory: {
      id: "SUBCAT003",
      name: "Đồ ăn vặt",
      Category: {
        id: "CAT002",
        name: "Thực phẩm",
      },
    },
    ProductUnitTypes: [
      {
        id: 4,
        ProductId: "BREAD001",
        UnitTypeId: 1,
        barcode: "8934588234567",
        UnitType: {
          id: 1,
          name: "Cái",
          convertionQuantity: 1,
        },
      },
    ],
  },
  {
    id: "MILK001",
    name: "Sữa tươi Vinamilk",
    barcode: "8934588345678",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Sữa tươi tiệt trùng có đường hộp 1L",
    quantity: 75,
    state: true,
    SubCategoryId: "SUBCAT002",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: {
      id: "CAT001",
      name: "Đồ uống",
    },
    SubCategory: {
      id: "SUBCAT002",
      name: "Sữa",
      Category: {
        id: "CAT001",
        name: "Đồ uống",
      },
    },
    ProductUnitTypes: [
      {
        id: 5,
        ProductId: "MILK001",
        UnitTypeId: 4,
        barcode: "8934588345678",
        UnitType: {
          id: 4,
          name: "Hộp",
          convertionQuantity: 1,
        },
      },
      {
        id: 6,
        ProductId: "MILK001",
        UnitTypeId: 3,
        barcode: "8934588345679",
        UnitType: {
          id: 3,
          name: "Lốc",
          convertionQuantity: 6,
        },
      },
    ],
  },
  {
    id: "PEPSI001",
    name: "Pepsi Cola",
    barcode: "8934564001234",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Nước ngọt có ga Pepsi 330ml",
    quantity: 180,
    state: true,
    SubCategoryId: "SUBCAT001",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: {
      id: "CAT001",
      name: "Đồ uống",
    },
    SubCategory: {
      id: "SUBCAT001",
      name: "Nước ngọt",
      Category: {
        id: "CAT001",
        name: "Đồ uống",
      },
    },
    ProductUnitTypes: [
      {
        id: 19,
        ProductId: "PEPSI001",
        UnitTypeId: 1,
        barcode: "8934564001234",
        UnitType: {
          id: 1,
          name: "Cái",
          convertionQuantity: 1,
        },
      },
      {
        id: 20,
        ProductId: "PEPSI001",
        UnitTypeId: 3,
        barcode: "8934564001241",
        UnitType: {
          id: 3,
          name: "Lốc",
          convertionQuantity: 6,
        },
      },
      {
        id: 21,
        ProductId: "PEPSI001",
        UnitTypeId: 2,
        barcode: "8934564001258",
        UnitType: {
          id: 2,
          name: "Thùng",
          convertionQuantity: 24,
        },
      },
    ],
  },
  {
    id: "SNACK001",
    name: "Snack Oishi",
    barcode: "8934567890123",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Snack khoai tây vị tự nhiên 42g",
    quantity: 250,
    state: true,
    SubCategoryId: "SUBCAT003",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: {
      id: "CAT002",
      name: "Thực phẩm",
    },
    SubCategory: {
      id: "SUBCAT003",
      name: "Đồ ăn vặt",
      Category: {
        id: "CAT002",
        name: "Thực phẩm",
      },
    },
    ProductUnitTypes: [
      {
        id: 22,
        ProductId: "SNACK001",
        UnitTypeId: 1,
        barcode: "8934567890123",
        UnitType: {
          id: 1,
          name: "Cái",
          convertionQuantity: 1,
        },
      },
      {
        id: 23,
        ProductId: "SNACK001",
        UnitTypeId: 4,
        barcode: "8934567890130",
        UnitType: {
          id: 4,
          name: "Hộp",
          convertionQuantity: 20,
        },
      },
    ],
  },
  {
    id: "WATER001",
    name: "Nước suối Lavie",
    barcode: "8934588456789",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Nước khoáng Lavie chai 500ml",
    quantity: 500,
    state: true,
    SubCategoryId: "SUBCAT001",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: {
      id: "CAT001",
      name: "Đồ uống",
    },
    SubCategory: {
      id: "SUBCAT001",
      name: "Nước ngọt",
      Category: {
        id: "CAT001",
        name: "Đồ uống",
      },
    },
    ProductUnitTypes: [
      {
        id: 24,
        ProductId: "WATER001",
        UnitTypeId: 1,
        barcode: "8934588456789",
        UnitType: {
          id: 1,
          name: "Cái",
          convertionQuantity: 1,
        },
      },
      {
        id: 25,
        ProductId: "WATER001",
        UnitTypeId: 3,
        barcode: "8934588456796",
        UnitType: {
          id: 3,
          name: "Lốc",
          convertionQuantity: 12,
        },
      },
      {
        id: 26,
        ProductId: "WATER001",
        UnitTypeId: 2,
        barcode: "8934588456803",
        UnitType: {
          id: 2,
          name: "Thùng",
          convertionQuantity: 24,
        },
      },
    ],
  },
  {
    id: "INSTANT001",
    name: "Mì gói Hảo Hảo",
    barcode: "8934563456123",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Mì ăn liền Hảo Hảo vị tôm chua cay",
    quantity: 400,
    state: true,
    SubCategoryId: "SUBCAT004",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: {
      id: "CAT002",
      name: "Thực phẩm",
    },
    SubCategory: {
      id: "SUBCAT004",
      name: "Mì ăn liền",
      Category: {
        id: "CAT002",
        name: "Thực phẩm",
      },
    },
    ProductUnitTypes: [
      {
        id: 27,
        ProductId: "INSTANT001",
        UnitTypeId: 1,
        barcode: "8934563456123",
        UnitType: {
          id: 1,
          name: "Cái",
          convertionQuantity: 1,
        },
      },
      {
        id: 28,
        ProductId: "INSTANT001",
        UnitTypeId: 4,
        barcode: "8934563456130",
        UnitType: {
          id: 4,
          name: "Hộp",
          convertionQuantity: 30,
        },
      },
    ],
  },
  {
    id: "RICE001",
    name: "Gạo ST25",
    barcode: "8936012345678",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Gạo ST25 thơm ngon túi 5kg",
    quantity: 80,
    state: true,
    SubCategoryId: "SUBCAT005",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: {
      id: "CAT002",
      name: "Thực phẩm",
    },
    SubCategory: {
      id: "SUBCAT005",
      name: "Gạo",
      Category: {
        id: "CAT002",
        name: "Thực phẩm",
      },
    },
    ProductUnitTypes: [
      {
        id: 29,
        ProductId: "RICE001",
        UnitTypeId: 5,
        barcode: "8936012345678",
        UnitType: {
          id: 5,
          name: "Kg",
          convertionQuantity: 5,
        },
      },
    ],
  },
  {
    id: "MILK001",
    name: "Sữa tươi TH True Milk",
    barcode: "8936136150019",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Sữa tươi tiệt trùng có đường hộp 1 lít",
    quantity: 80,
    state: true,
    SubCategoryId: "SUBCAT002",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: { id: "CAT001", name: "Đồ uống" },
    SubCategory: { id: "SUBCAT002", name: "Sữa", Category: { id: "CAT001", name: "Đồ uống" } },
    ProductUnitTypes: [
      { id: 50, ProductId: "MILK001", UnitTypeId: 1, barcode: "8936136150019", UnitType: { id: 1, name: "Cái", convertionQuantity: 1 } },
      { id: 51, ProductId: "MILK001", UnitTypeId: 4, barcode: "8936136150020", UnitType: { id: 4, name: "Hộp", convertionQuantity: 12 } },
    ],
  },
  {
    id: "BEER001",
    name: "Bia Tiger",
    barcode: "8934868102571",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Bia Tiger lon 330ml",
    quantity: 200,
    state: true,
    SubCategoryId: "SUBCAT004",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: { id: "CAT001", name: "Đồ uống" },
    SubCategory: { id: "SUBCAT004", name: "Bia", Category: { id: "CAT001", name: "Đồ uống" } },
    ProductUnitTypes: [
      { id: 52, ProductId: "BEER001", UnitTypeId: 1, barcode: "8934868102571", UnitType: { id: 1, name: "Cái", convertionQuantity: 1 } },
      { id: 53, ProductId: "BEER001", UnitTypeId: 3, barcode: "8934868102572", UnitType: { id: 3, name: "Lốc", convertionQuantity: 6 } },
      { id: 54, ProductId: "BEER001", UnitTypeId: 2, barcode: "8934868102573", UnitType: { id: 2, name: "Thùng", convertionQuantity: 24 } },
    ],
  },
  {
    id: "INSTANT001",
    name: "Mì Hảo Hảo Tôm Chua Cay",
    barcode: "8934563111199",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Mì ăn liền Hảo Hảo gói 75g",
    quantity: 300,
    state: true,
    SubCategoryId: "SUBCAT005",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: { id: "CAT002", name: "Thực phẩm" },
    SubCategory: { id: "SUBCAT005", name: "Mì ăn liền", Category: { id: "CAT002", name: "Thực phẩm" } },
    ProductUnitTypes: [
      { id: 55, ProductId: "INSTANT001", UnitTypeId: 1, barcode: "8934563111199", UnitType: { id: 1, name: "Cái", convertionQuantity: 1 } },
      { id: 56, ProductId: "INSTANT001", UnitTypeId: 4, barcode: "8934563111200", UnitType: { id: 4, name: "Hộp", convertionQuantity: 30 } },
    ],
  },
  {
    id: "CANDY001",
    name: "Kẹo Alpenliebe",
    barcode: "8934680021036",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Kẹo sữa Alpenliebe túi 150g",
    quantity: 120,
    state: true,
    SubCategoryId: "SUBCAT003",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: { id: "CAT002", name: "Thực phẩm" },
    SubCategory: { id: "SUBCAT003", name: "Đồ ăn vặt", Category: { id: "CAT002", name: "Thực phẩm" } },
    ProductUnitTypes: [
      { id: 57, ProductId: "CANDY001", UnitTypeId: 1, barcode: "8934680021036", UnitType: { id: 1, name: "Cái", convertionQuantity: 1 } },
    ],
  },
  {
    id: "COFFEE001",
    name: "Cà phê G7 3in1",
    barcode: "8934588012345",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Cà phê hòa tan G7 hộp 21 gói x 16g",
    quantity: 75,
    state: true,
    SubCategoryId: "SUBCAT006",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: { id: "CAT001", name: "Đồ uống" },
    SubCategory: { id: "SUBCAT006", name: "Cà phê", Category: { id: "CAT001", name: "Đồ uống" } },
    ProductUnitTypes: [
      { id: 58, ProductId: "COFFEE001", UnitTypeId: 4, barcode: "8934588012345", UnitType: { id: 4, name: "Hộp", convertionQuantity: 1 } },
    ],
  },
  {
    id: "RICE001",
    name: "Gạo ST25",
    barcode: "8936136789012",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Gạo thơm đặc sản ST25 túi 5kg",
    quantity: 50,
    state: true,
    SubCategoryId: "SUBCAT007",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: { id: "CAT002", name: "Thực phẩm" },
    SubCategory: { id: "SUBCAT007", name: "Gạo", Category: { id: "CAT002", name: "Thực phẩm" } },
    ProductUnitTypes: [
      { id: 59, ProductId: "RICE001", UnitTypeId: 5, barcode: "8936136789012", UnitType: { id: 5, name: "Kg", convertionQuantity: 5 } },
    ],
  },
  {
    id: "DETERGENT001",
    name: "Nước rửa chén Sunlight",
    barcode: "8934868245678",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Nước rửa chén Sunlight chanh chai 800g",
    quantity: 90,
    state: true,
    SubCategoryId: "SUBCAT008",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: { id: "CAT003", name: "Gia dụng" },
    SubCategory: { id: "SUBCAT008", name: "Vệ sinh", Category: { id: "CAT003", name: "Gia dụng" } },
    ProductUnitTypes: [
      { id: 60, ProductId: "DETERGENT001", UnitTypeId: 1, barcode: "8934868245678", UnitType: { id: 1, name: "Cái", convertionQuantity: 1 } },
    ],
  },
  {
    id: "SOAP001",
    name: "Xà phòng Lifebuoy",
    barcode: "8934868123789",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Xà phòng diệt khuẩn Lifebuoy 90g",
    quantity: 150,
    state: true,
    SubCategoryId: "SUBCAT008",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: { id: "CAT003", name: "Gia dụng" },
    SubCategory: { id: "SUBCAT008", name: "Vệ sinh", Category: { id: "CAT003", name: "Gia dụng" } },
    ProductUnitTypes: [
      { id: 61, ProductId: "SOAP001", UnitTypeId: 1, barcode: "8934868123789", UnitType: { id: 1, name: "Cái", convertionQuantity: 1 } },
    ],
  },
  {
    id: "TISSUE001",
    name: "Khăn giấy Tempo",
    barcode: "8934563987654",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Khăn giấy Tempo hộp 150 tờ",
    quantity: 100,
    state: true,
    SubCategoryId: "SUBCAT008",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: { id: "CAT003", name: "Gia dụng" },
    SubCategory: { id: "SUBCAT008", name: "Vệ sinh", Category: { id: "CAT003", name: "Gia dụng" } },
    ProductUnitTypes: [
      { id: 62, ProductId: "TISSUE001", UnitTypeId: 4, barcode: "8934563987654", UnitType: { id: 4, name: "Hộp", convertionQuantity: 1 } },
    ],
  },
  {
    id: "SHAMPOO001",
    name: "Dầu gội Clear",
    barcode: "8934868345678",
    images: [{uri: "https://placehold.co/150x150/png"}],
    description: "Dầu gội Clear Men chai 650g",
    quantity: 70,
    state: true,
    SubCategoryId: "SUBCAT008",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    Category: { id: "CAT003", name: "Gia dụng" },
    SubCategory: { id: "SUBCAT008", name: "Vệ sinh", Category: { id: "CAT003", name: "Gia dụng" } },
    ProductUnitTypes: [
      { id: 63, ProductId: "SHAMPOO001", UnitTypeId: 1, barcode: "8934868345678", UnitType: { id: 1, name: "Cái", convertionQuantity: 1 } },
    ],
  },
];

export const mockOrders = [
  {
    id: 1,
    orderDate: MOCK_DATE,
    total: 50000,
    status: "completed",
    customerId: 1,
    EmployeeId: 1,
    Employee: {
      id: 1,
      name: "Admin User",
      phonenumber: "0868283915",
    },
    BillDetails: [
      {
        id: 1,
        BillId: 1,
        quantity: 2,
        price: 15000,
        Price: {
          id: 1,
          price: 15000,
          ProductUnitTypeId: 1,
          ProductUnitType: {
            id: 1,
            ProductId: "COCA001",
            UnitTypeId: 1,
            Product: {
              id: "COCA001",
              name: "Coca Cola",
              barcode: "8934588123456",
            },
            UnitType: {
              id: 1,
              name: "Cái",
              convertionQuantity: 1,
            },
          },
        },
      },
    ],
    items: [
      { 
        productId: "COCA001", 
        productName: "Coca Cola", 
        quantity: 2, 
        price: 15000 
      },
    ],
  },
  {
    id: 2,
    orderDate: MOCK_DATE_YESTERDAY,
    total: 124000,
    status: "completed",
    customerId: 2,
    EmployeeId: 1,
    Employee: {
      id: 1,
      name: "Admin User",
      phonenumber: "0868283915",
    },
    BillDetails: [
      {
        id: 11,
        BillId: 2,
        quantity: 1,
        price: 90000,
        Price: {
          id: 11,
          price: 90000,
          ProductUnitTypeId: 2,
          ProductUnitType: {
            id: 2,
            ProductId: "COCA001",
            UnitTypeId: 3,
            Product: {
              id: "COCA001",
              name: "Coca Cola",
              barcode: "8934588123456",
            },
            UnitType: {
              id: 3,
              name: "Lốc",
              convertionQuantity: 6,
            },
          },
        },
      },
      {
        id: 12,
        BillId: 2,
        quantity: 2,
        price: 12000,
        Price: {
          id: 12,
          price: 12000,
          ProductUnitTypeId: 4,
          ProductUnitType: {
            id: 4,
            ProductId: "BREAD001",
            UnitTypeId: 1,
            Product: {
              id: "BREAD001",
              name: "Bánh mì",
              barcode: "8934588234567",
            },
            UnitType: {
              id: 1,
              name: "Cái",
              convertionQuantity: 1,
            },
          },
        },
      },
      {
        id: 13,
        BillId: 2,
        quantity: 10,
        price: 5000,
        Price: {
          id: 13,
          price: 5000,
          ProductUnitTypeId: 24,
          ProductUnitType: {
            id: 24,
            ProductId: "WATER001",
            UnitTypeId: 1,
            Product: {
              id: "WATER001",
              name: "Nước suối Lavie",
              barcode: "8934588456789",
            },
            UnitType: {
              id: 1,
              name: "Cái",
              convertionQuantity: 1,
            },
          },
        },
      },
    ],
    items: [
      { productId: "COCA001", productName: "Coca Cola", quantity: 1, price: 90000 },
      { productId: "BREAD001", productName: "Bánh mì", quantity: 2, price: 12000 },
      { productId: "WATER001", productName: "Nước suối Lavie", quantity: 10, price: 5000 },
    ],
  },
  {
    id: 3,
    orderDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    total: 312000,
    status: "completed",
    customerId: 1,
    EmployeeId: 1,
    Employee: {
      id: 1,
      name: "Admin User",
      phonenumber: "0868283915",
    },
    BillDetails: [
      {
        id: 21,
        BillId: 3,
        quantity: 2,
        price: 84000,
        Price: {
          id: 21,
          price: 84000,
          ProductUnitTypeId: 20,
          ProductUnitType: {
            id: 20,
            ProductId: "PEPSI001",
            UnitTypeId: 3,
            Product: {
              id: "PEPSI001",
              name: "Pepsi Cola",
              barcode: "8934564001234",
            },
            UnitType: {
              id: 3,
              name: "Lốc",
              convertionQuantity: 6,
            },
          },
        },
      },
      {
        id: 22,
        BillId: 3,
        quantity: 3,
        price: 48000,
        Price: {
          id: 22,
          price: 48000,
          ProductUnitTypeId: 22,
          ProductUnitType: {
            id: 22,
            ProductId: "SNACK001",
            UnitTypeId: 1,
            Product: {
              id: "SNACK001",
              name: "Snack Oishi",
              barcode: "8934567890123",
            },
            UnitType: {
              id: 1,
              name: "Cái",
              convertionQuantity: 1,
            },
          },
        },
      },
    ],
    items: [
      { productId: "PEPSI001", productName: "Pepsi Cola", quantity: 2, price: 84000 },
      { productId: "SNACK001", productName: "Snack Oishi", quantity: 3, price: 48000 },
    ],
  },
];

export const mockUser = {
  id: 1,
  username: "admin",
  email: "admin@minimarket.com",
  role: "admin",
};

// Accounts (theo API Documentation)
export const mockAccounts = [
  {
    phonenumber: "0868283915",
    email: "admin@minimarket.com",
    password: "$2b$10$hashedPassword123",
    role: "AD",
    pointAchive: 0,
    EmployeeId: "EMP001",
  },
  {
    phonenumber: "0912345678",
    email: "employee1@minimarket.com",
    password: "$2b$10$hashedPassword123",
    role: "NV",
    pointAchive: 1500.5,
    EmployeeId: "EMP002",
  },
  {
    phonenumber: "0987654321",
    email: "customer@email.com",
    password: "$2b$10$hashedPassword123",
    role: "CUSTOMER",
    pointAchive: 500,
    CustomerId: "CUST001",
  },
  {
    phonenumber: "0923456789",
    email: "employee3@minimarket.com",
    password: "$2b$10$hashedPassword123",
    role: "NV",
    pointAchive: 800,
    EmployeeId: "EMP003",
  },
  {
    phonenumber: "0934567890",
    email: "employee4@minimarket.com",
    password: "$2b$10$hashedPassword123",
    role: "NV",
    pointAchive: 650.5,
    EmployeeId: "EMP004",
  },
];

// TypeCustomer (Loại khách hàng)
export const mockTypeCustomers = [
  { id: "TYPE001", name: "Khách hàng VIP" },
  { id: "TYPE002", name: "Khách hàng thường" },
  { id: "TYPE003", name: "Khách hàng thân thiết" },
];

// Cities
export const mockCities = [
  { id: "CITY001", name: "Hà Nội" },
  { id: "CITY002", name: "Hồ Chí Minh" },
  { id: "CITY003", name: "Đà Nẵng" },
  { id: "CITY004", name: "Cần Thơ" },
];

// Districts
export const mockDistricts = [
  { id: "DIST001", name: "Quận Đống Đa", CityId: "CITY001" },
  { id: "DIST002", name: "Quận Cầu Giấy", CityId: "CITY001" },
  { id: "DIST003", name: "Quận 1", CityId: "CITY002" },
  { id: "DIST004", name: "Quận 3", CityId: "CITY002" },
  { id: "DIST005", name: "Quận Hải Châu", CityId: "CITY003" },
];

// Wards
export const mockWards = [
  { id: "WARD001", name: "Phường Láng Hạ", DistrictId: "DIST001" },
  { id: "WARD002", name: "Phường Khương Thượng", DistrictId: "DIST001" },
  { id: "WARD003", name: "Phường Nghĩa Đô", DistrictId: "DIST002" },
  { id: "WARD004", name: "Phường Bến Nghé", DistrictId: "DIST003" },
  { id: "WARD005", name: "Phường Võ Thị Sáu", DistrictId: "DIST004" },
];

// HomeAddresses
export const mockAddresses = [
  {
    id: 1,
    city: "Hà Nội",
    ward: "Phường Láng Hạ",
    street: "Đường Láng",
    homeNumber: "123",
    WardId: "WARD001",
  },
  {
    id: 2,
    city: "Hà Nội",
    ward: "Phường Nghĩa Đô",
    street: "Đường Hoàng Quốc Việt",
    homeNumber: "456",
    WardId: "WARD003",
  },
  {
    id: 3,
    city: "Hồ Chí Minh",
    ward: "Phường Bến Nghé",
    street: "Đường Nguyễn Huệ",
    homeNumber: "789",
    WardId: "WARD004",
  },
];

export const mockCategories = [
  { 
    id: "CAT001", 
    name: "Đồ uống", 
    image: "https://placehold.co/150x150/png?text=Do+Uong",
    state: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  { 
    id: "CAT002", 
    name: "Thực phẩm", 
    image: "https://placehold.co/150x150/png?text=Thuc+Pham",
    state: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  { 
    id: "CAT003", 
    name: "Gia vị", 
    image: "https://placehold.co/150x150/png?text=Gia+Vi",
    state: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  { 
    id: "CAT004", 
    name: "Vệ sinh", 
    image: "https://placehold.co/150x150/png?text=Ve+Sinh",
    state: true,
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

// SubCategories (danh mục con)
export const mockSubCategories = [
  {
    id: "SUBCAT001",
    name: "Nước ngọt",
    state: true,
    CategoryId: "CAT001",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "SUBCAT002",
    name: "Sữa",
    state: true,
    CategoryId: "CAT001",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "SUBCAT003",
    name: "Đồ ăn vặt",
    state: true,
    CategoryId: "CAT002",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "SUBCAT004",
    name: "Mì ăn liền",
    state: true,
    CategoryId: "CAT002",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "SUBCAT005",
    name: "Gạo",
    state: true,
    CategoryId: "CAT002",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  },
];

export const mockCustomers = [
  {
    id: "CUST001",
    firstName: "Nguyễn",
    lastName: "Văn A",
    phonenumber: "0987654321",
    email: "customer@email.com",
    HomeAddressId: 1,
    TypeCustomerId: "TYPE001",
  },
  {
    id: "CUST002",
    firstName: "Trần",
    lastName: "Thị B",
    phonenumber: "0901234567",
    email: "customer2@email.com",
    HomeAddressId: 2,
    TypeCustomerId: "TYPE002",
  },
  {
    id: "CUST003",
    firstName: "Lê",
    lastName: "Văn C",
    phonenumber: "0912345678",
    email: "customer3@email.com",
    HomeAddressId: 3,
    TypeCustomerId: "TYPE003",
  },
  {
    id: "CUST003",
    name: "Phạm Văn C",
    phonenumber: "0923456789",
    address: "789 Đường Láng, Đống Đa, Hà Nội",
    birthday: "1995-05-20T00:00:00.000Z",
    gender: "male",
    idCard: "001195012345",
    state: true,
    HomeAddressId: 3,
    TypeCustomerId: "TYPE002",
    createdAt: "2024-02-10T10:00:00.000Z",
    updatedAt: "2024-02-10T10:00:00.000Z",
  },
  {
    id: "CUST004",
    name: "Lê Thị D",
    phonenumber: "0934567890",
    address: "321 Nguyễn Trãi, Q.1, TP.HCM",
    birthday: "1998-08-25T00:00:00.000Z",
    gender: "female",
    idCard: "001198023456",
    state: true,
    HomeAddressId: 4,
    TypeCustomerId: "TYPE003",
    createdAt: "2024-02-15T10:00:00.000Z",
    updatedAt: "2024-02-15T10:00:00.000Z",
  },
  {
    id: "CUST005",
    name: "Hoàng Văn E",
    phonenumber: "0945678901",
    address: "555 Hai Bà Trưng, Đà Nẵng",
    birthday: "1992-12-10T00:00:00.000Z",
    gender: "male",
    idCard: "001192034567",
    state: true,
    HomeAddressId: 5,
    TypeCustomerId: "TYPE001",
    createdAt: "2024-03-01T10:00:00.000Z",
    updatedAt: "2024-03-01T10:00:00.000Z",
  },
];

// Employees (nhân viên)
export const mockEmployees = [
  {
    id: "EMP001",
    name: "Admin User",
    phonenumber: "0868283915",
    HomeAddressId: 1,
  },
  {
    id: "EMP002",
    name: "Nguyễn Văn D",
    phonenumber: "0912345678",
    HomeAddressId: 2,
  },
  {
    id: "EMP003",
    name: "Trần Thị E",
    phonenumber: "0923456789",
    HomeAddressId: null,
  },
  {
    id: "EMP003",
    name: "Vũ Văn C",
    phonenumber: "0923456789",
    birthday: "1994-06-20T00:00:00.000Z",
    startDate: "2023-06-01T00:00:00.000Z",
    sex: "Nam",
    HomeAddressId: 3,
    idCard: "034194005678",
  },
  {
    id: "EMP004",
    name: "Đặng Thị D",
    phonenumber: "0934567890",
    birthday: "1997-09-10T00:00:00.000Z",
    startDate: "2023-09-01T00:00:00.000Z",
    sex: "Nữ",
    HomeAddressId: 4,
    idCard: "034197006789",
  },
];

export const mockInventory = [
  {
    id: 1,
    productId: "COCA001",
    productName: "Coca Cola",
    quantity: 100,
    minStock: 20,
    lastRestocked: MOCK_DATE,
    ProductUnitType: {
      id: 1,
      ProductId: "COCA001",
      UnitTypeId: 1,
      Product: {
        id: "COCA001",
        name: "Coca Cola",
      },
      UnitType: {
        id: 1,
        name: "Cái",
        convertionQuantity: 1,
      },
    },
  },
  {
    id: 2,
    productId: "BREAD001",
    productName: "Bánh mì",
    quantity: 50,
    minStock: 10,
    lastRestocked: MOCK_DATE,
    ProductUnitType: {
      id: 4,
      ProductId: "BREAD001",
      UnitTypeId: 1,
      Product: {
        id: "BREAD001",
        name: "Bánh mì",
      },
      UnitType: {
        id: 1,
        name: "Cái",
        convertionQuantity: 1,
      },
    },
  },
  {
    id: 3,
    productId: "MILK001",
    productName: "Sữa tươi Vinamilk",
    quantity: 75,
    minStock: 15,
    lastRestocked: MOCK_DATE,
    ProductUnitType: {
      id: 5,
      ProductId: "MILK001",
      UnitTypeId: 4,
      Product: {
        id: "MILK001",
        name: "Sữa tươi Vinamilk",
      },
      UnitType: {
        id: 4,
        name: "Hộp",
        convertionQuantity: 1,
      },
    },
  },
  {
    id: 4,
    productId: "PEPSI001",
    productName: "Pepsi Cola",
    quantity: 180,
    minStock: 30,
    lastRestocked: MOCK_DATE,
    ProductUnitType: {
      id: 19,
      ProductId: "PEPSI001",
      UnitTypeId: 1,
      Product: {
        id: "PEPSI001",
        name: "Pepsi Cola",
      },
      UnitType: {
        id: 1,
        name: "Cái",
        convertionQuantity: 1,
      },
    },
  },
  {
    id: 5,
    productId: "WATER001",
    productName: "Nước suối Lavie",
    quantity: 500,
    minStock: 50,
    lastRestocked: MOCK_DATE,
    ProductUnitType: {
      id: 24,
      ProductId: "WATER001",
      UnitTypeId: 1,
      Product: {
        id: "WATER001",
        name: "Nước suối Lavie",
      },
      UnitType: {
        id: 1,
        name: "Cái",
        convertionQuantity: 1,
      },
    },
  },
  {
    id: 6,
    productId: "SNACK001",
    productName: "Snack Oishi",
    quantity: 250,
    minStock: 30,
    lastRestocked: MOCK_DATE,
    ProductUnitType: {
      id: 22,
      ProductId: "SNACK001",
      UnitTypeId: 1,
      Product: {
        id: "SNACK001",
        name: "Snack Oishi",
      },
      UnitType: {
        id: 1,
        name: "Cái",
        convertionQuantity: 1,
      },
    },
  },
  {
    id: 7,
    productId: "INSTANT001",
    productName: "Mì gói Hảo Hảo",
    quantity: 400,
    minStock: 50,
    lastRestocked: MOCK_DATE,
    ProductUnitType: {
      id: 27,
      ProductId: "INSTANT001",
      UnitTypeId: 1,
      Product: {
        id: "INSTANT001",
        name: "Mì gói Hảo Hảo",
      },
      UnitType: {
        id: 1,
        name: "Cái",
        convertionQuantity: 1,
      },
    },
  },
  {
    id: 8,
    productId: "RICE001",
    productName: "Gạo ST25",
    quantity: 80,
    minStock: 10,
    lastRestocked: MOCK_DATE,
    ProductUnitType: {
      id: 29,
      ProductId: "RICE001",
      UnitTypeId: 5,
      Product: {
        id: "RICE001",
        name: "Gạo ST25",
      },
      UnitType: {
        id: 5,
        name: "Kg",
        convertionQuantity: 5,
      },
    },
  },
];

export const mockSales = [
  {
    id: 1,
    date: MOCK_DATE,
    total: 150000,
    profit: 30000,
    itemsSold: 10,
  },
  {
    id: 2,
    date: MOCK_DATE_YESTERDAY,
    total: 200000,
    profit: 40000,
    itemsSold: 15,
  },
];

export const mockStaff = [
  {
    id: 1,
    name: "Nguyễn Văn C",
    role: "cashier",
    email: "staff1@minimarket.com",
    phone: "0901111111",
    status: "active",
  },
  {
    id: 2,
    name: "Trần Thị D",
    role: "manager",
    email: "staff2@minimarket.com",
    phone: "0902222222",
    status: "active",
  },
];

// ListPricesHeader (Bảng giá)
export const mockListPricesHeaders = [
  {
    id: "PRICE_HEADER_001",
    title: "Bảng giá tháng 11/2024",
    startDate: new Date("2024-11-01T00:00:00.000Z"),
    endDate: new Date("2024-11-30T23:59:59.000Z"),
    state: true,
    createdAt: "2024-11-01T00:00:00.000Z",
    updatedAt: "2024-11-01T00:00:00.000Z",
  },
  {
    id: "PRICE_HEADER_002",
    title: "Bảng giá khuyến mãi cuối năm",
    startDate: new Date("2024-12-01T00:00:00.000Z"),
    endDate: new Date("2024-12-31T23:59:59.000Z"),
    state: false,
    createdAt: "2024-11-15T00:00:00.000Z",
    updatedAt: "2024-11-15T00:00:00.000Z",
  },
  {
    id: "PRICE_HEADER_003",
    title: "Bảng giá tháng 12/2024",
    startDate: new Date("2024-12-01T00:00:00.000Z"),
    endDate: new Date("2024-12-31T23:59:59.000Z"),
    state: true,
    createdAt: "2024-12-01T00:00:00.000Z",
    updatedAt: "2024-12-01T00:00:00.000Z",
  },
  {
    id: "PRICE_HEADER_004",
    title: "Bảng giá khuyến mãi Noel",
    startDate: new Date("2024-12-20T00:00:00.000Z"),
    endDate: new Date("2024-12-26T23:59:59.000Z"),
    state: true,
    createdAt: "2024-12-10T00:00:00.000Z",
    updatedAt: "2024-12-10T00:00:00.000Z",
  },
];

// Prices (Giá bán theo đơn vị)
export const mockPrices = [
  {
    id: 1,
    price: 15000,
    ListPricesHeaderId: "PRICE_HEADER_001",
    ProductUnitTypeId: 1,
    createdAt: "2024-11-01T00:00:00.000Z",
    updatedAt: "2024-11-01T00:00:00.000Z",
  },
  {
    id: 2,
    price: 90000,
    ListPricesHeaderId: "PRICE_HEADER_001",
    ProductUnitTypeId: 2,
    createdAt: "2024-11-01T00:00:00.000Z",
    updatedAt: "2024-11-01T00:00:00.000Z",
  },
  {
    id: 3,
    price: 350000,
    ListPricesHeaderId: "PRICE_HEADER_001",
    ProductUnitTypeId: 3,
    createdAt: "2024-11-01T00:00:00.000Z",
    updatedAt: "2024-11-01T00:00:00.000Z",
  },
  {
    id: 4,
    price: 12000,
    ListPricesHeaderId: "PRICE_HEADER_001",
    ProductUnitTypeId: 4,
    createdAt: "2024-11-01T00:00:00.000Z",
    updatedAt: "2024-11-01T00:00:00.000Z",
  },
  {
    id: 5,
    price: 35000,
    ListPricesHeaderId: "PRICE_HEADER_001",
    ProductUnitTypeId: 5,
    createdAt: "2024-11-01T00:00:00.000Z",
    updatedAt: "2024-11-01T00:00:00.000Z",
  },
  // Prices for new headers / additional products
  {
    id: 6,
    price: 20000,
    ListPricesHeaderId: "PRICE_HEADER_003",
    ProductUnitTypeId: 100,
    createdAt: "2024-12-01T00:00:00.000Z",
    updatedAt: "2024-12-01T00:00:00.000Z",
  },
  {
    id: 7,
    price: 30000,
    ListPricesHeaderId: "PRICE_HEADER_003",
    ProductUnitTypeId: 101,
    createdAt: "2024-12-01T00:00:00.000Z",
    updatedAt: "2024-12-01T00:00:00.000Z",
  },
  {
    id: 8,
    price: 28000,
    ListPricesHeaderId: "PRICE_HEADER_004",
    ProductUnitTypeId: 101,
    createdAt: "2024-12-20T00:00:00.000Z",
    updatedAt: "2024-12-20T00:00:00.000Z",
  },
  {
    id: 9,
    price: 14000,
    ListPricesHeaderId: "PRICE_HEADER_004",
    ProductUnitTypeId: 1,
    createdAt: "2024-12-20T00:00:00.000Z",
    updatedAt: "2024-12-20T00:00:00.000Z",
  },
  {
    id: 10,
    price: 320000,
    ListPricesHeaderId: "PRICE_HEADER_003",
    ProductUnitTypeId: 3,
    createdAt: "2024-12-01T00:00:00.000Z",
    updatedAt: "2024-12-01T00:00:00.000Z",
  },
  {
    id: 11,
    price: 18000,
    ListPricesHeaderId: "PRICE_HEADER_003",
    ProductUnitTypeId: 24,
    createdAt: "2024-12-01T00:00:00.000Z",
    updatedAt: "2024-12-01T00:00:00.000Z",
  },
  {
    id: 12,
    price: 25000,
    ListPricesHeaderId: "PRICE_HEADER_004",
    ProductUnitTypeId: 24,
    createdAt: "2024-12-20T00:00:00.000Z",
    updatedAt: "2024-12-20T00:00:00.000Z",
  },
];

// PromotionHeaders (Chương trình khuyến mãi)
export const mockPromotionHeaders = [
  {
    id: "PROMO001",
    title: "Khuyến mãi Tết 2025",
    startDate: new Date("2025-01-20T00:00:00.000Z"),
    endDate: new Date("2025-02-10T23:59:59.000Z"),
    description: "Giảm giá đặc biệt dịp Tết Nguyên Đán",
    state: true,
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "PROMO002",
    title: "Khuyến mãi cuối tuần",
    startDate: new Date("2024-11-01T00:00:00.000Z"),
    endDate: new Date("2024-11-30T23:59:59.000Z"),
    description: "Giảm giá mỗi cuối tuần",
    state: true,
    createdAt: "2024-11-01T00:00:00.000Z",
    updatedAt: "2024-11-01T00:00:00.000Z",
  },
];

// ProductPromotions (Khuyến mãi theo sản phẩm - mua X tặng Y)
export const mockProductPromotions = [
  {
    id: "PROD_PROMO001",
    title: "Mua 2 tặng 1 Coca Cola",
    description: "Mua 2 lon Coca tặng 1 lon",
    startDate: new Date("2025-01-20T00:00:00.000Z"),
    endDate: new Date("2025-02-10T23:59:59.000Z"),
    minQuantity: 2,
    state: true,
    PromotionHeaderId: "PROMO001",
    ProductUnitTypeId: 1,
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
];

// GiftProducts (Quà tặng kèm)
export const mockGiftProducts = [
  {
    id: "GIFT001",
    quantity: 1,
    ProductPromotionId: "PROD_PROMO001",
    ProductUnitTypeId: 1,
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
];

// MoneyPromotions (Khuyến mãi theo tổng tiền)
export const mockMoneyPromotions = [
  {
    id: "MONEY_PROMO001",
    title: "Giảm 50K cho đơn từ 500K",
    description: "Giảm 50.000đ cho đơn hàng từ 500.000đ",
    startDate: new Date("2024-11-01T00:00:00.000Z"),
    endDate: new Date("2024-11-30T23:59:59.000Z"),
    minCost: 500000,
    state: true,
    type: "money",
    discountMoney: 50000,
    discountRate: null,
    maxMoneyDiscount: 50000,
    budget: 10000000,
    availableBudget: 9950000,
    PromotionHeaderId: "PROMO002",
    createdAt: "2024-11-01T00:00:00.000Z",
    updatedAt: "2024-11-01T00:00:00.000Z",
  },
  {
    id: "MONEY_PROMO002",
    title: "Giảm 10% cho đơn từ 300K",
    description: "Giảm 10% tối đa 100K cho đơn hàng từ 300.000đ",
    startDate: new Date("2024-11-01T00:00:00.000Z"),
    endDate: new Date("2024-11-30T23:59:59.000Z"),
    minCost: 300000,
    state: true,
    type: "rate",
    discountMoney: null,
    discountRate: 0.1,
    maxMoneyDiscount: 100000,
    budget: 5000000,
    availableBudget: 4900000,
    PromotionHeaderId: "PROMO002",
    createdAt: "2024-11-01T00:00:00.000Z",
    updatedAt: "2024-11-01T00:00:00.000Z",
  },
];

// DiscountRateProducts (Giảm giá % theo sản phẩm)
export const mockDiscountRateProducts = [
  {
    id: "DISC_RATE001",
    title: "Giảm 20% Coca Cola",
    description: "Giảm giá 20% cho sản phẩm Coca Cola",
    startDate: new Date("2025-01-20T00:00:00.000Z"),
    endDate: new Date("2025-02-10T23:59:59.000Z"),
    discountRate: 0.2,
    state: true,
    PromotionHeaderId: "PROMO001",
    ProductUnitTypeId: 1,
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
];

// Vouchers (Mã giảm giá)
export const mockVouchers = [
  {
    id: "VOUCH001",
    code: "TET2025",
    startDate: new Date("2025-01-20T00:00:00.000Z"),
    title: "Voucher Tết 100K",
    description: "Giảm 100K cho đơn hàng",
    endDate: new Date("2025-02-10T23:59:59.000Z"),
    state: true,
    type: "money",
    discountMoney: 100000,
    discountRate: 0,
    maxDiscountMoney: 100000,
    isUsed: false,
    groupVoucher: "TET2025_GROUP",
    PromotionHeaderId: "PROMO001",
    createdAt: "2025-01-15T00:00:00.000Z",
    updatedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    id: "VOUCH002",
    code: "WEEKEND20",
    startDate: new Date("2024-11-01T00:00:00.000Z"),
    title: "Giảm 20% cuối tuần",
    description: "Giảm 20% tối đa 50K cho đơn hàng cuối tuần",
    endDate: new Date("2024-11-30T23:59:59.000Z"),
    state: true,
    type: "rate",
    discountMoney: 0,
    discountRate: 0.2,
    maxDiscountMoney: 50000,
    isUsed: false,
    groupVoucher: "WEEKEND_GROUP",
    PromotionHeaderId: "PROMO002",
    createdAt: "2024-11-01T00:00:00.000Z",
    updatedAt: "2024-11-01T00:00:00.000Z",
  },
];

// PromotionResults (Kết quả áp dụng khuyến mãi)
export const mockPromotionResults = [
  {
    id: "PRes1730900000000",
    isSuccess: true,
    note: "Áp dụng voucher thành công",
    quantityApplied: 1,
    discountMoneyByVoucher: 100000,
    discountMoneyByMoneyPromotion: 0,
    BillId: "1",
    VoucherId: null,
    MoneyPromotionId: null,
    ProductPromotionId: null,
    DiscountRateProductId: null,
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
  },
];

// Additional mock data (mở rộng để hỗ trợ nhiều test case hơn)
export const mockStores = [
  {
    id: "STORE001",
    name: "Mini Market - Láng Hạ",
    phone: "02412345678",
    address: "123 Đường Láng, Hà Nội",
    state: true,
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
  },
  {
    id: "STORE002",
    name: "Mini Market - Nguyễn Huệ",
    phone: "02812345678",
    address: "12 Nguyễn Huệ, Quận 1, TP.HCM",
    state: true,
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
  },
];

export const mockAdditionalProducts = [
  {
    id: "YOGURT001",
    name: "Sữa chua Vinamilk",
    barcode: "8937000000001",
    images: [{ uri: "https://placehold.co/150x150/png?text=Yogurt" }],
    description: "Sữa chua hộp 100g",
    quantity: 120,
    state: true,
    SubCategoryId: "SUBCAT002",
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
    Category: { id: "CAT001", name: "Đồ uống" },
    SubCategory: { id: "SUBCAT002", name: "Sữa", Category: { id: "CAT001", name: "Đồ uống" } },
    ProductUnitTypes: [
      {
        id: 100,
        ProductId: "YOGURT001",
        UnitTypeId: 1,
        barcode: "8937000000001",
        UnitType: { id: 1, name: "Cái", convertionQuantity: 1 },
      },
    ],
  },
  {
    id: "CHIPS001",
    name: "Snack BigBag",
    barcode: "8937000000002",
    images: [{ uri: "https://placehold.co/150x150/png?text=Chips" }],
    description: "Snack vị phô mai gói lớn 200g",
    quantity: 60,
    state: true,
    SubCategoryId: "SUBCAT003",
    createdAt: MOCK_DATE,
    updatedAt: MOCK_DATE,
    Category: { id: "CAT002", name: "Thực phẩm" },
    SubCategory: { id: "SUBCAT003", name: "Đồ ăn vặt", Category: { id: "CAT002", name: "Thực phẩm" } },
    ProductUnitTypes: [
      {
        id: 101,
        ProductId: "CHIPS001",
        UnitTypeId: 1,
        barcode: "8937000000002",
        UnitType: { id: 1, name: "Cái", convertionQuantity: 1 },
      },
      {
        id: 102,
        ProductId: "CHIPS001",
        UnitTypeId: 4,
        barcode: "8937000000003",
        UnitType: { id: 4, name: "Hộp", convertionQuantity: 10 },
      },
    ],
  },
];

export const mockAdditionalOrders = [
  {
    id: 10,
    orderDate: MOCK_DATE,
    total: 75000,
    status: "completed",
    customerId: "CUST001",
    EmployeeId: "EMP002",
    Employee: { id: "EMP002", name: "Nguyễn Văn D", phonenumber: "0912345678" },
    BillDetails: [
      {
        id: 101,
        BillId: 10,
        quantity: 3,
        price: 15000,
        Price: {
          id: 101,
          price: 15000,
          ProductUnitTypeId: 1,
          ProductUnitType: { id: 1, ProductId: "COCA001", UnitTypeId: 1 },
        },
      },
      {
        id: 102,
        BillId: 10,
        quantity: 1,
        price: 20000,
        Price: {
          id: 102,
          price: 20000,
          ProductUnitTypeId: 100,
          ProductUnitType: { id: 100, ProductId: "YOGURT001", UnitTypeId: 1 },
        },
      },
    ],
    items: [
      { productId: "COCA001", productName: "Coca Cola", quantity: 3, price: 15000 },
      { productId: "YOGURT001", productName: "Sữa chua Vinamilk", quantity: 1, price: 20000 },
    ],
  },
  {
    id: 11,
    orderDate: MOCK_DATE_YESTERDAY,
    total: 90000,
    status: "completed",
    customerId: "CUST004",
    EmployeeId: "EMP004",
    Employee: { id: "EMP004", name: "Đặng Thị D", phonenumber: "0934567890" },
    BillDetails: [
      {
        id: 111,
        BillId: 11,
        quantity: 2,
        price: 30000,
        Price: {
          id: 111,
          price: 30000,
          ProductUnitTypeId: 101,
          ProductUnitType: { id: 101, ProductId: "CHIPS001", UnitTypeId: 1 },
        },
      },
      {
        id: 112,
        BillId: 11,
        quantity: 1,
        price: 30000,
        Price: {
          id: 112,
          price: 30000,
          ProductUnitTypeId: 24,
          ProductUnitType: { id: 24, ProductId: "WATER001", UnitTypeId: 1 },
        },
      },
    ],
    items: [
      { productId: "CHIPS001", productName: "Snack BigBag", quantity: 2, price: 30000 },
      { productId: "WATER001", productName: "Nước suối Lavie", quantity: 1, price: 30000 },
    ],
  },
];

export const mockAdditionalInventory = [
  {
    id: 9,
    productId: "YOGURT001",
    productName: "Sữa chua Vinamilk",
    quantity: 120,
    minStock: 20,
    lastRestocked: MOCK_DATE,
    ProductUnitType: { id: 100, ProductId: "YOGURT001", UnitTypeId: 1, Product: { id: "YOGURT001", name: "Sữa chua Vinamilk" }, UnitType: { id: 1, name: "Cái", convertionQuantity: 1 } },
  },
  {
    id: 10,
    productId: "CHIPS001",
    productName: "Snack BigBag",
    quantity: 60,
    minStock: 10,
    lastRestocked: MOCK_DATE,
    ProductUnitType: { id: 101, ProductId: "CHIPS001", UnitTypeId: 1, Product: { id: "CHIPS001", name: "Snack BigBag" }, UnitType: { id: 1, name: "Cái", convertionQuantity: 1 } },
  },
];

export const mockAdditionalAccounts = [
  {
    phonenumber: "0955550001",
    email: "store1@minimarket.com",
    password: "$2b$10$anotherHashedPw",
    role: "STORE",
    pointAchive: 0,
    StoreId: "STORE001",
  },
  {
    phonenumber: "0955550002",
    email: "customer6@minimarket.com",
    password: "$2b$10$anotherHashedPw",
    role: "CUSTOMER",
    pointAchive: 120,
    CustomerId: "CUST005",
  },
];
