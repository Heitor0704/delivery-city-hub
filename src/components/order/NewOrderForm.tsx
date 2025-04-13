
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface NewOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateOrder: (orderData: any) => void;
}

export function NewOrderForm({ open, onOpenChange, onCreateOrder }: NewOrderFormProps) {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("money");
  const [items, setItems] = useState([{ 
    name: "", 
    quantity: 1, 
    price: "", 
    observation: "" 
  }]);
  const [deliveryFee, setDeliveryFee] = useState("5.00");

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, price: "", observation: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const incrementQuantity = (index: number) => {
    const newItems = [...items];
    newItems[index].quantity = (newItems[index].quantity as number) + 1;
    setItems(newItems);
  };

  const decrementQuantity = (index: number) => {
    const newItems = [...items];
    if (newItems[index].quantity > 1) {
      newItems[index].quantity = (newItems[index].quantity as number) - 1;
      setItems(newItems);
    }
  };

  const calculateTotal = () => {
    const itemsTotal = items.reduce((sum, item) => {
      const price = parseFloat(item.price as string) || 0;
      const qty = item.quantity as number || 0;
      return sum + (price * qty);
    }, 0);
    
    const fee = parseFloat(deliveryFee) || 0;
    return (itemsTotal + fee).toFixed(2);
  };

  const handleSubmit = () => {
    // Validate form
    if (!customerName || !customerPhone || !address || !paymentMethod) {
      toast({ 
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Check if there are items and they have names and prices
    if (!items.length || items.some(item => !item.name || !item.price)) {
      toast({ 
        title: "Itens inválidos",
        description: "Por favor, adicione pelo menos um item com nome e preço.",
        variant: "destructive" 
      });
      return;
    }

    // Create order object
    const orderData = {
      id: `#PED-${Math.floor(1000 + Math.random() * 9000)}`,
      cliente: customerName,
      telefone: customerPhone,
      endereco: address,
      pagamento: getPaymentMethodLabel(paymentMethod),
      data: new Date().toLocaleString("pt-BR"),
      status: "aguardando",
      itens: items.map(item => ({
        nome: item.name,
        quantidade: item.quantity,
        valor: `R$ ${parseFloat(item.price as string).toFixed(2)}`,
        observacao: item.observation
      })),
      taxaEntrega: `R$ ${parseFloat(deliveryFee).toFixed(2)}`,
      valor: `R$ ${calculateTotal()}`,
      total: `R$ ${calculateTotal()}`
    };

    onCreateOrder(orderData);
    
    // Reset form
    setCustomerName("");
    setCustomerPhone("");
    setAddress("");
    setPaymentMethod("money");
    setItems([{ name: "", quantity: 1, price: "", observation: "" }]);
    setDeliveryFee("5.00");
    
    onOpenChange(false);
    
    toast({
      title: "Pedido criado",
      description: `Pedido ${orderData.id} criado com sucesso!`,
    });
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "money": return "Dinheiro";
      case "credit": return "Cartão de crédito";
      case "debit": return "Cartão de débito";
      case "pix": return "PIX";
      default: return method;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Pedido</DialogTitle>
          <DialogDescription>
            Crie um novo pedido preenchendo os dados abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Nome do Cliente *</Label>
              <Input 
                id="customerName" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                placeholder="Nome completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Telefone *</Label>
              <Input 
                id="customerPhone" 
                value={customerPhone} 
                onChange={(e) => setCustomerPhone(e.target.value)} 
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço de Entrega *</Label>
            <Textarea 
              id="address" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              placeholder="Endereço completo com número e referência"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
            <Select 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="money">Dinheiro</SelectItem>
                <SelectItem value="credit">Cartão de Crédito</SelectItem>
                <SelectItem value="debit">Cartão de Débito</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Itens do Pedido *</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-1" /> Adicionar Item
              </Button>
            </div>

            {items.map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-[3fr,1fr,1fr,auto] gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`item-name-${index}`}>Nome do Item *</Label>
                      <Input 
                        id={`item-name-${index}`} 
                        value={item.name} 
                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                        placeholder="Nome do produto"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`item-qty-${index}`}>Qtd.</Label>
                      <div className="flex">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          className="rounded-r-none"
                          onClick={() => decrementQuantity(index)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <Input 
                          id={`item-qty-${index}`} 
                          value={item.quantity} 
                          onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value) || 1)}
                          className="rounded-none text-center w-12 min-w-[3rem] px-0"
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon" 
                          className="rounded-l-none"
                          onClick={() => incrementQuantity(index)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor={`item-price-${index}`}>Preço (R$) *</Label>
                      <Input 
                        id={`item-price-${index}`} 
                        value={item.price} 
                        onChange={(e) => handleItemChange(index, "price", e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="flex items-end md:pb-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(index)}
                        disabled={items.length === 1}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor={`item-obs-${index}`}>Observação</Label>
                    <Textarea 
                      id={`item-obs-${index}`} 
                      value={item.observation} 
                      onChange={(e) => handleItemChange(index, "observation", e.target.value)}
                      placeholder="Observações sobre o item (opcional)"
                      rows={1}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
            <Input 
              id="deliveryFee" 
              value={deliveryFee} 
              onChange={(e) => setDeliveryFee(e.target.value)} 
              placeholder="0.00"
            />
          </div>

          <div className="rounded-lg p-4 border border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total do Pedido:</span>
              <span className="font-bold text-lg">R$ {calculateTotal()}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Criar Pedido</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
