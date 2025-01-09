import { useEffect } from 'react';
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
import { formatCNPJ, formatPhone } from '@/lib/utils';
import { useForm } from '@/hooks/useForm';

interface CustomerFormProps {
  onSubmit: (data: Customer) => void;
  initialData?: Customer;
}

export default function CustomerForm({ onSubmit, initialData }: CustomerFormProps) {
  const {
    values,
    handleChange,
    handleSubmit,
    reset,
    errors,
    isSubmitting
  } = useForm<Customer>({
    initialValues: {
      id: '',
      razaoSocial: '',
      nomeFantasia: '',
      cnpj: '',
      email: '',
      telefone: '',
      endereco: {
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
      },
    },
    validate: (values) => {
      const errors: Partial<Record<keyof Customer, string>> = {};
      
      if (!values.razaoSocial) {
        errors.razaoSocial = 'Razão Social é obrigatória';
      }
      if (!values.nomeFantasia) {
        errors.nomeFantasia = 'Nome Fantasia é obrigatório';
      }
      if (!values.cnpj || values.cnpj.replace(/\D/g, '').length !== 14) {
        errors.cnpj = 'CNPJ inválido';
      }
      if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = 'E-mail inválido';
      }
      if (values.telefone && values.telefone.replace(/\D/g, '').length < 10) {
        errors.telefone = 'Telefone inválido';
      }

      return errors;
    },
    onSubmit
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData]);

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    handleChange('cnpj', formatCNPJ(value));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    handleChange('telefone', formatPhone(value));
  };

  return (
    <Form>
      <form id="customer-form" onSubmit={handleSubmit} className="space-y-6">
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
                  />
                </FormControl>
                {errors.nomeFantasia && <FormMessage>{errors.nomeFantasia}</FormMessage>}
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
                    onChange={handleCNPJChange}
                    maxLength={18}
                    placeholder="00.000.000/0000-00"
                  />
                </FormControl>
                {errors.cnpj && <FormMessage>{errors.cnpj}</FormMessage>}
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
                    onChange={handlePhoneChange}
                    maxLength={15}
                    placeholder="(00) 00000-0000"
                  />
                </FormControl>
                {errors.telefone && <FormMessage>{errors.telefone}</FormMessage>}
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
                  />
                </FormControl>
                {errors.email && <FormMessage>{errors.email}</FormMessage>}
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Endereço (Opcional)</h3>
          <div className="grid grid-cols-2 gap-6">
            <FormField
              name="endereco.logradouro"
              render={() => (
                <FormItem>
                  <FormLabel>Logradouro</FormLabel>
                  <FormControl>
                    <Input
                      value={values.endereco?.logradouro}
                      onChange={(e) => handleChange('endereco.logradouro', e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="endereco.numero"
              render={() => (
                <FormItem>
                  <FormLabel>Número</FormLabel>
                  <FormControl>
                    <Input
                      value={values.endereco?.numero}
                      onChange={(e) => handleChange('endereco.numero', e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="endereco.complemento"
              render={() => (
                <FormItem>
                  <FormLabel>Complemento</FormLabel>
                  <FormControl>
                    <Input
                      value={values.endereco?.complemento}
                      onChange={(e) => handleChange('endereco.complemento', e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="endereco.bairro"
              render={() => (
                <FormItem>
                  <FormLabel>Bairro</FormLabel>
                  <FormControl>
                    <Input
                      value={values.endereco?.bairro}
                      onChange={(e) => handleChange('endereco.bairro', e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="endereco.cidade"
              render={() => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input
                      value={values.endereco?.cidade}
                      onChange={(e) => handleChange('endereco.cidade', e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="endereco.estado"
              render={() => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <FormControl>
                    <Input
                      value={values.endereco?.estado}
                      onChange={(e) => handleChange('endereco.estado', e.target.value)}
                      maxLength={2}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              name="endereco.cep"
              render={() => (
                <FormItem>
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input
                      value={values.endereco?.cep}
                      onChange={(e) => handleChange('endereco.cep', e.target.value)}
                      maxLength={8}
                      placeholder="00000-000"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {!initialData && (
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            Cadastrar Sacado
          </Button>
        )}
      </form>
    </Form>
  );
}