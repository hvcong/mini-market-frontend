import axios from "axios";
import { mockApi } from "../mocks/mockApi";
import { config } from "../config";

// existing base URL (kept for real backend)
let baseURL = process.env.REACT_APP_API_URL || "http://13.250.27.60:3000/";

// Build a mockClient regardless, we'll decide below which to export
// helper: parse query string into object
const parseQuery = (queryString) => {
  const params = {};
  if (!queryString) return params;
  const pairs = queryString.replace(/^\?/, "").split("&");
  for (const p of pairs) {
    const [k, v] = p.split("=");
    params[decodeURIComponent(k || "")] = v ? decodeURIComponent(v) : "";
  }
  return params;
};

const route = (url) => {
  const [path, query] = url.split("?");
  return { path, query: parseQuery(query) };
};

const mockClient = {
  get: async (url, options) => {
    const { path, query } = route(url);
    try {
      // PRODUCTS
      if (path.startsWith("product/get")) {
        const r = await mockApi.getProducts(query);
        return {
          isSuccess: !!r.success,
          products: r.data,
          total: r.total,
          page: r.page,
          limit: r.limit,
        };
      }

      if (path.startsWith("product/getId")) {
        const id = parseInt(query.id);
        const r = await mockApi.getProduct(id);
        return { isSuccess: !!r.success, product: r.data };
      }

      if (path.startsWith("product/getOneByBarcode") || path.startsWith("product/barcode")) {
        const barcode = query.barCode || query.barcode;
        const r = await mockApi.getProductByBarcode(barcode);
        return { isSuccess: !!r.success, product: r.data };
      }

      // CATEGORIES
      if (path.startsWith("category/get")) {
        const r = await mockApi.getCategories();
        return { isSuccess: !!r.success, categories: r.data, cates: r.data };
      }
      if (path.startsWith("category/getById")) {
        const id = parseInt(query.id);
        const r = await mockApi.getCategory(id);
        return { isSuccess: !!r.success, category: r.data };
      }

      // AUTH / USER
      if (path.startsWith("auth/me")) {
        const r = await mockApi.getCurrentUser();
        return { isSuccess: !!r.success, user: r.data };
      }

      if (path.startsWith("user/get") || path.startsWith("user/id") || path.startsWith("user/likePhone") || path.startsWith("user/getPhone")) {
        if (query.id) {
          const r = await mockApi.getCustomer(parseInt(query.id));
          return { isSuccess: !!r.success, customer: r.data };
        }
        const r = await mockApi.getCustomers(query);
        return { isSuccess: !!r.success, customers: r.data, total: r.total };
      }

      // BILLS / ORDERS
      if (path.startsWith("bill/getId") || path.startsWith("bill/")) {
        if (path.startsWith("bill/getId")) {
          const id = parseInt(query.id);
          const r = await mockApi.getOrder(id);
          return { isSuccess: !!r.success, bill: r.data };
        }
        const r = await mockApi.getOrders(query);
        return { isSuccess: !!r.success, orders: r.data, total: r.total };
      }

      // INVENTORY
      if (path.startsWith("inventory/get") || path.startsWith("inventory")) {
        const r = await mockApi.getInventory(query);
        return { isSuccess: !!r.success, inventory: r.data, total: r.total };
      }

      // SALES / DASHBOARD
      if (path.startsWith("dashboard/stats") || path.startsWith("dashboard")) {
        const r = await mockApi.getDashboardStats();
        return { isSuccess: !!r.success, ...r.data };
      }

      // STAFF/EMPLOYEE APIs
      if (path.startsWith("employee/one/byId")) {
        const id = query.id;
        const r = await mockApi.getEmployee(id);
        return { isSuccess: !!r.success, employee: r.data };
      }

      if (path.startsWith("employee/one")) {
        const phonenumber = query.phonenumber;
        const r = await mockApi.getEmployeeByPhone(phonenumber);
        return { isSuccess: !!r.success, employee: r.data };
      }

      if (path.startsWith("employee") || path.startsWith("staff")) {
        if (query.id) {
          const r = await mockApi.getEmployee(query.id);
          return { isSuccess: !!r.success, employee: r.data };
        }
        const r = await mockApi.getEmployees(query);
        return { isSuccess: !!r.success, employees: r.data, total: r.total || r.data.length };
      }

      // LOCATION APIs
      if (path.startsWith("city/get")) {
        const r = await mockApi.getCities();
        return { isSuccess: !!r.success, cities: r.data };
      }

      if (path.startsWith("district/get")) {
        const cityId = query.cityId;
        const r = await mockApi.getDistricts(cityId);
        return { isSuccess: !!r.success, districts: r.data };
      }

      if (path.startsWith("ward/get")) {
        const districtId = query.districtId;
        const r = await mockApi.getWards(districtId);
        return { isSuccess: !!r.success, wards: r.data };
      }

      // UNIT TYPE APIs
      if (path.startsWith("unitType/getLimit")) {
        const r = await mockApi.getUnitTypes();
        return { isSuccess: !!r.success, unitTypes: r.data };
      }

      if (path.startsWith("unitType/getId")) {
        const id = query.id;
        const r = await mockApi.getUnitType(id);
        return { isSuccess: !!r.success, unitType: r.data };
      }

      if (path.startsWith("unitType/productId")) {
        const productId = query.productId;
        const r = await mockApi.getUnitTypesByProduct(productId);
        return { isSuccess: !!r.success, unitTypes: r.data };
      }

      if (path.startsWith("unitType/base")) {
        const r = await mockApi.getBaseUnitTypes();
        return { isSuccess: !!r.success, unitTypes: r.data };
      }

      if (path.startsWith("unitType/others")) {
        const r = await mockApi.getOtherUnitTypes();
        return { isSuccess: !!r.success, unitTypes: r.data };
      }

      // PRICE HEADER APIs
      if (path.startsWith("priceHeader/getId")) {
        const id = query.id;
        const r = await mockApi.getPriceHeader(id);
        // provide both keys (header / priceHeader) for different consumers
        return { isSuccess: !!r.success, priceHeader: r.data, header: r.data };
      }

      if (path.startsWith("priceHeader/active")) {
        const r = await mockApi.getActivePriceHeaders();
        // support both `priceHeaders` and `headers`
        return { isSuccess: !!r.success, priceHeaders: r.data, headers: r.data };
      }

      if (path.startsWith("priceHeader/get")) {
        const r = await mockApi.getPriceHeaders();
        // support both `priceHeaders` and `headers` for callers
        return { isSuccess: !!r.success, priceHeaders: r.data, headers: r.data };
      }

      // PRICE LINE APIs
      if (path.startsWith("price/getPriceHeader")) {
        const headerId = query.priceHeaderId;
        const r = await mockApi.getPriceLinesByHeader(headerId);
        // some components expect `priceLines`, others `listPrices` — provide both
        return { isSuccess: !!r.success, priceLines: r.data, listPrices: r.data };
      }

      // PRICE APIs
      if (path.startsWith("price/get")) {
        const r = await mockApi.getPrices();
        return { isSuccess: !!r.success, prices: r.data };
      }

      // PROMOTION APIs
      if (path.startsWith("promotion/getId")) {
        const id = query.id;
        const r = await mockApi.getPromotion(id);
        return { isSuccess: !!r.success, promotion: r.data };
      }

      if (path.startsWith("promotion/get")) {
        const r = await mockApi.getPromotions();
        return { isSuccess: !!r.success, promotions: r.data };
      }

      // VOUCHER APIs
      if (path.startsWith("voucher/getByCode")) {
        const code = query.code;
        const r = await mockApi.getVoucherByCode(code);
        return { isSuccess: !!r.success, voucher: r.data };
      }

      if (path.startsWith("voucher/get")) {
        const r = await mockApi.getVouchers();
        return { isSuccess: !!r.success, vouchers: r.data };
      }

      // FALLBACK: return generic wrapper
      const r = await mockApi.getProducts();
      return { isSuccess: !!r.success, data: r.data };
    } catch (err) {
      return { isSuccess: false, message: err.message || err };
    }
  },

  post: async (url, data) => {
    const { path } = route(url);
    try {
      if (path === "auth/login" || path === "/auth/login") {
        const r = await mockApi.login(data.phonenumber || data.username, data.password);
        return { 
          isSuccess: !!r.success, 
          token: r.data?.token, 
          account: r.data?.account,
          user: r.data?.user 
        };
      }

      if (path.startsWith("product/add") || path === "product/add") {
        const r = await mockApi.createProduct(data);
        return { isSuccess: !!r.success, product: r.data, message: r.message };
      }

      if (path.startsWith("bill/add") || path === "bill/add") {
        const r = await mockApi.createOrder(data);
        return { isSuccess: !!r.success, order: r.data, message: r.message };
      }

      if (path.startsWith("retrieve/add")) {
        const r = await mockApi.createOrder(data);
        return { isSuccess: !!r.success, data: r.data };
      }

      if (path.startsWith("user/add") || path === "/user/add") {
        const r = await mockApi.createCustomer(data);
        return { isSuccess: !!r.success, customer: r.data, message: r.message };
      }

      if (path.startsWith("price/add")) {
        const r = await mockApi.addPrice(data);
        return { isSuccess: !!r.success, price: r.data, message: r.message };
      }

      if (path.startsWith("promotion/add")) {
        const r = await mockApi.addPromotion(data);
        return { isSuccess: !!r.success, promotion: r.data, message: r.message };
      }

      if (path.startsWith("voucher/add")) {
        const r = await mockApi.addVoucher(data);
        return { isSuccess: !!r.success, voucher: r.data, message: r.message };
      }

      if (path.startsWith("employee/add")) {
        const r = await mockApi.addEmployee(data);
        return { isSuccess: !!r.success, employee: r.data, message: r.message };
      }

      if (path.startsWith("unitType/add")) {
        const r = await mockApi.addUnitType(data);
        return { isSuccess: !!r.success, unitType: r.data, message: r.message };
      }

      if (path.startsWith("priceHeader/add")) {
        const r = await mockApi.addPriceHeader(data);
        return { isSuccess: !!r.success, priceHeader: r.data, message: r.message };
      }

      return { isSuccess: true, data: null };
    } catch (err) {
      return { isSuccess: false, message: err.message || err };
    }
  },

  put: async (url, data) => {
    const { path, query } = route(url);
    try {
      if (path.startsWith("product/update")) {
        const id = data.id || parseInt(query.id);
        const r = await mockApi.updateProduct(id, data);
        return { isSuccess: !!r.success, product: r.data, message: r.message };
      }

      if (path.startsWith("product/updateQuantity")) {
        const id = parseInt(query.id);
        const getRes = await mockApi.getProduct(id);
        const product = getRes.data;
        const newStock = (product.stock || 0) + (data.quantityChange || 0);
        const r = await mockApi.updateProduct(id, { stock: newStock });
        return { isSuccess: !!r.success, product: r.data };
      }

      if (path.startsWith("category/update")) {
        const id = data.id || parseInt(query.id);
        const r = await mockApi.updateCategory(id, data);
        return { isSuccess: !!r.success, category: r.data, message: r.message };
      }

      if (path.startsWith("user/update") || path.startsWith("employee/update") || path.startsWith("employee/update/fullinfor")) {
        const id = data.id || parseInt(query.id);
        const r = await mockApi.updateCustomer(id, data);
        return { isSuccess: !!r.success, customer: r.data, message: r.message };
      }

      if (path.includes("/update-type/")) {
        const parts = path.split("/");
        const billId = parseInt(parts[1]);
        const r = await mockApi.updateOrder(billId, { status: data.type || "completed" });
        return { isSuccess: !!r.success, order: r.data };
      }

      if (path.startsWith("unitType/update")) {
        const id = data.id || parseInt(query.id);
        const r = await mockApi.updateUnitType(id, data);
        return { isSuccess: !!r.success, unitType: r.data, message: r.message };
      }

      if (path.startsWith("priceHeader/update")) {
        const id = data.id || parseInt(query.id);
        const r = await mockApi.updatePriceHeader(id, data);
        return { isSuccess: !!r.success, priceHeader: r.data, message: r.message };
      }

      if (path.startsWith("price/update")) {
        const id = data.id || parseInt(query.id);
        const r = await mockApi.updatePrice(id, data);
        return { isSuccess: !!r.success, price: r.data, message: r.message };
      }

      if (path.startsWith("promotion/update")) {
        const id = data.id || parseInt(query.id);
        const r = await mockApi.updatePromotion(id, data);
        return { isSuccess: !!r.success, promotion: r.data, message: r.message };
      }

      return { isSuccess: true, data: null };
    } catch (err) {
      return { isSuccess: false, message: err.message || err };
    }
  },

  delete: async (url) => {
    const { path, query } = route(url);
    try {
      if (path.startsWith("product/delete")) {
        const id = parseInt(query.id);
        const r = await mockApi.deleteProduct(id);
        return { isSuccess: !!r.success, message: r.message };
      }
      return { isSuccess: true, data: null };
    } catch (err) {
      return { isSuccess: false, message: err.message || err };
    }
  },
};

