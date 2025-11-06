# API Documentation - Mini Market Server

## Overview

Tài liệu API và Data Models cho Mini Market Server. Document này được sử dụng để tạo mock data và mock API cho front-end development.

---

## Table of Contents

1. [Data Models](#data-models)
2. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-apis)
   - [Products](#product-apis)
   - [Categories](#category-apis)
   - [Customers](#customer-apis)
   - [Bills](#bill-apis)
   - [Employees](#employee-apis)
   - [Promotions](#promotion-apis)
   - [Vouchers](#voucher-apis)
   - [Locations](#location-apis)
   - [Prices](#price-apis)

---

## Data Models

### Account

```typescript
{
  phonenumber: string;        // Primary key, unique
  email: string | null;
  password: string;           // Hashed
  role: string;              // Default: "NV"
  pointAchive: number | null;

  // Relationships
  CustomerId?: string;
  EmployeeId?: string;
  Roles?: Role[];
}
```

**Mock Example:**

```json
{
  "phonenumber": "0123456789",
  "email": "employee@minimarket.com",
  "password": "$2b$10$...",
  "role": "NV",
  "pointAchive": 1500.5,
  "EmployeeId": "EMP001"
}
```

---

### Customer

```typescript
{
  id: string;                 // Primary key
  firstName: string | null;
  lastName: string | null;
  phonenumber: string;        // Unique, required
  email: string | null;

  // Relationships
  HomeAddressId?: number;
  TypeCustomerId?: string;
  Bills?: Bill[];
  Account?: Account;
}
```

**Mock Example:**

```json
{
  "id": "CUST001",
  "firstName": "Nguyen",
  "lastName": "Van A",
  "phonenumber": "0987654321",
  "email": "customer@email.com",
  "HomeAddressId": 1,
  "TypeCustomerId": "TYPE001"
}
```

---

### Employee

```typescript
{
  id: string;                 // Primary key
  name: string | null;
  phonenumber: string;        // Required

  // Relationships
  HomeAddressId?: number;
  Bills?: Bill[];
  Account?: Account;
  StoreTransactions?: StoreTransaction[];
  WareHouseTickets?: WareHouseTicket[];
  Inputs?: Input[];
}
```

**Mock Example:**

```json
{
  "id": "EMP001",
  "name": "Tran Thi B",
  "phonenumber": "0912345678",
  "HomeAddressId": 2
}
```

---

### Product

```typescript
{
  id: string;                 // Primary key
  barcode: string | null;
  name: string;              // Required
  description: string | null;
  quantity: number;          // Default: 0
  state: boolean;            // Default: true
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  SubCategoryId?: string;
  Images?: Image[];
  UnitTypes?: UnitType[];    // Many-to-many
  ProductUnitTypes?: ProductUnitType[];
}
```

**Mock Example:**

```json
{
  "id": "PROD001",
  "barcode": "8934567890123",
  "name": "Coca Cola 330ml",
  "description": "Nước ngọt có gas",
  "quantity": 100,
  "state": true,
  "SubCategoryId": "SUBCAT001",
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

---

### Category

```typescript
{
  id: string;                 // Primary key
  name: string;              // Required
  image: string | null;
  state: boolean | null;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  SubCategories?: SubCategory[];
}
```

**Mock Example:**

```json
{
  "id": "CAT001",
  "name": "Đồ uống",
  "image": "https://example.com/images/drinks.jpg",
  "state": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### SubCategory

```typescript
{
  id: string;                 // Primary key
  name: string;              // Required
  state: boolean | null;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  CategoryId?: string;
  Products?: Product[];
}
```

**Mock Example:**

```json
{
  "id": "SUBCAT001",
  "name": "Nước ngọt",
  "state": true,
  "CategoryId": "CAT001",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Bill

```typescript
{
  id: string;                 // Primary key (UUID)
  orderDate: Date;           // Default: NOW
  isDDH: boolean;            // Default: false
  cost: number | null;
  type: string | null;       // Example: "success", "pending", "cancel"

  // Relationships
  CustomerId?: string;
  EmployeeId?: string;
  BillDetails?: BillDetail[];
  PromotionResults?: PromotionResult[];
  RetrieveBill?: RetrieveBill;
}
```

**Mock Example:**

```json
{
  "id": "Bill1705123456789",
  "orderDate": "2024-01-15T14:30:00.000Z",
  "isDDH": false,
  "cost": 250000,
  "type": "success",
  "CustomerId": "CUST001",
  "EmployeeId": "EMP001"
}
```

---

### BillDetail

```typescript
{
  id: number;                 // Primary key, auto-increment
  quantity: number;          // Default: 1

  // Relationships
  BillId?: string;
  PriceId?: number;
}
```

**Mock Example:**

```json
{
  "id": 1,
  "quantity": 2,
  "BillId": "Bill1705123456789",
  "PriceId": 100
}
```

---

### UnitType

```typescript
{
  id: string;                 // Primary key
  name: string;              // Required
  convertionQuantity: number; // Required
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  Products?: Product[];       // Many-to-many
  ProductUnitTypes?: ProductUnitType[];
}
```

**Mock Example:**

```json
{
  "id": "UNIT001",
  "name": "Lon",
  "convertionQuantity": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### ProductUnitType

```typescript
{
  id: number;                 // Primary key, auto-increment

  // Relationships
  ProductId?: string;
  UnitTypeId?: string;
  Prices?: Price[];
  GiftProduct?: GiftProduct;
  ProductPromotions?: ProductPromotion[];
  DiscountRateProduct?: DiscountRateProduct;
  InputDetails?: InputDetail[];
  TicketDetails?: TicketDetail[];
  StoreTransactions?: StoreTransaction[];
}
```

**Mock Example:**

```json
{
  "id": 1,
  "ProductId": "PROD001",
  "UnitTypeId": "UNIT001"
}
```

---

### Price

```typescript
{
  id: number;                 // Primary key, auto-increment
  price: number;             // Required
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  ListPricesHeaderId?: string;
  ProductUnitTypeId?: number;
  BillDetail?: BillDetail;
}
```

**Mock Example:**

```json
{
  "id": 100,
  "price": 12000,
  "ListPricesHeaderId": "PRICE_HEADER_001",
  "ProductUnitTypeId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### ListPricesHeader

```typescript
{
  id: string;                 // Primary key
  title: string | null;
  startDate: Date;           // Default: NOW
  endDate: Date;             // Required
  state: boolean | null;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  Prices?: Price[];
}
```

**Mock Example:**

```json
{
  "id": "PRICE_HEADER_001",
  "title": "Bảng giá tháng 1/2024",
  "startDate": "2024-01-01T00:00:00.000Z",
  "endDate": "2024-01-31T23:59:59.000Z",
  "state": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

---

### Image

```typescript
{
  id: number;                 // Primary key, auto-increment
  uri: string | null;

  // Relationships
  ProductId?: string;
}
```

**Mock Example:**

```json
{
  "id": 1,
  "uri": "https://example.com/images/cocacola.jpg",
  "ProductId": "PROD001"
}
```

---

### PromotionHeader

```typescript
{
  id: string;                 // Primary key
  title: string;             // Required
  startDate: Date;           // Default: NOW
  endDate: Date;             // Required
  description: string | null;
  state: boolean | null;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  ProductPromotions?: ProductPromotion[];
  MoneyPromotions?: MoneyPromotion[];
  Vouchers?: Voucher[];
  DiscountRateProducts?: DiscountRateProduct[];
  TypeCustomers?: TypeCustomer[];  // Many-to-many
}
```

**Mock Example:**

```json
{
  "id": "PROMO001",
  "title": "Khuyến mãi Tết 2024",
  "startDate": "2024-01-20T00:00:00.000Z",
  "endDate": "2024-02-10T23:59:59.000Z",
  "description": "Giảm giá đặc biệt dịp Tết",
  "state": true,
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

---

### ProductPromotion

```typescript
{
  id: string;                 // Primary key
  title: string | null;
  description: string | null;
  startDate: Date;           // Default: NOW
  endDate: Date;             // Required
  minQuantity: number;       // Required
  state: boolean | null;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  PromotionHeaderId?: string;
  ProductUnitTypeId?: number;
  GiftProduct?: GiftProduct;
  PromotionResults?: PromotionResult[];
}
```

**Mock Example:**

```json
{
  "id": "PROD_PROMO001",
  "title": "Mua 2 tặng 1",
  "description": "Mua 2 lon Coca tặng 1 lon",
  "startDate": "2024-01-20T00:00:00.000Z",
  "endDate": "2024-02-10T23:59:59.000Z",
  "minQuantity": 2,
  "state": true,
  "PromotionHeaderId": "PROMO001",
  "ProductUnitTypeId": 1,
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

---

### MoneyPromotion

```typescript
{
  id: string;                 // Primary key
  title: string | null;
  description: string | null;
  startDate: Date;           // Default: NOW
  endDate: Date;             // Required
  minCost: number;           // Required
  state: boolean | null;
  type: string | null;       // "money" or "rate"
  discountMoney: number | null;
  discountRate: number | null;
  maxMoneyDiscount: number | null;
  budget: number | null;
  availableBudget: number | null;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  PromotionHeaderId?: string;
  PromotionResults?: PromotionResult[];
}
```

**Mock Example:**

```json
{
  "id": "MONEY_PROMO001",
  "title": "Giảm 50K cho đơn từ 500K",
  "description": "Giảm 50.000đ cho đơn hàng từ 500.000đ",
  "startDate": "2024-01-20T00:00:00.000Z",
  "endDate": "2024-02-10T23:59:59.000Z",
  "minCost": 500000,
  "state": true,
  "type": "money",
  "discountMoney": 50000,
  "discountRate": null,
  "maxMoneyDiscount": 50000,
  "budget": 10000000,
  "availableBudget": 9950000,
  "PromotionHeaderId": "PROMO001",
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

---

### DiscountRateProduct

```typescript
{
  id: string;                 // Primary key
  title: string | null;
  description: string | null;
  startDate: Date;           // Default: NOW
  endDate: Date;             // Required
  discountRate: number;      // Required (0-1)
  state: boolean | null;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  PromotionHeaderId?: string;
  ProductUnitTypeId?: number;
  PromotionResults?: PromotionResult[];
}
```

**Mock Example:**

```json
{
  "id": "DISC_RATE001",
  "title": "Giảm 20% Coca Cola",
  "description": "Giảm giá 20% cho sản phẩm Coca Cola",
  "startDate": "2024-01-20T00:00:00.000Z",
  "endDate": "2024-02-10T23:59:59.000Z",
  "discountRate": 0.2,
  "state": true,
  "PromotionHeaderId": "PROMO001",
  "ProductUnitTypeId": 1,
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

---

### GiftProduct

```typescript
{
  id: string;                 // Primary key
  quantity: number | null;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  ProductPromotionId?: string;
  ProductUnitTypeId?: number;
}
```

**Mock Example:**

```json
{
  "id": "GIFT001",
  "quantity": 1,
  "ProductPromotionId": "PROD_PROMO001",
  "ProductUnitTypeId": 1,
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

---

### Voucher

```typescript
{
  id: string;                 // Primary key
  code: string;              // Required
  startDate: Date;           // Required
  title: string;             // Required
  description: string | null;
  endDate: Date;             // Required
  state: boolean | null;
  type: string | null;       // "money" or "rate"
  discountMoney: number;     // Default: 0
  discountRate: number;      // Default: 0
  maxDiscountMoney: number;  // Default: 0
  isUsed: boolean;           // Default: false
  groupVoucher: string;      // Required
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  PromotionHeaderId?: string;
  PromotionResult?: PromotionResult;
}
```

**Mock Example:**

```json
{
  "id": "VOUCH001",
  "code": "TET2024",
  "startDate": "2024-01-20T00:00:00.000Z",
  "title": "Voucher Tết 100K",
  "description": "Giảm 100K cho đơn hàng",
  "endDate": "2024-02-10T23:59:59.000Z",
  "state": true,
  "type": "money",
  "discountMoney": 100000,
  "discountRate": 0,
  "maxDiscountMoney": 100000,
  "isUsed": false,
  "groupVoucher": "TET2024_GROUP",
  "PromotionHeaderId": "PROMO001",
  "createdAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

---

### PromotionResult

```typescript
{
  id: string;                 // Primary key (auto-generated: "PRes" + timestamp)
  isSuccess: boolean;        // Required
  note: string | null;
  quantityApplied: number;   // Default: 1
  discountMoneyByVoucher: number;           // Default: 0
  discountMoneyByMoneyPromotion: number;    // Default: 0
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  BillId?: string;
  ProductPromotionId?: string;
  MoneyPromotionId?: string;
  DiscountRateProductId?: string;
  VoucherId?: string;
}
```

**Mock Example:**

```json
{
  "id": "PRes1705123456789",
  "isSuccess": true,
  "note": "Áp dụng khuyến mãi thành công",
  "quantityApplied": 1,
  "discountMoneyByVoucher": 100000,
  "discountMoneyByMoneyPromotion": 50000,
  "BillId": "Bill1705123456789",
  "VoucherId": "VOUCH001",
  "MoneyPromotionId": "MONEY_PROMO001",
  "createdAt": "2024-01-15T14:30:00.000Z",
  "updatedAt": "2024-01-15T14:30:00.000Z"
}
```

---

### TypeCustomer

```typescript
{
  id: string;                 // Primary key
  name: string;              // Required

  // Relationships
  Customers?: Customer[];
  PromotionHeaders?: PromotionHeader[];  // Many-to-many
}
```

**Mock Example:**

```json
{
  "id": "TYPE001",
  "name": "Khách hàng VIP"
}
```

---

### Address / HomeAddress

```typescript
{
  id: number;                 // Primary key, auto-increment
  city: string | null;
  ward: string | null;
  street: string | null;
  homeNumber: string;        // Required

  // Relationships
  WardId?: string;
  Customer?: Customer;
  Employee?: Employee;
}
```

**Mock Example:**

```json
{
  "id": 1,
  "city": "Hà Nội",
  "ward": "Phường Láng Hạ",
  "street": "Đường Láng",
  "homeNumber": "123",
  "WardId": "WARD001"
}
```

---

### City

```typescript
{
  id: string;                 // Primary key
  name: string;              // Required

  // Relationships
  Districts?: District[];
}
```

**Mock Example:**

```json
{
  "id": "CITY001",
  "name": "Hà Nội"
}
```

---

### District

```typescript
{
  id: string;                 // Primary key
  name: string;              // Required

  // Relationships
  CityId?: string;
  Wards?: Ward[];
}
```

**Mock Example:**

```json
{
  "id": "DIST001",
  "name": "Quận Đống Đa",
  "CityId": "CITY001"
}
```

---

### Ward

```typescript
{
  id: string;                 // Primary key
  name: string;              // Required

  // Relationships
  DistrictId?: string;
  HomeAddresses?: HomeAddress[];
}
```

**Mock Example:**

```json
{
  "id": "WARD001",
  "name": "Phường Láng Hạ",
  "DistrictId": "DIST001"
}
```

---

### RetrieveBill

```typescript
{
  id: string;                 // Primary key (auto-generated: "retri" + timestamp)
  createAt: Date;            // Default: NOW
  note: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  BillId?: string;
}
```

**Mock Example:**

```json
{
  "id": "retri1705123456789",
  "createAt": "2024-01-15T15:00:00.000Z",
  "note": "Khách hàng trả hàng do sản phẩm lỗi",
  "BillId": "Bill1705123456789",
  "createdAt": "2024-01-15T15:00:00.000Z",
  "updatedAt": "2024-01-15T15:00:00.000Z"
}
```

---

### Input

```typescript
{
  id: string;                 // Primary key
  createAt: Date;            // Default: NOW
  note: string | null;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  EmployeeId?: string;
  InputDetails?: InputDetail[];
}
```

**Mock Example:**

```json
{
  "id": "INPUT001",
  "createAt": "2024-01-15T08:00:00.000Z",
  "note": "Nhập hàng từ nhà cung cấp A",
  "EmployeeId": "EMP001",
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-01-15T08:00:00.000Z"
}
```

---

### InputDetail

```typescript
{
  id: number;                 // Primary key, auto-increment
  quantity: number | null;
  price: number | null;

  // Relationships
  InputId?: string;
  ProductUnitTypeId?: number;
}
```

**Mock Example:**

```json
{
  "id": 1,
  "quantity": 100,
  "price": 10000,
  "InputId": "INPUT001",
  "ProductUnitTypeId": 1
}
```

---

### WareHouseTicket

```typescript
{
  id: string;                 // Primary key
  createAt: Date | null;
  note: string | null;

  // Relationships
  EmployeeId?: string;
  TicketDetails?: TicketDetail[];
}
```

**Mock Example:**

```json
{
  "id": "TICKET001",
  "createAt": "2024-01-15T09:00:00.000Z",
  "note": "Xuất kho cho chi nhánh 1",
  "EmployeeId": "EMP001"
}
```

---

### TicketDetail

```typescript
{
  id: number;                 // Primary key, auto-increment
  quantity: number | null;

  // Relationships
  WareHouseTicketId?: string;
  ProductUnitTypeId?: number;
}
```

**Mock Example:**

```json
{
  "id": 1,
  "quantity": 50,
  "WareHouseTicketId": "TICKET001",
  "ProductUnitTypeId": 1
}
```

---

### StoreTransaction

```typescript
{
  id: number;                 // Primary key, auto-increment
  quantity: number | null;
  type: string | null;       // "in" or "out"
  createAt: Date | null;
  note: string | null;

  // Relationships
  ProductUnitTypeId?: number;
  EmployeeId?: string;
}
```

**Mock Example:**

```json
{
  "id": 1,
  "quantity": 20,
  "type": "in",
  "createAt": "2024-01-15T10:00:00.000Z",
  "note": "Nhập kho",
  "ProductUnitTypeId": 1,
  "EmployeeId": "EMP001"
}
```

---

## API Endpoints

### Authentication APIs

#### Login

- **Method**: POST
- **URL**: `/auth/login`
- **Auth Required**: No
- **Request Body**:

```json
{
  "phonenumber": "0123456789",
  "password": "password123"
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "account": {
    "phonenumber": "0123456789",
    "email": "employee@minimarket.com",
    "role": "NV",
    "pointAchive": 1500.5,
    "accestoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "Employee": {
      "id": "EMP001",
      "name": "Tran Thi B",
      "phonenumber": "0123456789"
    }
  }
}
```

- **Error Response (404)**:

```json
{
  "isSuccess": false,
  "message": "account not found"
}
```

OR

```json
{
  "isSuccess": false,
  "message": "password is not correct, please try it again"
}
```

---

#### Create Account

- **Method**: POST
- **URL**: `/auth/create`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "phonenumber": "0123456789",
  "email": "employee@minimarket.com",
  "password": "password123",
  "role": "NV",
  "EmployeeId": "EMP001"
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "account": {
    "phonenumber": "0123456789",
    "email": "employee@minimarket.com",
    "role": "NV",
    "pointAchive": null
  }
}
```

---

#### Update Account

- **Method**: PUT
- **URL**: `/auth/update`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "phonenumber": "0123456789",
  "email": "newemail@minimarket.com",
  "password": "newpassword123"
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "account": {
    "phonenumber": "0123456789",
    "email": "newemail@minimarket.com",
    "role": "NV"
  }
}
```

---

#### Logout

- **Method**: POST
- **URL**: `/auth/logout`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "message": "logOut completely done"
}
```

---

### Product APIs

#### Add New Product

- **Method**: POST
- **URL**: `/product/add`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "id": "PROD001",
  "barcode": "8934567890123",
  "name": "Coca Cola 330ml",
  "description": "Nước ngọt có gas",
  "quantity": 100,
  "state": true,
  "SubCategoryId": "SUBCAT001"
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "product": {
    "id": "PROD001",
    "barcode": "8934567890123",
    "name": "Coca Cola 330ml",
    "description": "Nước ngọt có gas",
    "quantity": 100,
    "state": true,
    "SubCategoryId": "SUBCAT001",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z"
  }
}
```

---

#### Update Product

- **Method**: PUT
- **URL**: `/product/update?id=PROD001`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "name": "Coca Cola 330ml Updated",
  "description": "Nước ngọt có gas - updated",
  "quantity": 150,
  "state": true
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Product updated successfully"
}
```

---

#### Get All Products

- **Method**: GET
- **URL**: `/product/get`
- **Query Parameters**:
  - `page` (optional): số trang
  - `limit` (optional): số lượng mỗi trang
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "products": [
    {
      "id": "PROD001",
      "barcode": "8934567890123",
      "name": "Coca Cola 330ml",
      "description": "Nước ngọt có gas",
      "quantity": 100,
      "state": true,
      "SubCategoryId": "SUBCAT001",
      "SubCategory": {
        "id": "SUBCAT001",
        "name": "Nước ngọt",
        "Category": {
          "id": "CAT001",
          "name": "Đồ uống"
        }
      },
      "images": [
        {
          "id": 1,
          "uri": "https://example.com/images/cocacola.jpg"
        }
      ],
      "ProductUnitTypes": [
        {
          "id": 1,
          "UnitType": {
            "id": "UNIT001",
            "name": "Lon",
            "convertionQuantity": 1
          },
          "Prices": [
            {
              "id": 100,
              "price": 12000
            }
          ]
        }
      ]
    }
  ]
}
```

---

#### Get Product By ID

- **Method**: GET
- **URL**: `/product/getId?id=PROD001`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "product": {
    "id": "PROD001",
    "barcode": "8934567890123",
    "name": "Coca Cola 330ml",
    "description": "Nước ngọt có gas",
    "quantity": 100,
    "state": true,
    "SubCategory": {
      "id": "SUBCAT001",
      "name": "Nước ngọt"
    },
    "images": [],
    "ProductUnitTypes": []
  }
}
```

---

#### Get Product By Name

- **Method**: GET
- **URL**: `/product/getName?name=coca`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "products": [
    {
      "id": "PROD001",
      "name": "Coca Cola 330ml",
      "barcode": "8934567890123"
    }
  ]
}
```

---

#### Get Product By Barcode

- **Method**: POST
- **URL**: `/product/getOneByBarcode?barCode=8934567890123`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "status": 200,
  "product": {
    "id": "PROD001",
    "barcode": "8934567890123",
    "name": "Coca Cola 330ml"
  }
}
```

---

#### Delete Product

- **Method**: DELETE
- **URL**: `/product/delete?id=PROD001`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Product deleted successfully"
}
```

---

#### Filter Products

- **Method**: GET
- **URL**: `/product/filter?name=coca&state=true`
- **Query Parameters**:
  - `name` (optional): tên sản phẩm
  - `state` (optional): trạng thái (true/false)
  - `SubCategoryId` (optional): ID danh mục con
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "products": []
}
```

---

### Category APIs

#### Add Category

- **Method**: POST
- **URL**: `/category/add`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "id": "CAT001",
  "name": "Đồ uống",
  "image": "https://example.com/images/drinks.jpg",
  "state": true
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "cate": {
    "id": "CAT001",
    "name": "Đồ uống",
    "image": "https://example.com/images/drinks.jpg",
    "state": true
  }
}
```

---

#### Update Category

- **Method**: PUT
- **URL**: `/category/update`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "id": "CAT001",
  "name": "Đồ uống updated",
  "image": "https://example.com/images/drinks-new.jpg",
  "state": true
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Category updated successfully"
}
```

---

#### Get All Categories

- **Method**: GET
- **URL**: `/category/get`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "cates": [
    {
      "id": "CAT001",
      "name": "Đồ uống",
      "image": "https://example.com/images/drinks.jpg",
      "state": true,
      "SubCategories": [
        {
          "id": "SUBCAT001",
          "name": "Nước ngọt"
        }
      ]
    }
  ]
}
```

---

#### Get Category By ID

- **Method**: GET
- **URL**: `/category/getId?id=CAT001`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "categories": {
    "id": "CAT001",
    "name": "Đồ uống",
    "image": "https://example.com/images/drinks.jpg",
    "state": true
  }
}
```

---

#### Filter Categories

- **Method**: GET
- **URL**: `/category/filter?name=đồ&state=true`
- **Query Parameters**:
  - `name` (optional): tên danh mục
  - `state` (optional): trạng thái
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "categories": []
}
```

---

### Customer APIs

#### Add Customer

- **Method**: POST
- **URL**: `/user/add`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "id": "CUST001",
  "firstName": "Nguyen",
  "lastName": "Van A",
  "phonenumber": "0987654321",
  "email": "customer@email.com",
  "TypeCustomerId": "TYPE001"
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "customer": {
    "id": "CUST001",
    "firstName": "Nguyen",
    "lastName": "Van A",
    "phonenumber": "0987654321",
    "email": "customer@email.com"
  }
}
```

---

#### Update Customer

- **Method**: PUT
- **URL**: `/user/update`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "id": "CUST001",
  "firstName": "Nguyen Updated",
  "lastName": "Van A Updated",
  "email": "newemail@email.com"
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Customer updated successfully"
}
```

---

#### Get All Customers

- **Method**: GET
- **URL**: `/user/get`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "customers": [
    {
      "id": "CUST001",
      "firstName": "Nguyen",
      "lastName": "Van A",
      "phonenumber": "0987654321",
      "email": "customer@email.com",
      "TypeCustomer": {
        "id": "TYPE001",
        "name": "Khách hàng VIP"
      }
    }
  ]
}
```

---

#### Get Customer By Phone

- **Method**: GET
- **URL**: `/user/getByPhone?phonenumber=0987654321`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "customer": {
    "id": "CUST001",
    "firstName": "Nguyen",
    "lastName": "Van A",
    "phonenumber": "0987654321",
    "email": "customer@email.com"
  }
}
```

---

#### Get Or Create Customer By Phone

- **Method**: GET
- **URL**: `/user/getOrCreate?phonenumber=0987654321`
- **Auth Required**: Yes
- **Description**: Tìm khách hàng theo số điện thoại, nếu không tồn tại thì tạo mới

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "customer": {
    "id": "CUST001",
    "phonenumber": "0987654321",
    "firstName": null,
    "lastName": null,
    "email": null
  }
}
```

---

#### Delete Customer

- **Method**: DELETE
- **URL**: `/user/delete/:phonenumber`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "message": "Customer deleted successfully"
}
```

---

#### Filter Customers

- **Method**: GET
- **URL**: `/user/filter?phonenumber=098&firstName=nguyen`
- **Query Parameters**:
  - `phonenumber` (optional): số điện thoại (like search)
  - `firstName` (optional): tên
  - `lastName` (optional): họ
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "customers": []
}
```

---

### Bill APIs

#### Create Bill

- **Method**: POST
- **URL**: `/bill/add`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "orderDate": "2024-01-15T14:30:00.000Z",
  "isDDH": false,
  "cost": 250000,
  "type": "success",
  "CustomerId": "CUST001",
  "EmployeeId": "EMP001",
  "billDetails": [
    {
      "PriceId": 100,
      "quantity": 2
    }
  ],
  "promotions": {
    "VoucherId": "VOUCH001",
    "MoneyPromotionId": "MONEY_PROMO001"
  }
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "bill": {
    "id": "Bill1705123456789",
    "orderDate": "2024-01-15T14:30:00.000Z",
    "isDDH": false,
    "cost": 250000,
    "type": "success",
    "CustomerId": "CUST001",
    "EmployeeId": "EMP001"
  }
}
```

---

#### Get All Bills

- **Method**: GET
- **URL**: `/bill/get`
- **Query Parameters**:
  - `page` (optional): số trang
  - `limit` (optional): số lượng mỗi trang
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "bills": [
    {
      "id": "Bill1705123456789",
      "orderDate": "2024-01-15T14:30:00.000Z",
      "isDDH": false,
      "cost": 250000,
      "type": "success",
      "Customer": {
        "id": "CUST001",
        "firstName": "Nguyen",
        "lastName": "Van A",
        "phonenumber": "0987654321"
      },
      "Employee": {
        "id": "EMP001",
        "name": "Tran Thi B"
      },
      "BillDetails": [
        {
          "id": 1,
          "quantity": 2,
          "Price": {
            "id": 100,
            "price": 12000,
            "ProductUnitType": {
              "Product": {
                "name": "Coca Cola 330ml"
              },
              "UnitType": {
                "name": "Lon"
              }
            }
          }
        }
      ],
      "PromotionResults": []
    }
  ]
}
```

---

#### Get Bill By ID

- **Method**: GET
- **URL**: `/bill/getId?id=Bill1705123456789`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "bill": {
    "id": "Bill1705123456789",
    "orderDate": "2024-01-15T14:30:00.000Z",
    "cost": 250000,
    "type": "success",
    "BillDetails": [],
    "PromotionResults": []
  }
}
```

---

#### Update Bill Type

- **Method**: PUT
- **URL**: `/bill/:id/update-type/:type`
- **Path Parameters**:
  - `id`: Bill ID
  - `type`: "success", "pending", "cancel"
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "employeeId": "EMP001"
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "status": 200,
  "message": "Bill type updated"
}
```

---

#### Get Success Bills

- **Method**: GET
- **URL**: `/bill/success`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "bills": []
}
```

---

#### Get Pending/Cancel Bills

- **Method**: GET
- **URL**: `/bill/fail`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "bills": []
}
```

---

#### Get Bills By Date Range

- **Method**: POST
- **URL**: `/bill/from`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "fromDate": "2024-01-01T00:00:00.000Z",
  "toDate": "2024-01-31T23:59:59.000Z",
  "employeeId": "EMP001"
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "bills": []
}
```

