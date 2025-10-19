// import { useEffect, useState } from "react";
// import AdminLayout from "@/components/admin/AdminLayout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { Search, Eye, ShoppingCart, Send } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import axios from "axios";

// interface OrderItem {
//   productName: string;
//   quantity: number;
//   price: number;
// }

// interface ShippingAddress {
//   street: string;
//   city: string;
//   state: string;
//   zip: string;
// }

// interface UserInfo {
//   name: string;
//   email: string;
// }

// interface Order {
//   _id: string;
//   user: UserInfo;
//   items: OrderItem[];
//   totalPrice: number;
//   paymentmethod: string;
//   status: string;
//   shippingAddress: ShippingAddress;
//   createdAt: string;
//   notes?: string;
//   paymentLink?: string;
// }

// const Orders = () => {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [paymentLink, setPaymentLink] = useState("");
//   const [notes, setNotes] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 🔹 Load all orders
//   const loadOrders = async () => {
//     try {
//       const res = await axios.get("https://realdealbackend.onrender.com/api/orders");
//       setOrders(res.data || []);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load orders");
//     }
//   };

//   useEffect(() => {
//     loadOrders();
//   }, []);

//   // 🔹 Send payment link + confirm order
//   const handleForwardPayment = async () => {
//     if (!selectedOrder) return;
//     if (!paymentLink.trim()) {
//       toast.error("Please provide a payment link");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         `https://realdealbackend.onrender.com/api/confirm/forward-payment/${selectedOrder._id}`,
//         { paymentLink, notes }
//       );

//       if (res.status === 200) {
//         toast.success("Order confirmed and email sent!");
//         setSelectedOrder(null);
//         setPaymentLink("");
//         setNotes("");
//         loadOrders();
//       }
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Failed to confirm order");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredOrders = orders.filter(
//     (o) =>
//       o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       o.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       o.user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const getStatusColor = (status: string) => {
//     const colors: Record<string, string> = {
//       pending: "bg-yellow-100 text-yellow-700",
//       confirmed: "bg-blue-100 text-blue-700",
//       shipped: "bg-purple-100 text-purple-700",
//       delivered: "bg-green-100 text-green-700",
//       cancelled: "bg-red-100 text-red-700",
//     };
//     return colors[status] || "bg-muted text-muted-foreground";
//   };

//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold">Orders</h1>
//             <p className="text-muted-foreground">Manage and confirm customer orders</p>
//           </div>
//         </div>