// REAL axios client (used when not mocking)
const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    "content-type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log("Response Error:", error?.response?.data || error.message);
    return Promise.reject(error?.response?.data || error);
  }
);

// JSON Server client for persistent CRUD operations
const jsonServerAxios = axios.create({
  baseURL: config.jsonServerUrl,
  headers: {
    "content-type": "application/json",
  },
});

// Map mock API routes to JSON Server routes
const mapRouteToJsonServer = (url, method = 'GET') => {
  const { path, query } = route(url);
  
  // Map singular routes to plural resource names
  const routeMap = {
    'product': 'products',
    'category': 'categories',
    'user': 'customers',
    'employee': 'employees',
    'bill': 'bills',
    'unitType': 'unitTypes',
    'priceHeader': 'priceHeaders',
    'price': 'priceLines',
    'promotion': 'promotions',
  };
  
  // Extract resource name from path
  for (const [singular, plural] of Object.entries(routeMap)) {
    if (path.startsWith(singular)) {
      if (query.id) {
        // Single resource by ID
        return `/${plural}/${query.id}`;
      }
      // List resources with query params
      const params = new URLSearchParams(query).toString();
      return `/${plural}${params ? '?' + params : ''}`;
    }
  }
  
  // Fallback: try to use path as-is
  return '/' + path;
};

