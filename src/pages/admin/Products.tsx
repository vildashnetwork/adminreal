import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Pencil, Trash2, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Product {
  _id: string;
  ProductName: string;
  SKU: string;
  Description: string;
  Specifications: string;
  Price: number;
  CompareatPrice?: number;
  Weight: string;
  Category: string;
  StockQuantity: number;
  img3?: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch all products
  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:1200/add');
      if (res.status === 200) {
        setProducts(res.data.fishingTools || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ✅ Delete product by ID
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:1200/add/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete product');
    } finally {
      setDeleteId(null);
    }
  };

  // ✅ Search filter
  const filteredProducts = products.filter(
    (p) =>
      p.ProductName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.SKU?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.Category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Stock badge
  const getStockBadge = (stock: number) => {
    if (stock === 0)
      return <Badge className="bg-destructive/10 text-destructive">Out of Stock</Badge>;
    if (stock < 10)
      return <Badge className="bg-warning/10 text-warning">Low Stock</Badge>;
    return <Badge className="bg-success/10 text-success">In Stock</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button onClick={() => navigate('/admin/products/new')} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products by name, SKU, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading products...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Product</th>
                      <th className="text-left p-3 font-medium">SKU</th>
                      <th className="text-left p-3 font-medium">Category</th>
                      <th className="text-right p-3 font-medium">Price</th>
                      <th className="text-right p-3 font-medium">Stock</th>
                      <th className="text-center p-3 font-medium">Status</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product._id}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                              {product.img3 ? (
                                <img
                                  src={product.img3}
                                  alt={product.ProductName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-6 h-6 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.ProductName}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {product.Description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">{product.SKU}</td>
                        <td className="p-3">{product.Category}</td>
                        <td className="p-3 text-right font-medium">${product.Price}</td>
                        <td className="p-3 text-right">{product.StockQuantity}</td>
                        <td className="p-3 text-center">
                          {getStockBadge(product.StockQuantity)}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/products/edit/${product._id}`)
                              }
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(product._id)}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No products found</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product from your
              inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Products;
