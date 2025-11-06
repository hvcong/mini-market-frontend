import {
  mockProducts,
  mockOrders,
  mockUser,
  mockCategories,
  mockSubCategories,
  mockCustomers,
  mockEmployees,
  mockInventory,
  mockSales,
  mockStaff,
  mockUnitTypes,
  mockAccounts,
  mockTypeCustomers,
  mockCities,
  mockDistricts,
  mockWards,
  mockAddresses,
  mockListPricesHeaders,
  mockPrices,
  mockPromotionHeaders,
  mockProductPromotions,
  mockGiftProducts,
  mockMoneyPromotions,
  mockDiscountRateProducts,
  mockVouchers,
  mockPromotionResults,
} from "./data";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Clone data để tránh mutation trực tiếp
let products = [...mockProducts];
let orders = [...mockOrders];
let categories = [...mockCategories];
let subCategories = [...mockSubCategories];
let customers = [...mockCustomers];
let employees = [...mockEmployees];
let inventory = [...mockInventory];
let sales = [...mockSales];
let staff = [...mockStaff];
let typeCustomers = [...mockTypeCustomers];
let cities = [...mockCities];
let districts = [...mockDistricts];
let wards = [...mockWards];

// Price aliases
let priceHeaders = [...mockListPricesHeaders];
let priceLines = [...mockPrices];

// Promotion aliases
let promotions = [...mockPromotionHeaders];
let promotionHeaders = [...mockPromotionHeaders];
let productPromotions = [...mockProductPromotions];
let moneyPromotions = [...mockMoneyPromotions];
let vouchers = [...mockVouchers];
let discountRateProducts = [...mockDiscountRateProducts];