const jsonServerClient = {
  get: async (url, options) => {
    const { path } = route(url);
    const mappedUrl = mapRouteToJsonServer(url, 'GET');
    console.log('🔄 JSON Server GET:', mappedUrl);
    const response = await jsonServerAxios.get(mappedUrl, options);
    
    // Wrap response for consistency with mock API
    const data = Array.isArray(response.data) ? response.data : [response.data];
    return {
      isSuccess: true,
      data: response.data,
      total: Array.isArray(response.data) ? response.data.length : 1,
      // Also add resource-specific keys for backward compatibility
      products: path.includes('product') ? data : undefined,
      categories: path.includes('category') ? data : undefined,
      customers: path.includes('user') ? data : undefined,
      employees: path.includes('employee') ? data : undefined,
      bills: path.includes('bill') ? data : undefined,
      priceHeaders: path.includes('priceHeader') ? data : undefined,
      priceLines: path.includes('price') ? data : undefined,
    };
  },
  
  post: async (url, postData) => {
    const { path } = route(url);
    const mappedUrl = mapRouteToJsonServer(url, 'POST');
    console.log('🔄 JSON Server POST:', mappedUrl, postData);
    const response = await jsonServerAxios.post(mappedUrl, postData);
    return {
      isSuccess: true,
      data: response.data,
      message: 'Thêm mới thành công',
      // Add resource-specific keys
      product: path.includes('product') ? response.data : undefined,
      priceHeader: path.includes('priceHeader') ? response.data : undefined,
      customer: path.includes('user') ? response.data : undefined,
    };
  },
  
  put: async (url, putData) => {
    const { path, query } = route(url);
    const id = putData.id || query.id;
    const mappedUrl = mapRouteToJsonServer(url, 'PUT').replace(/\?.*$/, '') + (id ? '' : '/' + id);
    console.log('🔄 JSON Server PUT:', mappedUrl, putData);
    const response = await jsonServerAxios.put(mappedUrl, putData);
    return {
      isSuccess: true,
      data: response.data,
      message: 'Cập nhật thành công',
      priceHeader: path.includes('priceHeader') ? response.data : undefined,
    };
  },
  
  delete: async (url) => {
    const mappedUrl = mapRouteToJsonServer(url, 'DELETE');
    console.log('🔄 JSON Server DELETE:', mappedUrl);
    await jsonServerAxios.delete(mappedUrl);
    return {
      isSuccess: true,
      message: 'Xóa thành công',
    };
  },
};

// Export selected client depending on config
let client;
switch (config.dataMode) {
  case 'json-server':
    client = jsonServerClient;
    console.log('📡 Using JSON Server mode (CRUD persists to db.json)');
    break;
  case 'real':
    client = axiosClient;
    console.log('📡 Using Real Backend mode');
    break;
  case 'mock':
  default:
    client = mockClient;
    console.log('📡 Using Mock Data mode (in-memory only)');
    break;
}

export default client;