//         <Card>
//           <CardContent className="p-6">
//             <div className="flex items-center gap-4 mb-6">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search orders by ID, customer name, or email..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="pl-9"
//                 />
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="text-left p-3 font-medium">Order ID</th>
//                     <th className="text-left p-3 font-medium">Customer</th>
//                     <th className="text-left p-3 font-medium">Date</th>
//                     <th className="text-right p-3 font-medium">Total</th>
//                     <th className="text-center p-3 font-medium">Status</th>
//                     <th className="text-right p-3 font-medium">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredOrders.map((order) => (
//                     <tr key={order._id} className="border-b hover:bg-muted/50 transition-colors">
//                       <td className="p-3 font-medium">{order._id}</td>
//                       <td className="p-3">
//                         <div>
//                           <p className="font-medium">{order.user.name}</p>
//                           <p className="text-sm text-muted-foreground">{order.user.email}</p>
//                         </div>
//                       </td>
//                       <td className="p-3 text-muted-foreground">
//                         {new Date(order.createdAt).toLocaleDateString()}
//                       </td>
//                       <td className="p-3 text-right font-medium">${order.totalPrice.toFixed(2)}</td>
//                       <td className="p-3 text-center">
//                         <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
//                       </td>
//                       <td className="p-3 text-right">
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => setSelectedOrder(order)}
//                         >
//                           <Eye className="w-4 h-4" />
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               {filteredOrders.length === 0 && (
//                 <div className="text-center py-12">
//                   <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
//                   <p className="text-muted-foreground">No orders found</p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Dialog for Confirming / Viewing Order */}
//       <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Order Details - {selectedOrder?._id}</DialogTitle>
//             <DialogDescription>Confirm and send payment link to the customer</DialogDescription>
//           </DialogHeader>

//           {selectedOrder && (
//             <div className="space-y-6">
//               {/* Customer Info */}
//               <div>
//                 <h3 className="font-semibold mb-2">Customer</h3>
//                 <p>{selectedOrder.user.name}</p>
//                 <p className="text-sm text-muted-foreground">{selectedOrder.user.email}</p>
//               </div>

//               {/* Items */}
//               <div>
//                 <h3 className="font-semibold mb-3">Order Items</h3>
//                 {selectedOrder.items.map((item, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-between bg-muted/50 p-2 rounded-md mb-2"
//                   >
//                     <span>
//                       {item.productName} × {item.quantity}
//                     </span>
//                     <span>${(item.price * item.quantity).toFixed(2)}</span>
//                   </div>
//                 ))}
//                 <div className="font-bold text-right mt-2">
//                   Total: ${selectedOrder.totalPrice.toFixed(2)}
//                 </div>
//               </div>

//               {/* Confirm Payment Link */}
//               <div className="space-y-3">
//                 <Label>Payment Link</Label>
//                 <Input
//                   placeholder="Enter payment link"
//                   value={paymentLink}
//                   onChange={(e) => setPaymentLink(e.target.value)}
//                 />

//                 <Label>Admin Notes (optional)</Label>
//                 <Input
//                   placeholder="Write any special instructions..."
//                   value={notes}
//                   onChange={(e) => setNotes(e.target.value)}
//                 />
//               </div>

//               <Button
//                 onClick={handleForwardPayment}
//                 disabled={loading}
//                 className="w-full flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   "Sending..."
//                 ) : (
//                   <>
//                     <Send className="w-4 h-4" /> Confirm & Send Payment Link
//                   </>
//                 )}
//               </Button>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </AdminLayout>
//   );
// };

// export default Orders;

















import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Eye, ShoppingCart, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface UserInfo {
  name: string;
  email: string;
}

interface Order {
  _id: string;
  user: UserInfo;
  items: OrderItem[];
  totalPrice: number;
  paymentmethod: string;
  status: string;
  createdAt: string;
  notes?: string;
  paymentLink?: string;
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentLink, setPaymentLink] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Load all orders
  const loadOrders = async () => {
    try {
      const res = await axios.get("https://realdealbackend.onrender.com/api/orders");

      const mappedOrders = (res.data || []).map((o: any) => ({
        ...o,
        items: (o.cartItems ?? []).map((c: any) => ({
          productName: c.name,
          quantity: c.quantity,
          price: c.price,
        })),
      }));

      setOrders(mappedOrders);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load orders");
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // 🔹 Send payment link + confirm order
  const handleForwardPayment = async () => {
    if (!selectedOrder) return;
    if (!paymentLink.trim()) {
      toast.error("Please provide a payment link");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `https://realdealbackend.onrender.com/api/confirm/forward-payment/${selectedOrder._id}`,
        { paymentLink, notes }
      );

      if (res.status === 200) {
        toast.success("Order confirmed and email sent!");
        setSelectedOrder(null);
        setPaymentLink("");
        setNotes("");
        loadOrders();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to confirm order");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-muted text-muted-foreground";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage and confirm customer orders</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders by ID, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Order ID</th>
                    <th className="text-left p-3 font-medium">Customer</th>
                    <th className="text-left p-3 font-medium">Date</th>
                    <th className="text-right p-3 font-medium">Total</th>
                    <th className="text-center p-3 font-medium">Status</th>
                    <th className="text-right p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3 font-medium">{order._id}</td>
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{order.user.name}</p>
                          <p className="text-sm text-muted-foreground">{order.user.email}</p>
                        </div>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right font-medium">${order.totalPrice.toFixed(2)}</td>
                      <td className="p-3 text-center">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for Confirming / Viewing Order */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?._id}</DialogTitle>
            <DialogDescription>Confirm and send payment link to the customer</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2">Customer</h3>
                <p>{selectedOrder.user.name}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.user.email}</p>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold mb-3">Order Items</h3>
                {(selectedOrder.items ?? []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-muted/50 p-2 rounded-md mb-2"
                  >
                    <span>
                      {item.productName} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="font-bold text-right mt-2">
                  Total: ${selectedOrder.totalPrice.toFixed(2)}
                </div>
              </div>

              {/* Confirm Payment Link */}
              <div className="space-y-3">
                <Label>Payment Link</Label>
                <Input
                  placeholder="Enter payment link"
                  value={paymentLink}
                  onChange={(e) => setPaymentLink(e.target.value)}
                />

                <Label>Admin Notes (optional)</Label>
                <Input
                  placeholder="Write any special instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button
                onClick={handleForwardPayment}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Confirm & Send Payment Link
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Orders;