---

#### Get Bills By Customer

- **Method**: POST
- **URL**: `/bill/customer`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "fromDate": "2024-01-01T00:00:00.000Z",
  "toDate": "2024-01-31T23:59:59.000Z",
  "customerId": "CUST001"
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "bills": []
}
```

---

### Employee APIs

#### Add Employee

- **Method**: POST
- **URL**: `/employee/add`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "id": "EMP001",
  "name": "Tran Thi B",
  "phonenumber": "0912345678"
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "employee": {
    "id": "EMP001",
    "name": "Tran Thi B",
    "phonenumber": "0912345678"
  }
}
```

---

#### Get All Employees

- **Method**: GET
- **URL**: `/employee/get`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "employees": [
    {
      "id": "EMP001",
      "name": "Tran Thi B",
      "phonenumber": "0912345678"
    }
  ]
}
```

---

### Promotion APIs

#### Add Promotion Header

- **Method**: POST
- **URL**: `/promotion/add`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "id": "PROMO001",
  "title": "Khuyến mãi Tết 2024",
  "startDate": "2024-01-20T00:00:00.000Z",
  "endDate": "2024-02-10T23:59:59.000Z",
  "description": "Giảm giá đặc biệt dịp Tết",
  "state": true
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "promotion": {
    "id": "PROMO001",
    "title": "Khuyến mãi Tết 2024",
    "startDate": "2024-01-20T00:00:00.000Z",
    "endDate": "2024-02-10T23:59:59.000Z",
    "description": "Giảm giá đặc biệt dịp Tết",
    "state": true
  }
}
```