export const mockApi = {
  // ============= AUTH =============
  login: async (username, password) => {
    console.log("Mock login called with:", username, password);
    await delay(500);
    
    // Find account by phonenumber
    const account = mockAccounts.find(acc => acc.phonenumber === username);
    console.log("Found account:", account);
    
    // For dev: accept any password as "123456" or original password
    if (account && (password === "123456" || password === "22222222")) {
      const token = "mock-token-" + Date.now();
      
      // Find employee info if this is an employee account
      let employee = null;
      if (account.EmployeeId) {
        employee = mockEmployees.find(emp => emp.id === account.EmployeeId);
        console.log("Found employee:", employee);
      }
      
      const mockEmployee = employee ? {
        id: employee.id,
        name: employee.name,
        phonenumber: employee.phonenumber,
        email: account.email,
        role: account.role,
        status: "active",
        HomeAddressId: employee.HomeAddressId,
      } : null;
      
      const mockAccount = {
        id: account.EmployeeId || account.CustomerId,
        phonenumber: account.phonenumber,
        email: account.email,
        role: account.role,
        password: "hashed_password",
        Employee: mockEmployee,
      };
      
      console.log("Login response - mockAccount:", mockAccount);
      console.log("Login response - mockEmployee:", mockEmployee);
      
      localStorage.setItem("token", token);
      if (mockEmployee) {
        // Store full employee data with Account reference for restore
        const employeeWithAccount = {
          ...mockEmployee,
          Account: mockAccount,
        };
        localStorage.setItem("user", JSON.stringify(employeeWithAccount));
      }
      
      return {
        success: true,
        data: { 
          token, 
          account: mockAccount,
          user: mockEmployee 
        },
      };
    }
    
    throw new Error("Tên đăng nhập hoặc mật khẩu không đúng");
  },

  logout: async () => {
    await delay(300);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return { success: true, message: "Đăng xuất thành công" };
  },

  getCurrentUser: async () => {
    await delay(300);
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Chưa đăng nhập");
    return { success: true, data: mockUser };
  },

  changePassword: async (oldPassword, newPassword) => {
    await delay(500);
    if (oldPassword !== "admin") throw new Error("Mật khẩu cũ không đúng");
    return { success: true, message: "Đổi mật khẩu thành công" };
  },

  // ============= PRODUCTS =============
  getProducts: async (params) => {
    await delay(300);
    let result = [...products];

    if (params && params.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.barcode.includes(params.search)
      );
    }

    if (params && params.category) {
      result = result.filter((p) => p.category === params.category);
    }

    if (params && params.minPrice) {
      result = result.filter((p) => p.price >= params.minPrice);
    }

    if (params && params.maxPrice) {
      result = result.filter((p) => p.price <= params.maxPrice);
    }

    return {
      success: true,
      data: result,
      total: result.length,
      page: (params && params.page) || 1,
      limit: (params && params.limit) || result.length,
    };
  },

  getProduct: async (id) => {
    await delay(300);
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error("Không tìm thấy sản phẩm");
    return { success: true, data: product };
  },

  getProductByBarcode: async (barcode) => {
    await delay(300);
    // Tìm trong products
    let product = products.find((p) => p.barcode === barcode);
    
    // Nếu không tìm thấy, tìm trong ProductUnitTypes
    if (!product) {
      for (const p of products) {
        const put = p.ProductUnitTypes?.find((put) => put.barcode === barcode);
        if (put) {
          product = p;
          break;
        }
      }
    }
    
    if (!product) throw new Error("Không tìm thấy sản phẩm với mã vạch này");
    return { success: true, data: product };
  },

  createProduct: async (product) => {
    await delay(500);
    const newId = "PROD" + Date.now();
    const newProduct = {
      ...product,
      id: newId,
      image: product.image || "https://via.placeholder.com/150",
      quantity: product.quantity || 0,
      ProductUnitTypes: product.ProductUnitTypes || [
        {
          id: Date.now(),
          ProductId: newId,
          UnitTypeId: 1,
          barcode: product.barcode || "",
          UnitType: {
            id: 1,
            name: "Cái",
            convertionQuantity: 1,
          },
        },
      ],
    };
    products.push(newProduct);

    // Thêm vào inventory
    inventory.push({
      id: Date.now() + 1,
      productId: newProduct.id,
      productName: newProduct.name,
      quantity: newProduct.quantity,
      minStock: 10,
      lastRestocked: new Date().toISOString(),
      ProductUnitType: newProduct.ProductUnitTypes[0],
    });

    return {
      success: true,
      data: newProduct,
      message: "Thêm sản phẩm thành công",
    };
  },

  updateProduct: async (id, product) => {
    await delay(500);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Không tìm thấy sản phẩm");
    products[index] = { ...products[index], ...product };

    // Update inventory
    const invIndex = inventory.findIndex((i) => i.productId === id);
    if (invIndex !== -1) {
      inventory[invIndex].productName =
        product.name || inventory[invIndex].productName;
      inventory[invIndex].quantity =
        product.quantity || inventory[invIndex].quantity;
    }

    return {
      success: true,
      data: products[index],
      message: "Cập nhật sản phẩm thành công",
    };
  },

  deleteProduct: async (id) => {
    await delay(500);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Không tìm thấy sản phẩm");

    products.splice(index, 1);

    // Remove from inventory
    const invIndex = inventory.findIndex((i) => i.productId === id);
    if (invIndex !== -1) {
      inventory.splice(invIndex, 1);
    }

    return { success: true, message: "Xóa sản phẩm thành công" };
  },

  // ============= CATEGORIES =============
  getCategories: async () => {
    await delay(300);
    return { success: true, data: categories };
  },

  getCategory: async (id) => {
    await delay(300);
    const category = categories.find((c) => c.id === id);
    if (!category) throw new Error("Không tìm thấy danh mục");
    return { success: true, data: category };
  },

  createCategory: async (category) => {
    await delay(500);
    const newCategory = { ...category, id: Date.now() };
    categories.push(newCategory);
    return {
      success: true,
      data: newCategory,
      message: "Thêm danh mục thành công",
    };
  },

  updateCategory: async (id, category) => {
    await delay(500);
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Không tìm thấy danh mục");
    categories[index] = { ...categories[index], ...category };
    return {
      success: true,
      data: categories[index],
      message: "Cập nhật danh mục thành công",
    };
  },

  deleteCategory: async (id) => {
    await delay(500);
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Không tìm thấy danh mục");

    // Check if category is in use
    const inUse = products.some((p) => p.category === categories[index].name);
    if (inUse) throw new Error("Không thể xóa danh mục đang được sử dụng");

    categories.splice(index, 1);
    return { success: true, message: "Xóa danh mục thành công" };
  },

  // ============= ORDERS =============
  getOrders: async (params) => {
    await delay(300);
    let result = [...orders].sort(
      (a, b) =>
        new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );

    if (params && params.status) {
      result = result.filter((o) => o.status === params.status);
    }

    if (params && params.startDate && params.endDate) {
      result = result.filter((o) => {
        const orderDate = new Date(o.orderDate);
        return (
          orderDate >= new Date(params.startDate) &&
          orderDate <= new Date(params.endDate)
        );
      });
    }

    if (params && params.customerId) {
      result = result.filter((o) => o.customerId === params.customerId);
    }

    return { success: true, data: result, total: result.length };
  },

  getOrder: async (id) => {
    await delay(300);
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error("Không tìm thấy đơn hàng");
    return { success: true, data: order };
  },

  createOrder: async (order) => {
    await delay(500);

    // Validate stock
    if (order.items) {
      for (const item of order.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product)
          throw new Error(`Không tìm thấy sản phẩm ${item.productName}`);
        if (product.quantity < item.quantity) {
          throw new Error(
            `Sản phẩm ${item.productName} không đủ số lượng (còn ${product.quantity})`
          );
        }
      }
    }

    const newOrderId = Date.now();
    
    // Create BillDetails with nested Price and ProductUnitType
    const BillDetails = (order.items || []).map((item, index) => {
      const product = products.find((p) => p.id === item.productId);
      const productUnitType = product?.ProductUnitTypes?.[0] || {};
      
      return {
        id: newOrderId + index,
        BillId: newOrderId,
        quantity: item.quantity,
        price: item.price,
        Price: {
          id: Date.now() + index,
          price: item.price,
          ProductUnitTypeId: productUnitType.id,
          ProductUnitType: {
            ...productUnitType,
            Product: {
              id: product.id,
              name: product.name,
              barcode: product.barcode,
            },
          },
        },
      };
    });

    const newOrder = {
      ...order,
      id: newOrderId,
      orderDate: new Date().toISOString(),
      status: order.status || "completed",
      items: order.items || [],
      BillDetails,
      EmployeeId: order.EmployeeId || 1,
      Employee: order.Employee || {
        id: 1,
        name: "Admin User",
        phonenumber: "0868283915",
      },
    };
    orders.unshift(newOrder);

    // Update product stock and inventory
    newOrder.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        product.quantity -= item.quantity;
      }

      // Update inventory
      const inv = inventory.find((i) => i.productId === item.productId);
      if (inv) {
        inv.quantity -= item.quantity;
      }
    });

    // Add to sales
    sales.unshift({
      id: Date.now(),
      date: newOrder.orderDate,
      total: newOrder.total,
      profit: newOrder.total * 0.2, // 20% profit margin
      itemsSold: newOrder.items.reduce((sum, item) => sum + item.quantity, 0),
    });

    return {
      success: true,
      data: newOrder,
      message: "Tạo đơn hàng thành công",
    };
  },

  updateOrder: async (id, orderData) => {
    await delay(500);
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Không tìm thấy đơn hàng");
    orders[index] = { ...orders[index], ...orderData };
    return {
      success: true,
      data: orders[index],
      message: "Cập nhật đơn hàng thành công",
    };
  },

  deleteOrder: async (id) => {
    await delay(500);
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error("Không tìm thấy đơn hàng");

    const order = orders[index];

    // Restore stock
    if (order.items) {
      order.items.forEach((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (product) {
          product.stock += item.quantity;
        }
      });
    }

    orders.splice(index, 1);
    return { success: true, message: "Xóa đơn hàng thành công" };
  },

  // ============= CUSTOMERS =============
  getCustomers: async (params) => {
    await delay(300);
    let result = [...customers];

    if (params && params.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.phone.includes(params.search) ||
          (c.email && c.email.toLowerCase().includes(searchLower))
      );
    }

    return { success: true, data: result, total: result.length };
  },

  getCustomer: async (id) => {
    await delay(300);
    const customer = customers.find((c) => c.id === id);
    if (!customer) throw new Error("Không tìm thấy khách hàng");
    return { success: true, data: customer };
  },

  createCustomer: async (customer) => {
    await delay(500);

    // Check duplicate phone
    if (customers.some((c) => c.phone === customer.phone)) {
      throw new Error("Số điện thoại đã tồn tại");
    }

    const newCustomer = { ...customer, id: Date.now() };
    customers.push(newCustomer);
    return {
      success: true,
      data: newCustomer,
      message: "Thêm khách hàng thành công",
    };
  },

  updateCustomer: async (id, customer) => {
    await delay(500);
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Không tìm thấy khách hàng");

    // Check duplicate phone
    if (
      customer.phone &&
      customers.some((c) => c.phone === customer.phone && c.id !== id)
    ) {
      throw new Error("Số điện thoại đã tồn tại");
    }

    customers[index] = { ...customers[index], ...customer };
    return {
      success: true,
      data: customers[index],
      message: "Cập nhật khách hàng thành công",
    };
  },

  deleteCustomer: async (id) => {
    await delay(500);
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Không tìm thấy khách hàng");

    // Check if customer has orders
    const hasOrders = orders.some((o) => o.customerId === id);
    if (hasOrders) throw new Error("Không thể xóa khách hàng có đơn hàng");

    customers.splice(index, 1);
    return { success: true, message: "Xóa khách hàng thành công" };
  },

  // ============= INVENTORY =============
  getInventory: async (params) => {
    await delay(300);
    let result = [...inventory];

    if (params && params.lowStock) {
      result = result.filter((i) => i.quantity <= i.minStock);
    }

    if (params && params.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter((i) =>
        i.productName.toLowerCase().includes(searchLower)
      );
    }

    return { success: true, data: result, total: result.length };
  },

  getInventoryItem: async (id) => {
    await delay(300);
    const item = inventory.find((i) => i.id === id);
    if (!item) throw new Error("Không tìm thấy mục tồn kho");
    return { success: true, data: item };
  },

  updateInventory: async (id, quantity) => {
    await delay(500);
    const index = inventory.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Không tìm thấy mục tồn kho");

    inventory[index].quantity += quantity;
    inventory[index].lastRestocked = new Date().toISOString();

    // Update product stock
    const product = products.find((p) => p.id === inventory[index].productId);
    if (product) {
      product.stock += quantity;
    }

    return {
      success: true,
      data: inventory[index],
      message: quantity > 0 ? "Nhập kho thành công" : "Xuất kho thành công",
    };
  },

  updateMinStock: async (id, minStock) => {
    await delay(500);
    const index = inventory.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Không tìm thấy mục tồn kho");

    inventory[index].minStock = minStock;
    return {
      success: true,
      data: inventory[index],
      message: "Cập nhật mức tồn tối thiểu thành công",
    };
  },

  getLowStock: async () => {
    await delay(300);
    const lowStock = inventory.filter((i) => i.quantity <= i.minStock);
    return { success: true, data: lowStock, total: lowStock.length };
  },

  // ============= SALES & REPORTS =============
  getSales: async (params) => {
    await delay(300);
    let result = [...sales].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (params && params.startDate && params.endDate) {
      result = result.filter((s) => {
        const saleDate = new Date(s.date);
        return (
          saleDate >= new Date(params.startDate) &&
          saleDate <= new Date(params.endDate)
        );
      });
    }

    return { success: true, data: result, total: result.length };
  },

  getDashboardStats: async () => {
    await delay(300);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = sales.filter((s) => new Date(s.date) >= today);

    const todayOrders = orders.filter((o) => new Date(o.orderDate) >= today);

    return {
      success: true,
      data: {
        totalRevenue: sales.reduce((sum, s) => sum + s.total, 0),
        todayRevenue: todaySales.reduce((sum, s) => sum + s.total, 0),
        totalOrders: orders.length,
        todayOrders: todayOrders.length,
        totalProducts: products.length,
        lowStockProducts: inventory.filter((i) => i.quantity <= i.minStock)
          .length,
        totalCustomers: customers.length,
        activeStaff: staff.filter((s) => s.status === "active").length,
      },
    };
  },

  getRevenueReport: async (params) => {
    await delay(300);
    let result = [...sales];

    if (params && params.startDate && params.endDate) {
      result = result.filter((s) => {
        const saleDate = new Date(s.date);
        return (
          saleDate >= new Date(params.startDate) &&
          saleDate <= new Date(params.endDate)
        );
      });
    }

    const totalRevenue = result.reduce((sum, s) => sum + s.total, 0);
    const totalProfit = result.reduce((sum, s) => sum + s.profit, 0);
    const totalItemsSold = result.reduce((sum, s) => sum + s.itemsSold, 0);

    return {
      success: true,
      data: {
        sales: result,
        summary: {
          totalRevenue,
          totalProfit,
          totalItemsSold,
          averageOrderValue:
            result.length > 0 ? totalRevenue / result.length : 0,
        },
      },
    };
  },

  getTopProducts: async (limit = 10) => {
    await delay(300);

    // Count product sales from orders
    const productSales = new Map();

    orders.forEach((order) => {
      if (order.items) {
        order.items.forEach((item) => {
          const current = productSales.get(item.productId) || {
            product: products.find((p) => p.id === item.productId),
            totalSold: 0,
            revenue: 0,
          };
          current.totalSold += item.quantity;
          current.revenue += item.quantity * item.price;
          productSales.set(item.productId, current);
        });
      }
    });

    const topProducts = Array.from(productSales.values())
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, limit);

    return { success: true, data: topProducts };
  },

  // ============= STAFF =============
  getStaff: async (params) => {
    await delay(300);
    let result = [...staff];

    if (params && params.status) {
      result = result.filter((s) => s.status === params.status);
    }

    if (params && params.role) {
      result = result.filter((s) => s.role === params.role);
    }

    if (params && params.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower) ||
          s.phone.includes(params.search)
      );
    }

    return { success: true, data: result, total: result.length };
  },

  getStaffMember: async (id) => {
    await delay(300);
    const member = staff.find((s) => s.id === id);
    if (!member) throw new Error("Không tìm thấy nhân viên");
    return { success: true, data: member };
  },

  createStaff: async (member) => {
    await delay(500);

    // Check duplicate email
    if (staff.some((s) => s.email === member.email)) {
      throw new Error("Email đã tồn tại");
    }

    // Check duplicate phone
    if (staff.some((s) => s.phone === member.phone)) {
      throw new Error("Số điện thoại đã tồn tại");
    }

    const newMember = { ...member, id: Date.now(), status: "active" };
    staff.push(newMember);
    return {
      success: true,
      data: newMember,
      message: "Thêm nhân viên thành công",
    };
  },

  updateStaff: async (id, member) => {
    await delay(500);
    const index = staff.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Không tìm thấy nhân viên");

    // Check duplicate email
    if (
      member.email &&
      staff.some((s) => s.email === member.email && s.id !== id)
    ) {
      throw new Error("Email đã tồn tại");
    }

    // Check duplicate phone
    if (
      member.phone &&
      staff.some((s) => s.phone === member.phone && s.id !== id)
    ) {
      throw new Error("Số điện thoại đã tồn tại");
    }

    staff[index] = { ...staff[index], ...member };
    return {
      success: true,
      data: staff[index],
      message: "Cập nhật nhân viên thành công",
    };
  },

  deleteStaff: async (id) => {
    await delay(500);
    const index = staff.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Không tìm thấy nhân viên");

    staff.splice(index, 1);
    return { success: true, message: "Xóa nhân viên thành công" };
  },

  toggleStaffStatus: async (id) => {
    await delay(500);
    const index = staff.findIndex((s) => s.id === id);
    if (index === -1) throw new Error("Không tìm thấy nhân viên");

    staff[index].status =
      staff[index].status === "active" ? "inactive" : "active";
    return {
      success: true,
      data: staff[index],
      message:
        staff[index].status === "active"
          ? "Kích hoạt nhân viên thành công"
          : "Vô hiệu hóa nhân viên thành công",
    };
  },

  // ============= LOCATION APIs (Cities, Districts, Wards) =============
  getCities: async () => {
    await delay(300);
    return { success: true, data: cities, isSuccess: true, cities };
  },

  getDistricts: async (cityId) => {
    await delay(300);
    const result = cityId 
      ? districts.filter((d) => d.CityId === cityId)
      : districts;
    return { success: true, data: result, isSuccess: true, districts: result };
  },

  getWards: async (districtId) => {
    await delay(300);
    const result = districtId
      ? wards.filter((w) => w.DistrictId === districtId)
      : wards;
    return { success: true, data: result, isSuccess: true, wards: result };
  },

  // ============= PRICE APIs =============
  getPrices: async () => {
    await delay(300);
    // Join với ProductUnitType để trả về đầy đủ thông tin
    const enrichedPrices = priceLines.map((price) => {
      const put = products
        .flatMap((p) => p.ProductUnitTypes)
        .find((put) => put.id === price.ProductUnitTypeId);
      const product = products.find((p) => p.id === put?.ProductId);
      
      return {
        ...price,
        ProductUnitType: put ? {
          ...put,
          Product: product ? {
            id: product.id,
            name: product.name,
            barcode: product.barcode,
          } : null,
        } : null,
      };
    });
    return { success: true, data: enrichedPrices, isSuccess: true, prices: enrichedPrices };
  },

  addPrice: async (priceData) => {
    await delay(500);
    const newPrice = {
      ...priceData,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    priceLines.push(newPrice);
    return { success: true, data: newPrice, isSuccess: true, price: newPrice };
  },

  // ============= PROMOTION APIs =============
  getPromotions: async () => {
    await delay(300);
    const enrichedPromotions = promotionHeaders.map((promo) => ({
      ...promo,
      ProductPromotions: productPromotions.filter((pp) => pp.PromotionHeaderId === promo.id),
      MoneyPromotions: moneyPromotions.filter((mp) => mp.PromotionHeaderId === promo.id),
      Vouchers: vouchers.filter((v) => v.PromotionHeaderId === promo.id),
      DiscountRateProducts: discountRateProducts.filter((drp) => drp.PromotionHeaderId === promo.id),
    }));
    return { success: true, data: enrichedPromotions, isSuccess: true, promotions: enrichedPromotions };
  },

  getPromotion: async (id) => {
    await delay(300);
    const promo = promotionHeaders.find((p) => p.id === id);
    if (!promo) throw new Error("Không tìm thấy chương trình khuyến mãi");
    
    const enrichedPromo = {
      ...promo,
      ProductPromotions: productPromotions.filter((pp) => pp.PromotionHeaderId === promo.id),
      MoneyPromotions: moneyPromotions.filter((mp) => mp.PromotionHeaderId === promo.id),
      Vouchers: vouchers.filter((v) => v.PromotionHeaderId === promo.id),
      DiscountRateProducts: discountRateProducts.filter((drp) => drp.PromotionHeaderId === promo.id),
    };
    return { success: true, data: enrichedPromo, isSuccess: true, promotion: enrichedPromo };
  },

  addPromotion: async (promotionData) => {
    await delay(500);
    const newPromo = {
      ...promotionData,
      id: "PROMO" + Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    promotionHeaders.push(newPromo);
    return { success: true, data: newPromo, isSuccess: true, promotion: newPromo };
  },

  // ============= VOUCHER APIs =============
  getVouchers: async () => {
    await delay(300);
    return { success: true, data: vouchers, isSuccess: true, vouchers };
  },

  getVoucherByCode: async (code) => {
    await delay(300);
    const voucher = vouchers.find((v) => v.code === code && !v.isUsed && v.state);
    if (!voucher) throw new Error("Không tìm thấy voucher hoặc voucher đã hết hạn");
    return { success: true, data: voucher, isSuccess: true, voucher };
  },

  addVoucher: async (voucherData) => {
    await delay(500);
    const newVoucher = {
      ...voucherData,
      id: "VOUCH" + Date.now(),
      isUsed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    vouchers.push(newVoucher);
    return { success: true, data: newVoucher, isSuccess: true, voucher: newVoucher };
  },

  // ============= EMPLOYEE APIs =============
  getEmployees: async () => {
    await delay(300);
    return { success: true, data: employees, isSuccess: true, employees };
  },

  getEmployee: async (id) => {
    await delay(300);
    const employee = employees.find((e) => e.id === id);
    if (!employee) throw new Error("Không tìm thấy nhân viên");
    
    // Find associated account
    const account = mockAccounts.find((acc) => acc.EmployeeId === id);
    
    const enrichedEmployee = {
      ...employee,
      Account: account || null,
    };
    
    return { success: true, data: enrichedEmployee, isSuccess: true, employee: enrichedEmployee };
  },

  getEmployeeByPhone: async (phonenumber) => {
    await delay(300);
    const employee = employees.find((e) => e.phonenumber === phonenumber);
    if (!employee) throw new Error("Không tìm thấy nhân viên");
    
    // Find associated account
    const account = mockAccounts.find((acc) => acc.EmployeeId === employee.id);
    
    const enrichedEmployee = {
      ...employee,
      Account: account || null,
    };
    
    return { success: true, data: enrichedEmployee, isSuccess: true, employee: enrichedEmployee };
  },

  addEmployee: async (employeeData) => {
    await delay(500);
    const newEmployee = {
      ...employeeData,
      id: "EMP" + Date.now(),
    };
    employees.push(newEmployee);
    return { success: true, data: newEmployee, isSuccess: true, employee: newEmployee };
  },

  updateEmployee: async (id, employeeData) => {
    await delay(500);
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Không tìm thấy nhân viên");
    employees[index] = { ...employees[index], ...employeeData };
    return { success: true, data: employees[index], isSuccess: true, employee: employees[index] };
  },

  deleteEmployee: async (id) => {
    await delay(500);
    const index = employees.findIndex((e) => e.id === id);
    if (index === -1) throw new Error("Không tìm thấy nhân viên");
    employees.splice(index, 1);
    return { success: true, message: "Xóa nhân viên thành công", isSuccess: true };
  },

  // ============= TYPE CUSTOMER APIs =============
  getTypeCustomers: async () => {
    await delay(300);
    return { success: true, data: typeCustomers, isSuccess: true, typeCustomers };
  },

  // ============= SUB CATEGORY APIs =============
  getSubCategories: async () => {
    await delay(300);
    return { success: true, data: subCategories, isSuccess: true, subCategories };
  },

  getSubCategory: async (id) => {
    await delay(300);
    const subCat = subCategories.find((sc) => sc.id === id);
    if (!subCat) throw new Error("Không tìm thấy danh mục con");
    return { success: true, data: subCat, isSuccess: true, subCategory: subCat };
  },

  // ============= UNIT TYPE APIs =============
  getUnitTypes: async () => {
    await delay(300);
    return { success: true, data: mockUnitTypes, isSuccess: true, unitTypes: mockUnitTypes };
  },

  getUnitType: async (id) => {
    await delay(300);
    const unitType = mockUnitTypes.find((u) => u.id === parseInt(id));
    if (!unitType) throw new Error("Không tìm thấy đơn vị tính");
    return { success: true, data: unitType, isSuccess: true, unitType };
  },

  getUnitTypesByProduct: async (productId) => {
    await delay(300);
    const product = products.find((p) => p.id === parseInt(productId));
    const productUnitTypes = product?.ProductUnitTypes || [];
    return { success: true, data: productUnitTypes, isSuccess: true, unitTypes: productUnitTypes };
  },

  getBaseUnitTypes: async () => {
    await delay(300);
    const baseUnits = mockUnitTypes.filter((u) => u.isBaseUnit === true);
    return { success: true, data: baseUnits, isSuccess: true, unitTypes: baseUnits };
  },

  getOtherUnitTypes: async () => {
    await delay(300);
    const otherUnits = mockUnitTypes.filter((u) => u.isBaseUnit !== true);
    return { success: true, data: otherUnits, isSuccess: true, unitTypes: otherUnits };
  },

  addUnitType: async (unitTypeData) => {
    await delay(500);
    const newUnitType = {
      ...unitTypeData,
      id: mockUnitTypes.length + 1,
      createdAt: new Date().toISOString(),
    };
    mockUnitTypes.push(newUnitType);
    return { success: true, data: newUnitType, message: "Thêm đơn vị tính thành công", isSuccess: true, unitType: newUnitType };
  },

  updateUnitType: async (id, unitTypeData) => {
    await delay(500);
    const index = mockUnitTypes.findIndex((u) => u.id === parseInt(id));
    if (index === -1) throw new Error("Không tìm thấy đơn vị tính");
    mockUnitTypes[index] = { ...mockUnitTypes[index], ...unitTypeData, updatedAt: new Date().toISOString() };
    return { success: true, data: mockUnitTypes[index], message: "Cập nhật đơn vị tính thành công", isSuccess: true, unitType: mockUnitTypes[index] };
  },

  // ============= PRICE HEADER APIs =============
  getPriceHeaders: async () => {
    await delay(300);
    return { success: true, data: priceHeaders, isSuccess: true, priceHeaders };
  },

  getPriceHeader: async (id) => {
    await delay(300);
    // Support both string IDs (e.g. "PRICE_HEADER_001") and numeric ids
    const priceHeader = priceHeaders.find((p) => {
      if (p.id === id) return true;
      if (String(p.id) === String(id)) return true;
      // legacy numeric id handling
      if (!Number.isNaN(Number(p.id)) && Number(p.id) === Number(id)) return true;
      return false;
    });
    if (!priceHeader) throw new Error("Không tìm thấy bảng giá");
    return { success: true, data: priceHeader, isSuccess: true, priceHeader };
  },

  getActivePriceHeaders: async () => {
    await delay(300);
    // Some data uses `state`, some use `isActive` — support both
    const activeHeaders = priceHeaders.filter((p) => p.isActive === true || p.state === true);
    return { success: true, data: activeHeaders, isSuccess: true, priceHeaders: activeHeaders };
  },

  addPriceHeader: async (priceHeaderData) => {
    await delay(500);
    const newPriceHeader = {
      ...priceHeaderData,
      id: priceHeaders.length + 1,
      createdAt: new Date().toISOString(),
      isActive: priceHeaderData.isActive !== undefined ? priceHeaderData.isActive : false,
    };
    priceHeaders.push(newPriceHeader);
    return { success: true, data: newPriceHeader, message: "Thêm bảng giá thành công", isSuccess: true, priceHeader: newPriceHeader };
  },

  updatePriceHeader: async (id, priceHeaderData) => {
    await delay(500);
    const index = priceHeaders.findIndex((p) => p.id === parseInt(id));
    if (index === -1) throw new Error("Không tìm thấy bảng giá");
    priceHeaders[index] = { ...priceHeaders[index], ...priceHeaderData, updatedAt: new Date().toISOString() };
    return { success: true, data: priceHeaders[index], message: "Cập nhật bảng giá thành công", isSuccess: true, priceHeader: priceHeaders[index] };
  },

  // ============= PRICE LINE APIs =============
  getPriceLinesByHeader: async (headerId) => {
    await delay(300);
    // price lines may reference header with different property names (ListPricesHeaderId or priceHeaderId)
    const lines = priceLines.filter((pl) => {
      // direct match on string ids
      if (pl.ListPricesHeaderId && String(pl.ListPricesHeaderId) === String(headerId)) return true;
      if (pl.priceHeaderId && String(pl.priceHeaderId) === String(headerId)) return true;
      // numeric fallback
      if (pl.ListPricesHeaderId && !Number.isNaN(Number(pl.ListPricesHeaderId)) && Number(pl.ListPricesHeaderId) === Number(headerId)) return true;
      if (pl.priceHeaderId && !Number.isNaN(Number(pl.priceHeaderId)) && Number(pl.priceHeaderId) === Number(headerId)) return true;
      return false;
    });
    return { success: true, data: lines, isSuccess: true, priceLines: lines };
  },

  updatePrice: async (id, priceData) => {
    await delay(500);
    const index = priceLines.findIndex((p) => p.id === parseInt(id));
    if (index === -1) throw new Error("Không tìm thấy giá sản phẩm");
    priceLines[index] = { ...priceLines[index], ...priceData, updatedAt: new Date().toISOString() };
    return { success: true, data: priceLines[index], message: "Cập nhật giá thành công", isSuccess: true, price: priceLines[index] };
  },

  // ============= PROMOTION UPDATE =============
  updatePromotion: async (id, promotionData) => {
    await delay(500);
    const index = promotions.findIndex((p) => p.id === parseInt(id));
    if (index === -1) throw new Error("Không tìm thấy khuyến mãi");
    promotions[index] = { ...promotions[index], ...promotionData, updatedAt: new Date().toISOString() };
    return { success: true, data: promotions[index], message: "Cập nhật khuyến mãi thành công", isSuccess: true, promotion: promotions[index] };
  },
};
