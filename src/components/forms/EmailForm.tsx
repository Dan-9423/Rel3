import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Customer } from '@/types/customer';
import { EmailData } from '@/types/email';
import { useForm } from '@/hooks/useForm';
import { formatCurrency } from '@/lib/utils';

interface EmailFormProps {
  onSubmit: (data: EmailData) => void;
  customers: Customer[];
}

export default function EmailForm({ onSubmit, customers }: EmailFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);

  const {
    values,
    handleChange,
    handleSubmit,
    reset,
    errors,
    isSubmitting
  } = useForm<EmailData>({
    initialValues: {
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      email: '',
      telefone: '',
      numeroNF: '',
      valorTotal: 0,
    },
    validate: (values) => {
      const errors: Partial<Record<keyof EmailData, string>> = {};
      
      if (!values.razaoSocial) {
        errors.razaoSocial = 'Razão Social é obrigatória';
      }
      if (!values.email) {
        errors.email = 'E-mail é obrigatório';
      }
      if (!values.numeroNF) {
        errors.numeroNF = 'Número da NF é obrigatório';
      }
      if (values.valorTotal <= 0) {
        errors.valorTotal = 'Valor total deve ser maior que zero';
      }

      return errors;
    },
    onSubmit: (values) => {
      onSubmit(values);
      reset();
    }
  });

  const handleCustomerSelect = (customer: Customer) => {
    handleChange('razaoSocial', customer.razaoSocial);
    handleChange('nomeFantasia', customer.nomeFantasia);
    handleChange('cnpj', customer.cnpj);
    handleChange('email', customer.email);
    handleChange('telefone', customer.telefone || '');
    setShowCustomerSearch(false);
    setSearchQuery('');
  };

  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove o prefixo R$ e espaços
    value = value.replace(/^R\$\s?/, '');
    
    // Se o valor estiver vazio, define como R$ 0,00
    if (!value) {
      e.target.value = 'R$ 0,00';
      handleChange('valorTotal', 0);
      return;
    }
    
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
    
    // Converte para número (em centavos)
    const cents = parseInt(numericValue, 10);
    
    // Converte centavos para reais
    const reais = cents / 100;
    
    // Formata o valor
    const formatted = formatCurrency(reais);
    e.target.value = formatted;
    
    // Atualiza o valor no formulário
    handleChange('valorTotal', reais);
  };

  const filteredCustomers = customers.filter(customer =>
    searchQuery && (
      customer.razaoSocial.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.nomeFantasia.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.cnpj.includes(searchQuery)
    )
  );

  return (
    <Form>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowCustomerSearch(true)}
            placeholder="Buscar sacado por nome, nome fantasia ou CNPJ..."
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          {showCustomerSearch && filteredCustomers.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-popover rounded-lg shadow-lg border">
              <ul className="py-1">
                {filteredCustomers.map((customer) => (
                  <li
                    key={customer.id}
                    className="px-4 py-2 hover:bg-accent cursor-pointer"
                    onClick={() => handleCustomerSelect(customer)}
                  >
                    <div className="font-medium">{customer.razaoSocial}</div>
                    <div className="text-sm text-muted-foreground">
                      {customer.nomeFantasia} • {customer.cnpj}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            name="razaoSocial"
            render={() => (
              <FormItem>
                <FormLabel>Razão Social</FormLabel>
                <FormControl>
                  <Input
                    value={values.razaoSocial}
                    onChange={(e) => handleChange('razaoSocial', e.target.value)}
                    readOnly
                  />
                </FormControl>
                {errors.razaoSocial && <FormMessage>{errors.razaoSocial}</FormMessage>}
              </FormItem>
            )}
          />

          <FormField
            name="nomeFantasia"
            render={() => (
              <FormItem>
                <FormLabel>Nome Fantasia</FormLabel>
                <FormControl>
                  <Input
                    value={values.nomeFantasia}
                    onChange={(e) => handleChange('nomeFantasia', e.target.value)}
                    readOnly
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="cnpj"
            render={() => (
              <FormItem>
                <FormLabel>CNPJ</FormLabel>
                <FormControl>
                  <Input
                    value={values.cnpj}
                    onChange={(e) => handleChange('cnpj', e.target.value)}
                    readOnly
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="email"
            render={() => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    value={values.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    type="email"
                    readOnly
                  />
                </FormControl>
                {errors.email && <FormMessage>{errors.email}</FormMessage>}
              </FormItem>
            )}
          />

          <FormField
            name="numeroNF"
            render={() => (
              <FormItem>
                <FormLabel>Número da NF</FormLabel>
                <FormControl>
                  <Input
                    value={values.numeroNF}
                    onChange={(e) => handleChange('numeroNF', e.target.value)}
                  />
                </FormControl>
                {errors.numeroNF && <FormMessage>{errors.numeroNF}</FormMessage>}
              </FormItem>
            )}
          />

          <FormField
            name="telefone"
            render={() => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    value={values.telefone}
                    onChange={(e) => handleChange('telefone', e.target.value)}
                    readOnly
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            name="valorTotal"
            render={() => (
              <FormItem className="col-span-2">
                <FormLabel>Valor Total</FormLabel>
                <FormControl>
                  <Input
                    onChange={handleCurrencyInput}
                    onFocus={(e) => {
                      if (e.target.value === 'R$ 0,00') {
                        e.target.value = 'R$ ';
                      }
                    }}
                    defaultValue="R$ 0,00"
                    placeholder="R$ 0,00"
                  />
                </FormControl>
                {errors.valorTotal && <FormMessage>{errors.valorTotal}</FormMessage>}
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          Visualizar E-mail
        </Button>
      </form>
    </Form>
  );
}