---

#### Get All Promotions

- **Method**: GET
- **URL**: `/promotion/get`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "promotions": [
    {
      "id": "PROMO001",
      "title": "Khuyến mãi Tết 2024",
      "startDate": "2024-01-20T00:00:00.000Z",
      "endDate": "2024-02-10T23:59:59.000Z",
      "state": true,
      "ProductPromotions": [],
      "MoneyPromotions": [],
      "Vouchers": [],
      "DiscountRateProducts": []
    }
  ]
}
```

---

### Voucher APIs

#### Add Voucher

- **Method**: POST
- **URL**: `/voucher/add`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "id": "VOUCH001",
  "code": "TET2024",
  "startDate": "2024-01-20T00:00:00.000Z",
  "title": "Voucher Tết 100K",
  "description": "Giảm 100K cho đơn hàng",
  "endDate": "2024-02-10T23:59:59.000Z",
  "state": true,
  "type": "money",
  "discountMoney": 100000,
  "discountRate": 0,
  "maxDiscountMoney": 100000,
  "groupVoucher": "TET2024_GROUP",
  "PromotionHeaderId": "PROMO001"
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "voucher": {
    "id": "VOUCH001",
    "code": "TET2024",
    "title": "Voucher Tết 100K",
    "discountMoney": 100000,
    "state": true
  }
}
```

