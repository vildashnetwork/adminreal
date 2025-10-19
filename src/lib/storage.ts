// Local storage utilities for managing admin data
export interface Product {
  id: string;
  name: string;
  description: string;
  specifications: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  category: string;
  weight: number;
  images: string[];
  stock: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  totalOrders: number;
}

// Storage keys
const PRODUCTS_KEY = 'reeldeal_products';
const CATEGORIES_KEY = 'reeldeal_categories';
const ORDERS_KEY = 'reeldeal_orders';
const CUSTOMERS_KEY = 'reeldeal_customers';

// Initialize with sample data
export const initializeSampleData = () => {
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    const categories: Category[] = [
      { id: '1', name: 'Fishing Rods', slug: 'fishing-rods', createdAt: new Date().toISOString() },
      { id: '2', name: 'Fishing Line', slug: 'fishing-line', createdAt: new Date().toISOString() },
      { id: '3', name: 'Lures', slug: 'lures', createdAt: new Date().toISOString() },
      { id: '4', name: 'Reels', slug: 'reels', createdAt: new Date().toISOString() },
      { id: '5', name: 'Tackle Boxes', slug: 'tackle-boxes', createdAt: new Date().toISOString() },
    ];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }

  if (!localStorage.getItem(PRODUCTS_KEY)) {
    const products: Product[] = [
      {
        id: '1',
        name: 'OceanMaster Pro Rod',
        description: 'Professional grade fishing rod for deep sea fishing',
        specifications: '7ft length, medium-heavy action, carbon fiber construction',
        price: 199.99,
        compareAtPrice: 249.99,
        sku: 'ROD-001',
        category: 'Fishing Rods',
        weight: 8.5,
        images: ['/placeholder.svg'],
        stock: 15,
        createdAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Bass Assassin Lure',
        description: 'Highly effective lure for bass fishing',
        specifications: '3.5 inches, realistic swimming action, multiple color options',
        price: 12.99,
        sku: 'LURE-023',
        category: 'Lures',
        weight: 0.5,
        images: ['/placeholder.svg'],
        stock: 45,
        createdAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Braided Fishing Line 20lb',
        description: 'High-strength braided fishing line',
        specifications: '300 yards, 20lb test, low stretch',
        price: 34.99,
        sku: 'LINE-009',
        category: 'Fishing Line',
        weight: 1.2,
        images: ['/placeholder.svg'],
        stock: 3,
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }

  if (!localStorage.getItem(CUSTOMERS_KEY)) {
    const customers: Customer[] = [
      {
        id: '1',
        name: 'John Angler',
        email: 'john.angler@example.com',
        registeredAt: '2023-10-15T10:00:00Z',
        totalOrders: 3,
      },
      {
        id: '2',
        name: 'Sarah Fisher',
        email: 'sarah.fisher@example.com',
        registeredAt: '2023-10-20T14:30:00Z',
        totalOrders: 1,
      },
    ];
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  }

  if (!localStorage.getItem(ORDERS_KEY)) {
    const orders: Order[] = [
      {
        id: 'RD-1001',
        customerId: '1',
        customerName: 'John Angler',
        customerEmail: 'john.angler@example.com',
        shippingAddress: {
          street: '123 Harbor Lane',
          city: 'Coastal Bay',
          state: 'CA',
          zip: '90210',
        },
        items: [
          { productId: '1', productName: 'OceanMaster Pro Rod', quantity: 1, price: 199.99 },
          { productId: '2', productName: 'Bass Assassin Lure', quantity: 2, price: 12.99 },
        ],
        total: 225.97,
        status: 'processing',
        createdAt: '2023-10-27T09:00:00Z',
      },
      {
        id: 'RD-1002',
        customerId: '2',
        customerName: 'Sarah Fisher',
        customerEmail: 'sarah.fisher@example.com',
        shippingAddress: {
          street: '456 Marina Drive',
          city: 'Seaside',
          state: 'FL',
          zip: '33139',
        },
        items: [
          { productId: '3', productName: 'Braided Fishing Line 20lb', quantity: 1, price: 34.99 },
        ],
        total: 34.99,
        status: 'shipped',
        trackingNumber: 'TRK123456789',
        createdAt: '2023-10-26T15:30:00Z',
      },
    ];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
};

// Products
export const getProducts = (): Product[] => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProducts = (products: Product[]) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updates };
    saveProducts(products);
    return products[index];
  }
  return null;
};

export const deleteProduct = (id: string) => {
  const products = getProducts();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
};

// Categories
export const getCategories = (): Category[] => {
  const data = localStorage.getItem(CATEGORIES_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCategories = (categories: Category[]) => {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

export const addCategory = (name: string) => {
  const categories = getCategories();
  const newCategory: Category = {
    id: Date.now().toString(),
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
    createdAt: new Date().toISOString(),
  };
  categories.push(newCategory);
  saveCategories(categories);
  return newCategory;
};

export const deleteCategory = (id: string) => {
  const categories = getCategories();
  const filtered = categories.filter(c => c.id !== id);
  saveCategories(filtered);
};

// Orders
export const getOrders = (): Order[] => {
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const updateOrderStatus = (id: string, status: Order['status'], trackingNumber?: string) => {
  const orders = getOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index !== -1) {
    orders[index].status = status;
    if (trackingNumber) {
      orders[index].trackingNumber = trackingNumber;
    }
    saveOrders(orders);
    return orders[index];
  }
  return null;
};

// Customers
export const getCustomers = (): Customer[] => {
  const data = localStorage.getItem(CUSTOMERS_KEY);
  return data ? JSON.parse(data) : [];
};
