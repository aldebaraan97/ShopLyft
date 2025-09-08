import Button from '@mui/material/Button';
import { useMutation } from '@tanstack/react-query';
import { createCheckoutSession } from '../../api/checkout';

export default function CartCheckoutButton({ cart, userId }) {
  const { mutate: startCheckout, isPending } = useMutation({
    mutationFn: () => {
      if (!userId) throw new Error('Missing user');
      if (!cart?.items?.length) throw new Error('Cart is empty');
      return createCheckoutSession(userId);
    },
    onSuccess: ({ url }) => { window.location.href = url; },
    onError: (err) => {
      console.error(err);
      alert(err?.response?.data || err.message || 'Failed to start checkout');
    }
  });

  return (
    <Button
      variant="contained"
      disabled={!cart?.items?.length || !userId || isPending}
      onClick={() => startCheckout()}
    >
      {isPending ? 'Redirecting…' : 'Checkout'}
    </Button>
  );
}
