import { Cart } from '@/components/sections';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'My cart page',
};

export default function CartPage({}) {
  return (
    <main className='container flex justify-center'>
      <Suspense fallback={<>Loading...</>}>
        <Cart />
      </Suspense>
    </main>
  );
}