---

#### Get Voucher By Code

- **Method**: GET
- **URL**: `/voucher/getByCode?code=TET2024`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "voucher": {
    "id": "VOUCH001",
    "code": "TET2024",
    "title": "Voucher Tết 100K",
    "discountMoney": 100000,
    "isUsed": false,
    "state": true
  }
}
```

---

### Location APIs

#### Get All Cities

- **Method**: GET
- **URL**: `/city/get`
- **Auth Required**: No

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "cities": [
    {
      "id": "CITY001",
      "name": "Hà Nội"
    },
    {
      "id": "CITY002",
      "name": "Hồ Chí Minh"
    }
  ]
}
```

---

#### Get Districts By City

- **Method**: GET
- **URL**: `/district/get?cityId=CITY001`
- **Auth Required**: No

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "districts": [
    {
      "id": "DIST001",
      "name": "Quận Đống Đa",
      "CityId": "CITY001"
    }
  ]
}
```

---

#### Get Wards By District

- **Method**: GET
- **URL**: `/ward/get?districtId=DIST001`
- **Auth Required**: No

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "wards": [
    {
      "id": "WARD001",
      "name": "Phường Láng Hạ",
      "DistrictId": "DIST001"
    }
  ]
}
```

---

### Price APIs

#### Add Price

