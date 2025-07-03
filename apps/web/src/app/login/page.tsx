'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, gql } from '@apollo/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const loginSchema = z.object({
  email: z.string().email('Por favor, insira um e-mail válido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login: authLogin } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [login, { loading, error: apiError }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      authLogin(data.login.token);
      router.push('/');
    },
    onError: (error) => {
      console.error('Login Error:', error);
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    login({ variables: data });
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="p-8 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-50">Bem-vindo de Volta!</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu.email@exemplo.com" {...register('email')} />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register('password')} />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          {apiError && <p className="text-red-500 text-sm text-center">{apiError.message}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Não tem uma conta?{' '}
          <Link href="/signup" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
            Crie uma agora
          </Link>
        </p>
      </div>
    </div>
  );
}