- **Method**: POST
- **URL**: `/price/add`
- **Auth Required**: Yes
- **Request Body**:

```json
{
  "price": 12000,
  "ListPricesHeaderId": "PRICE_HEADER_001",
  "ProductUnitTypeId": 1
}
```

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "price": {
    "id": 100,
    "price": 12000,
    "ListPricesHeaderId": "PRICE_HEADER_001",
    "ProductUnitTypeId": 1
  }
}
```

---

#### Get All Prices

- **Method**: GET
- **URL**: `/price/get`
- **Auth Required**: Yes

- **Success Response (200)**:

```json
{
  "isSuccess": true,
  "prices": [
    {
      "id": 100,
      "price": 12000,
      "ProductUnitType": {
        "Product": {
          "name": "Coca Cola 330ml"
        },
        "UnitType": {
          "name": "Lon"
        }
      }
    }
  ]
}
```

---

## Common Error Responses

### 401 Unauthorized

```json
{
  "isSuccess": false,
  "message": "you have not authenticated yet"
}
```

### 404 Not Found

```json
{
  "isSuccess": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "isSuccess": false,
  "message": "Internal server error"
}
```

---

## Notes for Frontend Development

### Mock Data Generation

1. **Timestamps**: Sử dụng Date object của JavaScript để tạo timestamps
2. **IDs**: Có thể sử dụng UUID hoặc tạo ID theo pattern của từng model
3. **Relationships**: Đảm bảo các foreign key khớp với primary key của model liên quan

### API Response Structure

- Tất cả API đều trả về object với field `isSuccess` để check trạng thái
- Success response: chứa data trong các field như `product`, `products`, `bill`, `bills`, etc.
- Error response: chứa `message` mô tả lỗi

### Authentication

- Hầu hết các API đều yêu cầu authentication
- Token được gửi qua header: `Authorization: Bearer <token>`
- Token có thời hạn 30 ngày (access token) và 365 ngày (refresh token)

### Pagination

- Một số endpoint hỗ trợ pagination qua query params: `page` và `limit`
- Default values có thể set trong mock API

### Date Format

- Tất cả date đều sử dụng ISO 8601 format: `2024-01-15T14:30:00.000Z`

---

## Mock API Libraries Recommendation

- **json-server**: Để tạo REST API từ JSON file
- **msw (Mock Service Worker)**: Để mock API ở browser level
- **miragejs**: Full-featured API mocking library
- **faker.js / @faker-js/faker**: Để generate mock data

---

**Document Version**: 1.0  
**Last Updated**: November 6, 2025  
**Author**: Backend Team
